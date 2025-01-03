import type { Layer, LayerContext, LayersList, DefaultProps, UpdateParameters } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type { TileLayerProps } from '@deck.gl/geo-layers'
import { TileLayer } from '@deck.gl/geo-layers'
import { parse } from '@loaders.gl/core'
import type { TileLoadProps } from '@deck.gl/geo-layers/dist/tileset-2d'
import type {
  FourwingsFeature,
  FourwingsInterval,
  ParseFourwingsOptions,
} from '@globalfishingwatch/deck-loaders'
import { FourwingsLoader, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { HEATMAP_API_TILES_URL, FOURWINGS_MAX_ZOOM } from '../fourwings.config'
import type {
  BaseFourwingsLayerProps,
  FourwingsDeckSublayer,
  FourwingsVisualizationMode,
} from '../fourwings.types'
import {
  getFourwingsChunk,
  getDataUrlBySublayer,
  getTileDataCache,
  getResolutionByVisualizationMode,
  getZoomOffsetByResolution,
} from '../heatmap/fourwings-heatmap.utils'
import type { FourwingsHeatmapTilesCache } from '../heatmap/fourwings-heatmap.types'
import { FourwingsCurrentsLayer } from './FourwingsCurrentsLayer'

export type FourwingsCurrentsTileLayerState = {
  error: string
  tilesCache: FourwingsHeatmapTilesCache
}

export type _FourwingsCurrentsTileLayerProps<DataT = FourwingsFeature> = BaseFourwingsLayerProps & {
  data?: DataT
  availableIntervals?: FourwingsInterval[]
  visualizationMode: FourwingsVisualizationMode
}

export type FourwingsCurrentsTileLayerProps = _FourwingsCurrentsTileLayerProps &
  Partial<TileLayerProps>

const defaultProps: DefaultProps<FourwingsCurrentsTileLayerProps> = {
  maxRequests: 100,
  debounceTime: 500,
  tilesUrl: HEATMAP_API_TILES_URL,
}

export class FourwingsCurrentsTileLayer extends CompositeLayer<FourwingsCurrentsTileLayerProps> {
  static layerName = 'FourwingsCurrentsTileLayer'
  static defaultProps = defaultProps
  initialBinsLoad = false
  state!: FourwingsCurrentsTileLayerState

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      error: '',
      tilesCache: getTileDataCache({
        zoom: Math.round(this.context.viewport.zoom),
        startTime: this.props.startTime,
        endTime: this.props.endTime,
        availableIntervals: this.props.availableIntervals,
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
    const visibleSublayers = sublayers.filter((sublayer) => sublayer.visible)
    let cols: number = 0
    let rows: number = 0
    let scale: number = 0
    let offset: number = 0
    let noDataValue: number = 0
    const interval = getFourwingsInterval(startTime, endTime, availableIntervals)
    const chunk = getFourwingsChunk(startTime, endTime, availableIntervals)
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
      return null
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
    return this._fetchTimeseriesTileData(tile)
  }

  _getTileDataCacheKey = (): string => {
    // Needs to remove zoom to avoid double loading tiles as deck.gl internally trigger the funcion on zoom changes
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { zoom, ...tilesCache } = this.state.tilesCache
    const dataCache = Object.values(tilesCache || {}).join(',')
    const sublayersIds = this.props.sublayers?.map((s) => s.id).join(',')
    const sublayersDatasets = this.props.sublayers?.flatMap((s) => s.datasets || []).join(',')
    const sublayersFilters = this.props.sublayers?.flatMap((s) => s.filter || []).join(',')
    const sublayersVesselGroups = this.props.sublayers?.map((s) => s.vesselGroups || []).join(',')
    return [
      dataCache,
      sublayersIds,
      sublayersDatasets,
      sublayersFilters,
      sublayersVesselGroups,
    ].join('-')
  }

  updateState({ props }: UpdateParameters<this>) {
    const { startTime, endTime, availableIntervals } = props
    const { tilesCache } = this.state
    const zoom = Math.round(this.context.viewport.zoom)
    const isStartOutRange = startTime < tilesCache.start
    const isEndOutRange = endTime > tilesCache.end
    const needsCacheKeyUpdate =
      isStartOutRange ||
      isEndOutRange ||
      getFourwingsInterval(startTime, endTime) !== tilesCache.interval ||
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
    const { visualizationMode, maxRequests, debounceTime } = this.props
    console.log('🚀 ~ renderLayers ~ visualizationMode:', visualizationMode)
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
        maxZoom: FOURWINGS_MAX_ZOOM,
        zoomOffset: getZoomOffsetByResolution(resolution!, zoom),
        opacity: 1,
        maxRequests,
        debounceTime,
        getTileData: this._getTileData,
        updateTriggers: {
          getTileData: [cacheKey],
        },
        renderSubLayers: (props: any) => {
          return new FourwingsCurrentsLayer(props)
        },
      })
    )
  }

  getLayerInstance() {
    const layer = this.getSubLayers()[0] as TileLayer
    return layer
  }
}
