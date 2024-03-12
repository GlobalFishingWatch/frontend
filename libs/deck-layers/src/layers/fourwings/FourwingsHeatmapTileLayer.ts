import {
  Color,
  CompositeLayer,
  Layer,
  LayerContext,
  LayersList,
  DefaultProps,
  PickingInfo,
} from '@deck.gl/core/typed'
import { TileLayer, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { ckmeans } from 'simple-statistics'
import { load } from '@loaders.gl/core'
import { debounce } from 'lodash'
import { Tile2DHeader, TileLoadProps } from '@deck.gl/geo-layers/typed/tileset-2d'
import { FourWingsFeature, FourwingsLoader, TileCell } from '@globalfishingwatch/deck-loaders'
import {
  COLOR_RAMP_DEFAULT_NUM_STEPS,
  HEATMAP_COLOR_RAMPS,
  rgbaStringToComponents,
  ColorRampsIds,
} from '@globalfishingwatch/layer-composer'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import {
  ACTIVITY_SWITCH_ZOOM_LEVEL,
  aggregateCellTimeseries,
  asyncAwaitMS,
  getDataUrlBySublayer,
} from './fourwings.utils'
import { FourwingsHeatmapLayer } from './FourwingsHeatmapLayer'
import {
  Chunk,
  HEATMAP_ID,
  PATH_BASENAME,
  getChunkBuffer,
  getChunksByInterval,
  getInterval,
} from './fourwings.config'
import { FourwingsDeckSublayer } from './fourwings.types'

export type FourwingsLayerResolution = 'default' | 'high'
export type FourwingsHeatmapTileData = FourWingsFeature[]
export type _FourwingsHeatmapTileLayerProps = {
  data?: FourwingsHeatmapTileData
  debug?: boolean
  resolution?: FourwingsLayerResolution
  hoveredFeatures?: PickingInfo[]
  clickedFeatures?: PickingInfo[]
  minFrame: number
  maxFrame: number
  sublayers: FourwingsDeckSublayer[]
  colorRampWhiteEnd?: boolean
  onTileDataLoading?: (tile: TileLoadProps) => void
}

export type FourwingsHeatmapTileLayerProps = _FourwingsHeatmapTileLayerProps &
  Partial<TileLayerProps>

const defaultProps: DefaultProps<FourwingsHeatmapTileLayerProps> = {}

export type ColorDomain = number[]
export type ColorRange = Color[]
export type SublayerColorRanges = ColorRange[]

const MAX_VALUES_PER_TILE = 1000

export class FourwingsHeatmapTileLayer extends CompositeLayer<
  FourwingsHeatmapTileLayerProps & TileLayerProps
> {
  static layerName = 'FourwingsHeatmapTileLayer'
  static defaultProps = defaultProps

  initializeState(context: LayerContext): void {
    super.initializeState(context)
    this.state = {
      ...this.getCacheRange(this.props.minFrame, this.props.maxFrame),
      colorDomain: [1, 20, 50, 100, 500, 5000, 10000, 500000],
      colorRanges: this.props.sublayers.map(
        ({ config }) =>
          HEATMAP_COLOR_RAMPS[
            (this.props.colorRampWhiteEnd
              ? `${config.colorRamp}_toWhite`
              : config.colorRamp) as ColorRampsIds
          ].map((c) => rgbaStringToComponents(c)) as ColorRange
      ),
    }
  }

  getCacheRange = (minFrame: number, maxFrame: number) => {
    const chunkBuffer = getChunkBuffer(getInterval(minFrame, maxFrame))
    return {
      cacheStart: this.props.minFrame - chunkBuffer,
      cacheEnd: this.props.maxFrame + chunkBuffer,
    }
  }

  filterElementByPercentOfIndex = (value: any, index: number) => {
    // Select only 5% of elements
    return value && index % 20 === 1
  }

  calculateColorDomain = (tiles: Tile2DHeader<FourwingsHeatmapTileData>[]) => {
    // TODO use to get the real bin value considering the NO_DATA_VALUE and negatives
    // NO_DATA_VALUE = 0
    // SCALE_VALUE = 0.01
    // OFFSET_VALUE = 0
    // const fa = performance.now()
    const currentZoomTiles = tiles.filter(
      (tile) => tile.zoom === Math.round(this.context.viewport.zoom)
    )
    if (!currentZoomTiles?.length) {
      return this.getColorDomain()
    }
    const allValues = currentZoomTiles.flatMap((tile) => {
      if (!tile.content) return []
      return (
        tile.content.length > MAX_VALUES_PER_TILE
          ? tile.content.filter(this.filterElementByPercentOfIndex)
          : tile.content
      ).flatMap((feature) =>
        feature.properties?.values.flatMap((values) => {
          return (values || []).filter(this.filterElementByPercentOfIndex)
        })
      )
    })
    // console.log('allValues:', allValues.length)
    // const a = performance.now()
    if (!allValues.length) {
      return this.getColorDomain()
    }
    const steps = ckmeans(allValues, Math.min(allValues.length, COLOR_RAMP_DEFAULT_NUM_STEPS)).map(
      (step) => step[0]
    )
    // const b = performance.now()
    // console.log('ckmeans time:', b - a)
    // const fb = performance.now()
    // console.log('steps:', steps)
    // console.log('calculateColorDomain time:', fb - fa)
    return steps
  }

  updateColorDomain = debounce((tiles) => {
    requestAnimationFrame(() => {
      this.setState({ colorDomain: this.calculateColorDomain(tiles) })
    })
  }, 500)

  _onViewportLoad = (tiles: Tile2DHeader[]) => {
    this.updateColorDomain(tiles)
    if (this.props.onViewportLoad) {
      this.props.onViewportLoad(tiles)
    }
  }

  _fetchTileData: any = async (tile: TileLoadProps) => {
    const { minFrame, maxFrame, sublayers } = this.props
    const visibleSublayers = sublayers.filter((sublayer) => sublayer.visible)
    let cols: number = 0
    let rows: number = 0

    const interval = getInterval(minFrame, maxFrame)
    const chunks = this._getChunks(minFrame, maxFrame)
    const getSublayerData: any = async (sublayer: FourwingsDeckSublayer) => {
      const url = getDataUrlBySublayer({ tile, chunk: chunks[0], sublayer }) as string
      const response = await GFWAPI.fetch<Response>(url!, {
        signal: tile.signal,
        responseType: 'default',
      })
      if (tile.signal?.aborted || response.status !== 200) {
        throw new Error()
      }
      cols = parseInt(response.headers.get('X-columns') as string)
      rows = parseInt(response.headers.get('X-rows') as string)
      return await response.arrayBuffer()
    }

    const promises = visibleSublayers.map(getSublayerData) as Promise<ArrayBuffer>[]
    // TODO decide what to do when a chunk load fails
    const settledPromises = await Promise.allSettled(promises)
    const arrayBuffers = settledPromises.flatMap((d) => {
      return d.status === 'fulfilled' && d.value !== undefined ? d.value : []
    })
    if (tile.signal?.aborted) {
      throw new Error('tile aborted')
    }
    const data = await load(arrayBuffers.filter(Boolean) as ArrayBuffer[], FourwingsLoader, {
      worker: true,
      fourwings: {
        sublayers: 1,
        cols,
        rows,
        minFrame: chunks[0].start,
        maxFrame: chunks[0].end,
        initialTimeRange: {
          start: minFrame,
          end: maxFrame,
        },
        interval,
        tile,
        workerUrl: `${PATH_BASENAME}/workers/fourwings-worker.js`,
        buffersLength: settledPromises.map((p) =>
          p.status === 'fulfilled' && p.value !== undefined ? p.value.byteLength : 0
        ),
      },
    })
    return data
  }

  _getTileData: TileLayerProps['getTileData'] = async (tile) => {
    // waiting when zoom changes to avoid loading tiles for intermidiate zoom levels
    const zoomLevel = this.getLayerInstance()?.internalState?.viewport?.zoom
    if (zoomLevel && tile.zoom !== Math.round(zoomLevel)) {
      await asyncAwaitMS(500)
    }
    if (tile.signal?.aborted) {
      return null
    }
    if (this.props.onTileDataLoading) {
      this.props.onTileDataLoading(tile)
    }
    return this._fetchTileData(tile)
  }

  _getChunks(minFrame: number, maxFrame: number) {
    const interval = getInterval(minFrame, maxFrame)
    const chunks = getChunksByInterval(minFrame, maxFrame, interval)
    return chunks
  }

  _getTileDataCacheKey = (minFrame: number, maxFrame: number, chunks: Chunk[]): string => {
    const isStartOutRange = minFrame <= this.state.cacheStart
    const isEndOutRange = maxFrame >= this.state.cacheEnd
    if (isStartOutRange || isEndOutRange) {
      this.setState(this.getCacheRange(minFrame, maxFrame))
    }
    return [this.state.cacheStart, this.state.cacheEnd].join('-')
  }

  _updateSublayerColorRanges = () => {
    const { sublayers, colorRampWhiteEnd } = this.props
    const newSublayerColorRanges = sublayers.map(({ config }) =>
      HEATMAP_COLOR_RAMPS[
        (colorRampWhiteEnd ? `${config.colorRamp}_toWhite` : config.colorRamp) as ColorRampsIds
      ].map((c) => rgbaStringToComponents(c))
    )
    const sublayersHaveNewColors = this.state.colorRanges.join() !== newSublayerColorRanges.join()
    if (sublayersHaveNewColors) {
      this.setState({ colorRanges: newSublayerColorRanges })
    }
  }

  renderLayers(): Layer<{}> | LayersList {
    const { minFrame, maxFrame, sublayers } = this.props
    this._updateSublayerColorRanges()
    const { colorDomain, colorRanges } = this.state
    const chunks = this._getChunks(minFrame, maxFrame)
    const cacheKey = this._getTileDataCacheKey(minFrame, maxFrame, chunks)
    // TODO review this to avoid rerendering when sublayers change
    const sublayersIds = sublayers.map((s) => s.id).join(',')

    return new TileLayer(
      this.props,
      this.getSubLayerProps({
        id: `${HEATMAP_ID}-tiles`,
        tileSize: 512,
        colorDomain,
        colorRanges,
        minZoom: 0,
        maxZoom: ACTIVITY_SWITCH_ZOOM_LEVEL,
        zoomOffset: this.props.resolution === 'high' ? 1 : 0,
        opacity: 1,
        debug: this.props.debug,
        maxRequests: -1,
        getTileData: this._getTileData,
        updateTriggers: {
          getTileData: [cacheKey, sublayersIds],
        },
        onViewportLoad: this._onViewportLoad,
        renderSubLayers: (props: any) => {
          return new FourwingsHeatmapLayer(props)
        },
      })
    )
  }

  getLayerInstance() {
    const layer = this.getSubLayers()[0] as TileLayer
    return layer
  }

  getData() {
    const layer = this.getLayerInstance()
    if (layer) {
      const zoom = Math.round(this.context.viewport.zoom)
      const offset = this.props.resolution === 'high' ? 1 : 0
      return layer.getSubLayers().flatMap((l: any) => {
        return l.props.tile.zoom === zoom + offset ? l.getData() : []
      }) as FourWingsFeature[]
    }
    return [] as FourWingsFeature[]
  }

  getViewportData() {
    const data = this.getData()
    const { viewport } = this.context
    const [west, north] = viewport.unproject([0, 0])
    const [east, south] = viewport.unproject([viewport.width, viewport.height])
    if (data?.length) {
      const dataFiltered = filterFeaturesByBounds(data, { north, south, west, east })
      return dataFiltered
    }
    return []
  }

  getTimeseries() {
    const data = this.getData()
    if (data?.length) {
      const cells = aggregateCellTimeseries(data, this.props.sublayers)
      return cells
    }
    return []
  }

  getColorDomain = () => {
    return this.state.colorDomain
  }
}
