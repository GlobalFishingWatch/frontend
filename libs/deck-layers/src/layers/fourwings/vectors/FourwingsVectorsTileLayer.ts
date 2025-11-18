import type { DefaultProps, Layer, LayerContext, LayersList, UpdateParameters } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type { TileLayerProps } from '@deck.gl/geo-layers'
import { TileLayer } from '@deck.gl/geo-layers'
import type { TileLoadProps } from '@deck.gl/geo-layers/dist/tileset-2d'
import { parse } from '@loaders.gl/core'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type {
  FourwingsFeature,
  FourwingsInterval,
  ParseFourwingsVectorsOptions,
} from '@globalfishingwatch/deck-loaders'
import { FourwingsVectorsLoader, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import { HEATMAP_API_TILES_URL } from '../fourwings.config'
import type {
  BaseFourwingsLayerProps,
  FourwingsDeckSublayer,
  FourwingsDeckVectorSublayer,
  FourwingsPickingObject,
  FourwingsVisualizationMode,
} from '../fourwings.types'
import type { FourwingsHeatmapTilesCache } from '../heatmap/fourwings-heatmap.types'
import {
  getDataUrlBySublayer,
  getFourwingsChunk,
  getResolutionByVisualizationMode,
  getTileDataCache,
  getZoomOffsetByResolution,
} from '../heatmap/fourwings-heatmap.utils'

import { FourwingsVectorsLayer } from './FourwingsVectorsLayer'

export type FourwingsVectorsTileLayerState = {
  error: string
  tilesCache: FourwingsHeatmapTilesCache
}

export type _FourwingsVectorsTileLayerProps<DataT = FourwingsFeature> = Omit<
  BaseFourwingsLayerProps,
  'sublayers'
> & {
  data?: DataT
  maxVelocity?: number
  availableIntervals?: FourwingsInterval[]
  highlightedFeatures?: FourwingsPickingObject[]
  visualizationMode: FourwingsVisualizationMode
  sublayers: FourwingsDeckVectorSublayer[]
}

export type FourwingsVectorsTileLayerProps = _FourwingsVectorsTileLayerProps &
  Partial<TileLayerProps>

const defaultProps: DefaultProps<FourwingsVectorsTileLayerProps> = {
  maxRequests: 100,
  debounceTime: 500,
  maxVelocity: 5,
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
      }),
    }
  }

  getError(): string {
    return this.state.error
  }

  _onLayerError = (error: Error) => {
    console.warn(error.message)
    this.setState({ error: error.message })
    return true
  }

  _fetchTimeseriesTileData: any = async (tile: TileLoadProps) => {
    const { startTime, endTime, sublayers, tilesUrl, extentStart, availableIntervals } = this.props
    // Ensure 'u' (eastward) direction always goes first
    const vectorLayers = sublayers.sort((a, b) => (a.direction === 'u' ? -1 : 1))
    const cols: number[] = []
    const rows: number[] = []
    const scale: number[] = []
    const offset: number[] = []
    const noDataValue: number[] = []
    const interval = getFourwingsInterval(startTime, endTime, availableIntervals)
    const chunk = getFourwingsChunk({
      start: startTime,
      end: endTime,
      availableIntervals,
      chunksBuffer: this.chunksBuffer,
    })

    const getSublayerData: any = async (sublayer: FourwingsDeckSublayer, sublayerIndex: number) => {
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
      return await response.arrayBuffer()
    }

    const promises = vectorLayers.map(getSublayerData) as Promise<ArrayBuffer>[]
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
      return null
    }

    const arrayBuffers = settledPromises.flatMap((d) => {
      return d.status === 'fulfilled' && d.value !== undefined ? d.value : []
    })

    const data = await parse(
      arrayBuffers.filter(Boolean) as ArrayBuffer[],
      FourwingsVectorsLoader,
      {
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
          tile,
          buffersLength: settledPromises.map((p) =>
            p.status === 'fulfilled' && p.value !== undefined ? p.value.byteLength : 0
          ),
        } as ParseFourwingsVectorsOptions,
      }
    )

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
    const { startTime, endTime, availableIntervals } = props
    const { tilesCache } = this.state
    const zoom = Math.round(this.context.viewport.zoom)
    const isStartOutRange = startTime < tilesCache.start
    const isEndOutRange = endTime > tilesCache.end
    // TODO debug why not re-rendering on out of range
    // TODO debug why re-renders when not needed
    const needsCacheKeyUpdate =
      isStartOutRange ||
      isEndOutRange ||
      getFourwingsInterval(startTime, endTime, availableIntervals) !== tilesCache.interval ||
      zoom !== tilesCache.zoom
    if (needsCacheKeyUpdate) {
      requestAnimationFrame(() => {
        this.setState({
          tilesCache: getTileDataCache({
            zoom,
            startTime,
            endTime,
            availableIntervals,
          }),
        })
      })
    }
  }

  renderLayers(): Layer<Record<string, unknown>> | LayersList {
    const { zoom } = this.context.viewport
    if (zoom === undefined) {
      return []
    }
    const { tilesCache } = this.state
    const { visualizationMode, maxRequests, debounceTime, maxZoom } = this.props

    const cacheKey = this._getTileDataCacheKey()
    const resolution = getResolutionByVisualizationMode(visualizationMode)
    return new TileLayer(
      this.props,
      this.getSubLayerProps({
        id: `tiles-${visualizationMode}`,
        tileSize: 512,
        tilesCache,
        minZoom: 0,
        onTileError: this._onLayerError,
        maxZoom: maxZoom || 8,
        refinementStrategy: 'no-overlap',
        zoomOffset: getZoomOffsetByResolution(resolution!, zoom),
        opacity: 1,
        maxRequests,
        debounceTime,
        getTileData: this._getTileData,
        updateTriggers: {
          getTileData: [cacheKey],
        },
        renderSubLayers: (props: any) => {
          return new FourwingsVectorsLayer(props)
        },
      })
    )
  }

  getLayerInstance() {
    const layer = this.getSubLayers()[0] as TileLayer
    return layer
  }

  getFourwingsLayers() {
    return this.props.sublayers
  }

  getTilesData({ aggregated } = {} as { aggregated?: boolean }) {
    const layer = this.getLayerInstance()
    if (layer) {
      const resolution = getResolutionByVisualizationMode(this.props.visualizationMode)
      const offset = getZoomOffsetByResolution(resolution!, this.context.viewport.zoom)
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

  getChunk = () => {
    const { startTime, endTime, availableIntervals } = this.props
    return getFourwingsChunk({ start: startTime, end: endTime, availableIntervals })
  }
}
