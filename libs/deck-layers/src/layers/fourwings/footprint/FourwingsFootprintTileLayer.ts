import type { DefaultProps, Layer, LayerContext, LayersList, UpdateParameters } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type {
  _Tile2DHeader as Tile2DHeader,
  _TileLoadProps as TileLoadProps,
  TileLayerProps,
} from '@deck.gl/geo-layers'
import { TileLayer } from '@deck.gl/geo-layers'

import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import type {
  FourwingsFeature,
  FourwingsInterval,
  FourwingsValuesAndStartFrameFeature,
} from '@globalfishingwatch/deck-loaders'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import {
  FOURWINGS_MAX_CACHE_BYTE_SIZE,
  FOURWINGS_MAX_ZOOM,
  FOURWINGS_TILE_SIZE,
  HEATMAP_API_TILES_URL,
} from '#layers/fourwings/fourwings.config'
import type {
  FourwingsHeatmapTilesCache,
  FourwingsTileLayerColorScale,
  GetViewportDataParams,
} from '#layers/fourwings/fourwings.types'
import { FourwingsAggregationOperation } from '#layers/fourwings/fourwings.types'
import {
  EMPTY_FOURWINGS_TILE_DATA,
  getAreTilePositionsAvailable,
} from '#layers/fourwings/fourwings-tile.utils'
import { fetchFourwingsTileData } from '#layers/fourwings/heatmap/fourwings-heatmap.fetch'
import {
  getFourwingsChunk,
  getZoomOffsetByResolution,
} from '#layers/fourwings/heatmap/fourwings-heatmap.utils'

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
  declare state: FourwingsFootprintTileLayerState

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      error: '',
      tilesCache: this._getTileDataCache({
        startTime: this.props.startTime,
        endTime: this.props.endTime,
        availableIntervals: this.props.availableIntervals,
      }),
      viewportLoaded: false,
    }
  }

  get cacheHash(): string {
    return this._getTileDataCacheKey()
  }

  get debounceTime(): number {
    return this.props.debounceTime ?? 0
  }

  get viewportLoaded(): boolean {
    return this.state?.viewportLoaded ?? false
  }

  getError(): string {
    return this.state?.error
  }

  _onLayerError = (error: Error) => {
    console.warn(error.message)
    this.setState({ error: error.message })
    return true
  }

  _onViewportLoad = (tiles: Tile2DHeader[]) => {
    this.setState({ viewportLoaded: true })
    this.props.onViewportLoad?.(tiles)
  }

  _fetchTileData: any = async (tile: TileLoadProps) => {
    const { startTime, endTime, sublayers, availableIntervals, tilesUrl, extentStart } = this.props
    const interval = getFourwingsInterval(startTime, endTime, availableIntervals)
    const chunk = getFourwingsChunk({ start: startTime, end: endTime, availableIntervals })
    this.setState({ rampDirty: true })

    return await fetchFourwingsTileData({
      tile,
      chunk,
      interval,
      sublayers,
      startTime,
      endTime,
      aggregationOperation: FourwingsAggregationOperation.Sum,
      tilesUrl,
      extentStart,
    })
  }

  _getTileData: TileLayerProps['getTileData'] = (tile) => {
    if (tile.signal?.aborted) {
      return EMPTY_FOURWINGS_TILE_DATA
    }
    if (this.state.viewportLoaded) {
      this.setState({ viewportLoaded: false })
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
    const { start, end, bufferedStart } = getFourwingsChunk({
      start: startTime,
      end: endTime,
      availableIntervals,
    })
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
    const { resolution = 'default' } = this.props
    const cacheKey = this._getTileDataCacheKey()

    return new TileLayer(
      this.props,
      this.getSubLayerProps({
        id: `tiles-footprint`,
        tileSize: FOURWINGS_TILE_SIZE,
        tilesCache,
        minZoom: 0,
        onTileError: this._onLayerError,
        onViewportLoad: this._onViewportLoad,
        maxCacheByteSize: FOURWINGS_MAX_CACHE_BYTE_SIZE,
        maxZoom: FOURWINGS_MAX_ZOOM,
        zoomOffset: getZoomOffsetByResolution(resolution, this.context.viewport.zoom),
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
      const subLayer = tile.layers?.[0] as FourwingsFootprintLayer
      const data = subLayer?.getData?.() ?? []
      return data.length ? [data] : []
    }) as FourwingsFeature[][]
  }

  getData() {
    return this.getTilesData().flat()
  }

  getIsPositionsAvailable() {
    return getAreTilePositionsAvailable(this.getTilesData())
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
      return dataFiltered as FourwingsFeature[] | FourwingsValuesAndStartFrameFeature[]
    }
    return []
  }

  getFourwingsLayers() {
    return this.props.sublayers
  }

  getInterval = () => {
    const { startTime, endTime, availableIntervals } = this.props
    return getFourwingsInterval(startTime, endTime, availableIntervals)
  }

  getChunk = () => {
    const { startTime, endTime, availableIntervals } = this.props
    return getFourwingsChunk({ start: startTime, end: endTime, availableIntervals })
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
