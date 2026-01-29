import type { DefaultProps, Layer, LayerContext, LayersList, UpdateParameters } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type {
  _Tile2DHeader as Tile2DHeader,
  _TileLoadProps as TileLoadProps,
  TileLayerProps,
} from '@deck.gl/geo-layers'
import { TileLayer } from '@deck.gl/geo-layers'
import { parse } from '@loaders.gl/core'
import { debounce } from 'es-toolkit'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import type {
  FourwingsFeature,
  FourwingsInterval,
  ParseFourwingsVectorsOptions,
} from '@globalfishingwatch/deck-loaders'
import { FourwingsVectorsLoader, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import { hexToRgbaString, removeOutliers } from '../../../utils'
import {
  DYNAMIC_RAMP_VECTOR_CHANGE_THRESHOLD,
  FOURWINGS_TILE_SIZE,
  HEATMAP_API_TILES_URL,
  MAX_RAMP_VALUES,
  VECTORS_MAX_ZOOM,
} from '../fourwings.config'
import type {
  BaseFourwingsLayerProps,
  FourwingsDeckVectorSublayer,
  FourwingsPickingObject,
  GetViewportDataParams,
} from '../fourwings.types'
import type { FourwingsHeatmapTilesCache } from '../heatmap/fourwings-heatmap.types'
import { FourwingsAggregationOperation } from '../heatmap/fourwings-heatmap.types'
import {
  getDataUrl,
  getFourwingsChunk,
  getIntervalFrames,
  getTileDataCache,
  sliceCellValues,
} from '../heatmap/fourwings-heatmap.utils'

import { FourwingsVectorsLayer } from './FourwingsVectorsLayer'

export type FourwingsVectorsTileLayerState = {
  error: string
  tilesCache: FourwingsHeatmapTilesCache
  maxVelocity: number
  rampDirty: boolean
  viewportLoaded: boolean
}

export type _FourwingsVectorsTileLayerProps<DataT = FourwingsFeature> = Omit<
  BaseFourwingsLayerProps,
  'sublayers'
> & {
  data?: DataT
  debugTiles?: boolean
  availableIntervals?: FourwingsInterval[]
  highlightedFeatures?: FourwingsPickingObject[]
  sublayers: FourwingsDeckVectorSublayer[]
  minVisibleValue?: number
  maxVisibleValue?: number
  temporalAggregation?: boolean
}

// TODO: decide if we intergrate it into the generic FourwingsLayer
export type FourwingsVectorsTileLayerProps = _FourwingsVectorsTileLayerProps &
  Partial<TileLayerProps>

const defaultProps: DefaultProps<FourwingsVectorsTileLayerProps> = {
  maxRequests: 100,
  debounceTime: 500,
  maxZoom: VECTORS_MAX_ZOOM,
  tilesUrl: HEATMAP_API_TILES_URL,
}

export class FourwingsVectorsTileLayer extends CompositeLayer<FourwingsVectorsTileLayerProps> {
  static layerName = 'FourwingsVectorsTileLayer'
  static defaultProps = defaultProps
  initialBinsLoad = false
  // Disable extra chunks buffer to avoid loading a lot of extra data
  chunksBuffer = 0
  state!: FourwingsVectorsTileLayerState

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      error: '',
      tilesCache: getTileDataCache({
        zoom: Math.round(this.context.viewport.zoom),
        startTime: this.props.startTime,
        endTime: this.props.endTime,
        availableIntervals: this.props.availableIntervals,
        chunksBuffer: this.chunksBuffer,
        temporalAggregation: this.props.temporalAggregation,
      }),
      maxVelocity: 0,
      rampDirty: false,
      viewportLoaded: false,
    }
  }

  get cacheHash(): string {
    const { id, startTime, endTime } = this.props
    const colors = Array.from(new Set(this.props.sublayers.map((s) => s.color))).join(',')
    return `${id}-${startTime}-${endTime}-${colors}-${this.state?.rampDirty ?? false}-${this.viewportLoaded}`
  }

  get debounceTime(): number {
    return this.props.debounceTime ?? 0
  }

  get viewportLoaded(): boolean {
    return this.state?.viewportLoaded ?? false
  }

  getError(): string {
    return this.state.error
  }

  _onLayerError = (error: Error) => {
    console.warn(error.message)
    this.setState({ error: error.message })
    return true
  }

  _calculateMaxVelocity = (): number => {
    const { startTime, endTime, availableIntervals, temporalAggregation } = this.props
    const currentZoomData = this.getData()
    if (!currentZoomData.length) {
      return this.state.maxVelocity
    }

    const { startFrame, endFrame } = getIntervalFrames({
      startTime,
      endTime,
      availableIntervals,
      bufferedStart:
        getTileDataCache({
          zoom: Math.round(this.context.viewport.zoom),
          startTime: this.props.startTime,
          endTime: this.props.endTime,
          availableIntervals: this.props.availableIntervals,
          chunksBuffer: this.chunksBuffer,
        })?.bufferedStart || 0,
    })

    const dataSample =
      currentZoomData.length > MAX_RAMP_VALUES
        ? currentZoomData.filter(
            (d, i) => i % Math.ceil(currentZoomData.length / MAX_RAMP_VALUES) === 0
          )
        : currentZoomData

    const allVelocities = dataSample.flatMap((feature) => {
      if (!feature.properties?.velocities || !feature.properties.velocities.length) {
        return []
      }
      if (temporalAggregation) {
        return feature.properties.velocities
      }
      const slicedValues = sliceCellValues({
        values: feature.properties.velocities,
        startFrame,
        endFrame,
        startOffset: feature.properties.startOffsets?.[0] ?? 0,
      })
      return slicedValues.filter(Boolean)
    })

    if (!allVelocities.length) {
      return this.state.maxVelocity
    }

    const dataFiltered = removeOutliers({
      allValues: allVelocities,
      aggregationOperation: FourwingsAggregationOperation.Avg,
    })

    if (!dataFiltered.length) {
      return this.state.maxVelocity
    }

    const sorted = [...dataFiltered].sort((a, b) => a - b)
    return sorted[sorted.length - 1] || 1
  }

  updateMaxVelocity = debounce(
    () => {
      requestAnimationFrame(() => {
        const { maxVelocity: oldMaxVelocity } = this.state
        const newMaxVelocity = this._calculateMaxVelocity()
        let avgChange = Infinity

        if (oldMaxVelocity && oldMaxVelocity > 0) {
          const change = (Math.abs(newMaxVelocity - oldMaxVelocity) / oldMaxVelocity) * 100
          avgChange = change
        }

        if (avgChange > DYNAMIC_RAMP_VECTOR_CHANGE_THRESHOLD || !oldMaxVelocity) {
          this.setState({
            maxVelocity: newMaxVelocity,
            rampDirty: false,
            viewportLoaded: true,
          })
        } else {
          this.setState({ rampDirty: false, viewportLoaded: true })
        }
      })
    },
    (defaultProps.debounceTime as number) + 1
  )

  _onViewportLoad = (tiles: Tile2DHeader[]) => {
    this.updateMaxVelocity()
    if (this.props.onViewportLoad) {
      this.props.onViewportLoad(tiles)
    }
  }

  _fetchTimeseriesTileData: any = async (tile: TileLoadProps) => {
    const {
      startTime,
      endTime,
      sublayers,
      tilesUrl,
      extentStart,
      availableIntervals,
      temporalAggregation,
    } = this.props
    const sublayerIndex = 0
    // Ensure 'u' (eastward) direction always goes first
    const vectorLayers = sublayers.sort((a) => (a.direction === 'u' ? -1 : 1))
    const interval = getFourwingsInterval(startTime, endTime, availableIntervals)
    const chunk = temporalAggregation
      ? {
          id: `${startTime}-${endTime}-${interval}-${temporalAggregation}`,
          interval,
          start: startTime,
          end: endTime,
          bufferedStart: startTime,
          bufferedEnd: endTime,
        }
      : getFourwingsChunk({
          start: startTime,
          end: endTime,
          availableIntervals,
          chunksBuffer: this.chunksBuffer,
        })

    this.setState({ rampDirty: true })

    const url = getDataUrl({
      tile,
      chunk,
      sublayers: vectorLayers,
      mergeSublayerDatasets: false,
      tilesUrl,
      extentStart,
      temporalAggregation,
    }) as string

    const response = await GFWAPI.fetch<Response>(url, {
      signal: tile.signal,
      responseType: 'default',
    })

    if (response.status >= 400 && response.status !== 404) {
      throw new Error(response.statusText)
    }

    if (tile.signal?.aborted) {
      return null
    }

    const cols: number[] = []
    const rows: number[] = []
    const scale: number[] = []
    const offset: number[] = []
    const noDataValue: number[] = []
    if (response.headers.get('X-columns') && !cols[sublayerIndex]) {
      cols[sublayerIndex] = parseInt(response.headers.get('X-columns') as string)
    }
    if (response.headers.get('X-rows') && !rows[sublayerIndex]) {
      rows[sublayerIndex] = parseInt(response.headers.get('X-rows') as string)
    }
    if (response.headers.get('X-scale') && !scale[sublayerIndex]) {
      scale[sublayerIndex] = parseFloat(response.headers.get('X-scale') as string)
    }
    if (response.headers.get('X-offset') && !offset[sublayerIndex]) {
      offset[sublayerIndex] = parseInt(response.headers.get('X-offset') as string)
    }
    if (response.headers.get('X-empty-value') && !noDataValue[sublayerIndex]) {
      noDataValue[sublayerIndex] = parseInt(response.headers.get('X-empty-value') as string)
    }

    const arrayBuffer = await response.arrayBuffer()

    const data = await parse(arrayBuffer, FourwingsVectorsLoader, {
      worker: true,
      fourwingsVectors: {
        cols,
        rows,
        scale,
        offset,
        noDataValue,
        bufferedStartDate: chunk.bufferedStart,
        initialTimeRange: {
          start: startTime,
          end: endTime,
        },
        interval,
        temporalAggregation,
        tile,
      } as ParseFourwingsVectorsOptions,
    })

    return data
  }

  _getTileData: TileLayerProps['getTileData'] = (tile) => {
    if (tile.signal?.aborted) {
      return null
    }
    return this._fetchTimeseriesTileData(tile)
  }

  _getTileDataCacheKey = (): string => {
    // Needs to remove zoom to avoid double loading tiles as deck.gl internally trigger the funcion on zoom changes
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { zoom, ...tilesCache } = this.state.tilesCache
    const dataCache = Object.values(tilesCache || {}).join(',')
    const sublayersIds = this.props.sublayers?.map((s) => s.id).join(',')
    const sublayersDatasets = this.props.sublayers?.flatMap((s) => s.datasets || []).join(',')
    return [dataCache, sublayersIds, sublayersDatasets].join('-')
  }

  updateState({ props }: UpdateParameters<this>) {
    const { startTime, endTime, availableIntervals, temporalAggregation } = props
    const { tilesCache } = this.state
    const zoom = Math.round(this.context.viewport.zoom)
    const isStartOutRange = temporalAggregation
      ? startTime !== tilesCache.start
      : startTime < tilesCache.start
    const isEndOutRange = temporalAggregation
      ? endTime !== tilesCache.end
      : endTime > tilesCache.end
    const isDifferentZoom = zoom !== tilesCache.zoom
    const isDifferentTemporalAggregation = temporalAggregation !== tilesCache.temporalAggregation

    // TODO debug why not re-rendering on out of range
    // TODO debug why re-renders when not needed
    const needsCacheKeyUpdate =
      isStartOutRange ||
      isEndOutRange ||
      isDifferentTemporalAggregation ||
      getFourwingsInterval(startTime, endTime, availableIntervals) !== tilesCache.interval ||
      isDifferentZoom

    if (needsCacheKeyUpdate) {
      requestAnimationFrame(() => {
        this.setState({
          tilesCache: getTileDataCache({
            zoom,
            startTime,
            endTime,
            availableIntervals,
            chunksBuffer: this.chunksBuffer,
            temporalAggregation,
          }),
        })
      })
    }
  }

  getZoomOffset = () => {
    const zoom = this.context.viewport.zoom
    return zoom < 0.5 ? 0 : zoom < 1.5 ? -1 : -2
  }

  renderLayers(): Layer<Record<string, unknown>> | LayersList {
    const { zoom, latitude, longitude } = this.context.viewport as any
    if (zoom === undefined || (latitude === 0 && longitude === 0 && zoom === 0)) {
      return []
    }
    const { tilesCache, maxVelocity } = this.state
    const { maxRequests, debounceTime, maxZoom } = this.props

    const cacheKey = this._getTileDataCacheKey()
    const zoomOffset = this.getZoomOffset()

    return new TileLayer(
      this.props,
      this.getSubLayerProps({
        id: `tiles-vectors-${zoomOffset}`,
        tileSize: FOURWINGS_TILE_SIZE,
        tilesCache,
        minZoom: 0,
        onTileError: this._onLayerError,
        maxZoom: maxZoom || 8,
        refinementStrategy: 'never',
        zoomOffset,
        opacity: 1,
        maxRequests,
        debounceTime,
        getTileData: this._getTileData,
        updateTriggers: {
          getTileData: [cacheKey, zoomOffset],
          renderSubLayers: [maxVelocity],
        },
        onViewportLoad: this._onViewportLoad,
        renderSubLayers: (props: any) => {
          return new FourwingsVectorsLayer({
            ...props,
            visible: maxVelocity > 0,
            maxVelocity,
          })
        },
      })
    )
  }

  getLayerInstance() {
    const layer = this.getSubLayers()[0] as TileLayer
    return layer
  }

  getFourwingsLayers() {
    return [this.props.sublayers[0]]
  }

  getAggregationOperation() {
    return FourwingsAggregationOperation.Avg
  }

  getTilesData() {
    const layer = this.getLayerInstance()
    const tiles = layer?.state?.tileset?.selectedTiles ?? []

    if (!layer || !tiles.length) {
      return [[]] as FourwingsFeature[][]
    }

    return tiles.flatMap((tile) => {
      if (!tile.isSelected || !tile.isVisible || !tile.isLoaded) {
        return []
      }
      const subLayer = tile.layers?.[0] as FourwingsVectorsLayer
      const data = subLayer?.getData?.() ?? []
      return data.length ? [data] : []
    })
  }

  getData() {
    return this.getTilesData().flat()
  }

  getChunk = () => {
    const { startTime, endTime, availableIntervals } = this.props
    return getFourwingsChunk({ start: startTime, end: endTime, availableIntervals })
  }

  getViewportData(params = {} as GetViewportDataParams) {
    const data = this.getData()
    const { viewport } = this.context
    const [west, north] = viewport.unproject([0, 0])
    const [east, south] = viewport.unproject([viewport.width, viewport.height])
    if (data?.length) {
      const dataFiltered = filterFeaturesByBounds({
        features: data,
        bounds: { north, south, west, east },
        ...params,
      })
      return dataFiltered as FourwingsFeature[]
    }
    return []
  }

  getMaxVelocity = () => {
    return this.state.maxVelocity
  }

  getVisualizationMode = () => {
    return 'vectors'
  }

  getColorScale = () => {
    if (!this.state.maxVelocity) {
      return {
        colorDomain: [],
        colorRange: [],
      }
    }
    return {
      colorDomain: [
        this.state.maxVelocity * 0.25,
        this.state.maxVelocity * 0.5,
        this.state.maxVelocity * 0.75,
        this.state.maxVelocity,
      ],
      colorRange: [
        hexToRgbaString(this.props.sublayers[0].color, 0.25),
        hexToRgbaString(this.props.sublayers[0].color, 0.5),
        hexToRgbaString(this.props.sublayers[0].color, 0.75),
        hexToRgbaString(this.props.sublayers[0].color, 1),
      ],
    }
  }
}
