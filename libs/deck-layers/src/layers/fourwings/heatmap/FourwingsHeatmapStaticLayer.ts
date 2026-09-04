import type { DefaultProps, Layer, LayerContext, LayersList, UpdateParameters } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type {
  _Tile2DHeader as Tile2DHeader,
  _TileLoadProps as TileLoadProps,
  TileLayerProps,
} from '@deck.gl/geo-layers'
import { TileLayer } from '@deck.gl/geo-layers'
import { scaleLinear } from 'd3-scale'
import { debounce } from 'es-toolkit'
import { stringify } from 'qs'

import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import type { FourwingsFeature } from '@globalfishingwatch/deck-loaders'
import { getTimeRangeKey } from '@globalfishingwatch/deck-loaders'

import type { ColorRampId } from '#config/colorRamps.config'
import { LayerGroup } from '#config/sort.config'
import {
  FOURWINGS_MAX_CACHE_BYTE_SIZE,
  FOURWINGS_MAX_ZOOM,
  FOURWINGS_TILE_SIZE,
  HEATMAP_API_TILES_URL,
} from '#layers/fourwings/fourwings.config'
import type { GetViewportDataParams } from '#layers/fourwings/fourwings.types'
import { EMPTY_FOURWINGS_TILE_DATA } from '#layers/fourwings/fourwings-tile.utils'
import { getColorRamp } from '#utils/colorRamps'

import { fetchFourwingsTileData } from './fourwings-heatmap.fetch'
import type {
  FourwingsChunk,
  FourwingsHeatmapStaticLayerProps,
  FourwingsTileLayerState,
} from './fourwings-heatmap.types'
import { FourwingsAggregationOperation, FourwingsComparisonMode } from './fourwings-heatmap.types'
import {
  getFourwingsColorDomain,
  getSublayersVisibleValuesHash,
  getURLFromTemplate,
  getZoomOffsetByResolution,
} from './fourwings-heatmap.utils'
import { FourwingsHeatmapLayer } from './FourwingsHeatmapLayer'

const defaultProps: DefaultProps<FourwingsHeatmapStaticLayerProps> = {
  maxRequests: 100,
  debounceTime: 500,
  maxZoom: FOURWINGS_MAX_ZOOM,
  aggregationOperation: FourwingsAggregationOperation.Sum,
  tilesUrl: HEATMAP_API_TILES_URL,
  resolution: 'default',
}

/**
 * A static dataset has no time dimension, so the tile is requested with `temporal-aggregation=true`
 */
const STATIC_AVAILABLE_INTERVALS = ['YEAR'] as const
const STATIC_START_TIME = 0
const STATIC_END_TIME = Date.UTC(1971, 0, 1)
export const STATIC_START_FRAME = 0
export const STATIC_END_FRAME = 1

const EMPTY_STATIC_CHUNK: FourwingsChunk = {
  id: 'static',
  interval: STATIC_AVAILABLE_INTERVALS[0],
  start: STATIC_START_TIME,
  end: STATIC_END_TIME,
  bufferedStart: STATIC_START_TIME,
  bufferedEnd: STATIC_END_TIME,
}

export class FourwingsHeatmapStaticLayer extends CompositeLayer<FourwingsHeatmapStaticLayerProps> {
  static layerName = 'FourwingsHeatmapStaticLayer'
  static defaultProps = defaultProps
  declare state: Omit<FourwingsTileLayerState, 'tilesCache'>

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      error: '',
      colorDomain: [],
      colorRanges: this._getColorRanges(),
      scales: [],
      rampDirty: false,
      viewportLoaded: false,
      tilesCacheUpdateTimeout: null,
    }
  }

  get cacheHash(): string {
    if (!this.state) {
      return ''
    }
    const colorRamps = this.props.sublayers?.map(({ colorRamp }) => colorRamp).join(',')
    return `${colorRamps}|${this.state.rampDirty}|${getSublayersVisibleValuesHash(this.props.sublayers)}`
  }

  get debounceTime(): number {
    return this.props.debounceTime ?? 0
  }

  get viewportLoaded(): boolean {
    return this.state?.viewportLoaded ?? false
  }

  _getState() {
    return this.state
  }

  _getColorRanges = () => {
    return this.props.sublayers.map(({ colorRamp }) =>
      getColorRamp({ rampId: colorRamp as ColorRampId })
    )
  }

  _onLayerError = (error: Error) => {
    if (!error.message.includes('404')) {
      this.setState({ error: error.message })
    }
    return true
  }

  getError(): string {
    return this.state?.error
  }

  _calculateColorDomain = () => {
    // Single dataview layer, so every sublayer carries the same range
    const { minVisibleValue, maxVisibleValue } = this.props.sublayers?.[0] || {}
    const colorDomain = getFourwingsColorDomain({
      features: this.getData(),
      aggregationOperation: this.props.aggregationOperation,
      startFrame: STATIC_START_FRAME,
      endFrame: STATIC_END_FRAME,
      timeRangeKey: getTimeRangeKey(STATIC_START_FRAME, STATIC_END_FRAME),
      minVisibleValue,
      maxVisibleValue,
    })
    return colorDomain.length ? colorDomain : this.getColorDomain()
  }

  _updateColorDomain = () => {
    const colorDomain = this._calculateColorDomain() as number[]
    const colorRanges = this._getColorRanges()
    if (colorDomain?.length && colorRanges[0]?.length) {
      this.setState({
        colorDomain,
        colorRanges,
        scales: [scaleLinear(colorDomain, colorRanges[0])],
        rampDirty: false,
      })
    }
  }

  debouncedUpdateColorDomain = debounce(() => {
    requestAnimationFrame(this._updateColorDomain)
  }, 500)

  _onViewportLoad = (tiles: Tile2DHeader[]) => {
    this.debouncedUpdateColorDomain()
    if (this.props.onViewportLoad) {
      this.props.onViewportLoad(tiles)
    }
    this.setState({ viewportLoaded: true })
  }

  _onTileLoad = () => {
    this.setState({ rampDirty: true, viewportLoaded: false })
  }

  /** No interval and no date-range: an aggregated tile has no time dimension */
  _getTileUrl = (tile: TileLoadProps) => {
    const { tilesUrl = HEATMAP_API_TILES_URL, sublayers } = this.props
    const filters = sublayers.flatMap((sublayer) => sublayer.filter || [])
    const params = {
      format: '4WINGS',
      'temporal-aggregation': true,
      datasets: sublayers.flatMap((sublayer) => sublayer.datasets),
      ...(filters.length && { filters }),
    }
    return getURLFromTemplate(`${tilesUrl}?${stringify(params, { arrayFormat: 'indices' })}`, tile)
  }

  _getTileData: TileLayerProps['getTileData'] = (tile: TileLoadProps) => {
    if (tile.signal?.aborted) {
      return EMPTY_FOURWINGS_TILE_DATA
    }
    return fetchFourwingsTileData({
      tile,
      // the chunk and interval only feed the frame math, which an aggregated tile does not use
      chunk: EMPTY_STATIC_CHUNK,
      interval: STATIC_AVAILABLE_INTERVALS[0],
      sublayers: this.props.sublayers,
      startTime: STATIC_START_TIME,
      endTime: STATIC_END_TIME,
      aggregationOperation: this.props.aggregationOperation,
      temporalAggregation: true,
      getUrl: () => this._getTileUrl(tile),
    })
  }

  _getTileDataCacheKey = (): string => {
    const sublayersIds = this.props.sublayers?.map((s) => s.id).join(',')
    const sublayersDatasets = this.props.sublayers?.flatMap((s) => s.datasets || []).join(',')
    const sublayersFilters = this.props.sublayers?.flatMap((s) => s.filter || []).join(',')
    return [sublayersIds, sublayersDatasets, sublayersFilters].join('-')
  }

  updateState({ props, oldProps }: UpdateParameters<this>) {
    const { sublayers } = props
    const oldColors = oldProps.sublayers?.map(({ colorRamp }) => colorRamp).join(',')
    const colors = sublayers?.map(({ colorRamp }) => colorRamp).join(',')
    const isColorChanged = oldColors !== colors

    const isVisibleValuesChanged =
      getSublayersVisibleValuesHash(sublayers) !== getSublayersVisibleValuesHash(oldProps.sublayers)
    if (isVisibleValuesChanged || isColorChanged) {
      this._updateColorDomain()
    }
  }

  renderLayers(): Layer<Record<string, unknown>> | LayersList {
    const { resolution = 'default', maxZoom, group = LayerGroup.HeatmapStatic } = this.props
    const { colorDomain, colorRanges, scales } = this.state

    return new TileLayer(
      this.props as any,
      this.getSubLayerProps({
        id: `static-${resolution}-${this.props.aggregationOperation}`,
        tileSize: FOURWINGS_TILE_SIZE,
        // these have to travel as TileLayer props, not captured in the renderSubLayers
        // closure: that is what makes deck push a new ramp down to the rendered cells
        colorDomain,
        colorRanges,
        scales,
        group,
        comparisonMode: FourwingsComparisonMode.Compare,
        // synthetic single-frame window, see STATIC_AVAILABLE_INTERVALS
        startTime: STATIC_START_TIME,
        endTime: STATIC_END_TIME,
        availableIntervals: [...STATIC_AVAILABLE_INTERVALS],
        tilesCache: {
          zoom: Math.round(this.context.viewport.zoom),
          ...EMPTY_STATIC_CHUNK,
        },
        minZoom: 0,
        maxZoom,
        maxCacheByteSize: FOURWINGS_MAX_CACHE_BYTE_SIZE,
        zoomOffset: getZoomOffsetByResolution(resolution, this.context.viewport.zoom),
        maxRequests: this.props.maxRequests,
        debounceTime: this.props.debounceTime,
        onTileLoad: this._onTileLoad,
        onTileError: this._onLayerError,
        onViewportLoad: this._onViewportLoad,
        getTileData: this._getTileData,
        updateTriggers: {
          getTileData: [this._getTileDataCacheKey()],
        },
        renderSubLayers: (props: any) => new FourwingsHeatmapLayer(props),
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
      return [] as FourwingsFeature[]
    }

    return tiles.flatMap((tile) => {
      if (!tile.isSelected || !tile.isVisible || !tile.isLoaded) {
        return []
      }
      const subLayer = tile.layers?.[0] as FourwingsHeatmapLayer
      return subLayer?.getData?.() ?? []
    }) as FourwingsFeature[]
  }

  getData() {
    return this.getTilesData()
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

  getFourwingsLayers() {
    return this.props.sublayers
  }

  getColorDomain = () => {
    return this.state?.colorDomain
  }

  getColorRange = () => {
    return this.state?.colorRanges
  }

  getColorScale = () => {
    return {
      colorRange: this.getColorRange(),
      colorDomain: this.getColorDomain(),
    }
  }
}
