import type { DefaultProps, Layer, LayerContext, LayersList, UpdateParameters } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type { TileLayerProps } from '@deck.gl/geo-layers'
import { TileLayer } from '@deck.gl/geo-layers'
import type { TileLoadProps } from '@deck.gl/geo-layers/dist/tileset-2d'
import { parse } from '@loaders.gl/core'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import type {
  FourwingsFeature,
  FourwingsInterval,
  FourwingsValuesAndDatesFeature,
  ParseFourwingsOptions,
} from '@globalfishingwatch/deck-loaders'
import { FourwingsLoader, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import {
  FOURWINGS_MAX_ZOOM,
  HEATMAP_API_TILES_URL,
  MAX_POSITIONS_PER_TILE_SUPPORTED,
} from '../fourwings.config'
import type {
  FourwingsDeckSublayer,
  FourwingsHeatmapTilesCache,
  FourwingsTileLayerColorScale,
  GetViewportDataParams,
} from '../fourwings.types'
import { FourwingsAggregationOperation } from '../fourwings.types'
import {
  aggregateCellTimeseries,
  getDataUrlBySublayer,
  getFourwingsChunk,
} from '../heatmap/fourwings-heatmap.utils'

import type {
  FourwingsFootprintTileLayerProps,
  FourwingsFootprintTileLayerState,
} from './fourwings-footprint.types'
import { FourwingsFootprintLayer } from './FourwingsFootprintLayer'

const defaultProps: DefaultProps<FourwingsFootprintTileLayerProps> = {
  maxRequests: 100,
  debounceTime: 500,
  color: '#FFFFFF',
  tilesUrl: HEATMAP_API_TILES_URL,
}

export class FourwingsFootprintTileLayer extends CompositeLayer<FourwingsFootprintTileLayerProps> {
  static layerName = 'FourwingsFootprintTileLayer'
  static defaultProps = defaultProps
  initialBinsLoad = false
  state!: FourwingsFootprintTileLayerState

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      error: '',
      tilesCache: this._getTileDataCache({
        startTime: this.props.startTime,
        endTime: this.props.endTime,
        availableIntervals: this.props.availableIntervals,
      }),
    }
  }

  get isLoaded(): boolean {
    return super.isLoaded
  }

  getError(): string {
    return this.state.error
  }

  _onLayerError = (error: Error) => {
    console.warn(error.message)
    this.setState({ error: error.message })
    return true
  }

  _fetchTileData: any = async (tile: TileLoadProps) => {
    const { startTime, endTime, sublayers, availableIntervals, tilesUrl, extentStart } = this.props
    const visibleSublayers = sublayers.filter((sublayer) => sublayer.visible)
    let cols: number = 0
    let rows: number = 0
    let scale: number = 0
    let offset: number = 0
    let noDataValue: number = 0
    const interval = getFourwingsInterval(startTime, endTime, availableIntervals)
    const chunk = getFourwingsChunk(startTime, endTime, availableIntervals)
    this.setState({ rampDirty: true })
    const getSublayerData: any = async (sublayer: FourwingsDeckSublayer) => {
      const url = getDataUrlBySublayer({
        tile,
        chunk,
        sublayer,
        tilesUrl,
        extentStart,
      }) as string
      const response = await GFWAPI.fetch<Response>(url!, {
        signal: tile.signal,
        responseType: 'default',
      })
      if (response.status >= 400 && response.status !== 404) {
        throw new Error(response.statusText)
      }
      if (response.headers.get('X-columns') && !cols) {
        cols = parseInt(response.headers.get('X-columns') as string)
      }
      if (response.headers.get('X-rows') && !rows) {
        rows = parseInt(response.headers.get('X-rows') as string)
      }
      if (response.headers.get('X-scale') && !scale) {
        scale = parseFloat(response.headers.get('X-scale') as string)
      }
      if (response.headers.get('X-offset') && !offset) {
        offset = parseInt(response.headers.get('X-offset') as string)
      }
      if (response.headers.get('X-empty-value') && !noDataValue) {
        noDataValue = parseInt(response.headers.get('X-empty-value') as string)
      }
      return await response.arrayBuffer()
    }

    const promises = visibleSublayers.map(getSublayerData) as Promise<ArrayBuffer>[]
    const settledPromises = await Promise.allSettled(promises)

    const hasChunkError = settledPromises.some(
      (p) => p.status === 'rejected' && p.reason.status !== 404
    )
    if (hasChunkError) {
      const error =
        (settledPromises.find((p) => p.status === 'rejected' && p.reason.statusText) as any)?.reason
          .statuxText || 'Error loading chunk'
      throw new Error(error)
    }

    if (tile.signal?.aborted) {
      return
    }

    const arrayBuffers = settledPromises.flatMap((d) => {
      return d.status === 'fulfilled' && d.value !== undefined ? d.value : []
    })

    const data = await parse(arrayBuffers.filter(Boolean) as ArrayBuffer[], FourwingsLoader, {
      worker: true,
      fourwings: {
        sublayers: 1,
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
        tile,
        aggregationOperation: FourwingsAggregationOperation.Sum,
        buffersLength: settledPromises.map((p) =>
          p.status === 'fulfilled' && p.value !== undefined ? p.value.byteLength : 0
        ),
      } as ParseFourwingsOptions,
    })
    return data
  }

  _getTileData: TileLayerProps['getTileData'] = (tile) => {
    if (tile.signal?.aborted) {
      return null
    }
    return this._fetchTileData(tile)
  }

  _getTileDataCache = ({
    startTime,
    endTime,
    availableIntervals,
    compareStart,
    compareEnd,
  }: {
    startTime: number
    endTime: number
    availableIntervals?: FourwingsInterval[]
    compareStart?: number
    compareEnd?: number
  }): FourwingsHeatmapTilesCache => {
    const interval = getFourwingsInterval(startTime, endTime, availableIntervals)
    const { start, end, bufferedStart } = getFourwingsChunk(startTime, endTime, availableIntervals)
    const zoom = Math.round(this.context.viewport.zoom)
    return { zoom, start, end, bufferedStart, interval, compareStart, compareEnd }
  }

  _getTileDataCacheKey = (): string => {
    const dataCache = Object.values(this.state.tilesCache || {}).join(',')
    const sublayersIds = this.props.sublayers?.map((s) => s.id).join(',')
    const sublayersDatasets = this.props.sublayers?.flatMap((s) => s.datasets || []).join(',')
    const sublayersFilters = this.props.sublayers?.flatMap((s) => s.filter || []).join(',')
    const sublayersVesselGroups = this.props.sublayers?.map((s) => s.vesselGroups || []).join(',')
    const sublayersVesselGroupsLength = this.props.sublayers
      ?.map((s) => s.vesselGroupsLength || [])
      .join(',')
    return [
      dataCache,
      sublayersIds,
      sublayersDatasets,
      sublayersFilters,
      sublayersVesselGroups,
      sublayersVesselGroupsLength,
    ].join('-')
  }

  updateState({ props }: UpdateParameters<this>) {
    const { startTime, endTime, availableIntervals } = props
    const { tilesCache } = this.state
    const isStartOutRange = startTime <= tilesCache.start
    const isEndOutRange = endTime >= tilesCache.end
    const needsCacheKeyUpdate =
      isStartOutRange ||
      isEndOutRange ||
      getFourwingsInterval(startTime, endTime, availableIntervals) !== tilesCache.interval
    if (needsCacheKeyUpdate) {
      this.setState({
        tilesCache: this._getTileDataCache({
          startTime,
          endTime,
          availableIntervals,
        }),
      })
    }
  }

  renderLayers(): Layer<Record<string, unknown>> | LayersList {
    const { tilesCache } = this.state
    const cacheKey = this._getTileDataCacheKey()

    return new TileLayer(
      this.props,
      this.getSubLayerProps({
        id: `tiles-footprint`,
        tileSize: 512,
        tilesCache,
        minZoom: 0,
        onTileError: this._onLayerError,
        maxZoom: FOURWINGS_MAX_ZOOM,
        zoomOffset: 1,
        opacity: 1,
        maxRequests: this.props.maxRequests,
        debounceTime: this.props.debounceTime,
        getTileData: this._getTileData,
        updateTriggers: {
          getTileData: [cacheKey],
        },
        renderSubLayers: (props: any) => {
          return new FourwingsFootprintLayer(props)
        },
      })
    )
  }

  getLayerInstance() {
    const layer = this.getSubLayers()[0] as TileLayer
    return layer
  }

  getTilesData({ aggregated } = {} as { aggregated?: boolean }) {
    const layer = this.getLayerInstance()
    if (layer) {
      const offset = 1
      const roudedZoom = Math.round(this.context.viewport.zoom)
      return layer
        .getSubLayers()
        .map((l: any) => {
          if (!l.props.tile.isVisible) {
            return []
          }
          if (l.props.tile.zoom === l.props.maxZoom) {
            return l.getData({ aggregated })
          }
          return l.props.tile.zoom === roudedZoom + offset ? l.getData({ aggregated }) : []
        })
        .filter((t) => t.length > 0) as FourwingsFeature[][]
    }
    return [[]] as FourwingsFeature[][]
  }

  getData({ aggregated } = {} as { aggregated?: boolean }) {
    return this.getTilesData({ aggregated }).flat()
  }

  getIsPositionsAvailable({ aggregated } = {} as { aggregated?: boolean }) {
    const tilesData = this.getTilesData({ aggregated })
    return !tilesData.some(
      (tileData) =>
        tileData.reduce((acc, feature) => {
          if (!feature.properties?.values?.length) {
            return acc
          }
          return (
            acc +
            feature.properties?.values.flat().reduce((acc, value) => {
              return value ? acc + value : acc
            }, 0)
          )
        }, 0) > MAX_POSITIONS_PER_TILE_SUPPORTED
    )
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
      return dataFiltered as FourwingsFeature[] | FourwingsValuesAndDatesFeature[]
    }
    return []
  }

  getFourwingsLayers() {
    return this.props.sublayers
  }

  getTimeseries() {
    const data = this.getData()
    if (data?.length) {
      const sublayers = this.getFourwingsLayers()
      const cells = aggregateCellTimeseries(data, sublayers)
      return cells
    }
    return []
  }

  getInterval = () => {
    const { startTime, endTime, availableIntervals } = this.props
    return getFourwingsInterval(startTime, endTime, availableIntervals)
  }

  getChunk = () => {
    const { startTime, endTime, availableIntervals } = this.props
    return getFourwingsChunk(startTime, endTime, availableIntervals)
  }

  getColorDomain = () => {
    return undefined
  }

  getColorRange = () => {
    return undefined
  }

  getColorScale = () => {
    return {} as FourwingsTileLayerColorScale
  }
}
