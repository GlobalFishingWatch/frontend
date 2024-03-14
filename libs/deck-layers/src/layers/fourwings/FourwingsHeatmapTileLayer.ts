import {
  CompositeLayer,
  Layer,
  LayerContext,
  LayersList,
  DefaultProps,
  UpdateParameters,
} from '@deck.gl/core/typed'
import { TileLayer, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { ckmeans } from 'simple-statistics'
import { load } from '@loaders.gl/core'
import { debounce } from 'lodash'
import { Tile2DHeader, TileLoadProps } from '@deck.gl/geo-layers/typed/tileset-2d'
import { FourWingsFeature, FourwingsLoader } from '@globalfishingwatch/deck-loaders'
import {
  COLOR_RAMP_DEFAULT_NUM_STEPS,
  HEATMAP_COLOR_RAMPS,
  rgbaStringToComponents,
  ColorRampsIds,
} from '@globalfishingwatch/layer-composer'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import { ColorRampId, getBivariateRamp } from '../../utils/colorRamps'
import {
  ACTIVITY_SWITCH_ZOOM_LEVEL,
  aggregateCellTimeseries,
  asyncAwaitMS,
  filterElementByPercentOfIndex,
  getChunk,
  getDataUrlBySublayer,
} from './fourwings.utils'
import { FourwingsHeatmapLayer } from './FourwingsHeatmapLayer'
import { HEATMAP_ID, PATH_BASENAME, getInterval } from './fourwings.config'
import {
  ColorRange,
  FourwingsDeckSublayer,
  FourwingsHeatmapTileLayerProps,
  FourwingsTileLayerState,
  FourwingsHeatmapTilesCache,
  HeatmapAnimatedMode,
} from './fourwings.types'

const defaultProps: DefaultProps<FourwingsHeatmapTileLayerProps> = {}

const MAX_VALUES_PER_TILE = 1000

export class FourwingsHeatmapTileLayer extends CompositeLayer<
  FourwingsHeatmapTileLayerProps & TileLayerProps
> {
  static layerName = 'FourwingsHeatmapTileLayer'
  static defaultProps = defaultProps

  initializeState(context: LayerContext): void {
    super.initializeState(context)
    this.state = {
      tilesCache: this._getTileDataCache(this.props.minFrame, this.props.maxFrame),
      colorDomain:
        this.props.comparisonMode === HeatmapAnimatedMode.Bivariate
          ? [
              [1, 100, 5000, 500000],
              [1, 100, 5000, 500000],
            ]
          : [1, 20, 50, 100, 500, 5000, 10000, 500000],
      colorRanges: this._getColorRanges(),
    } as FourwingsTileLayerState
  }

  _getColorRanges = () => {
    if (this.props.comparisonMode === HeatmapAnimatedMode.Bivariate) {
      return getBivariateRamp(this.props.sublayers.map((s) => s.config?.colorRamp) as ColorRampId[])
    }
    return this.props.sublayers.map(
      ({ config }) =>
        HEATMAP_COLOR_RAMPS[
          (this.props.colorRampWhiteEnd
            ? `${config.colorRamp}_toWhite`
            : config.colorRamp) as ColorRampsIds
        ].map((c) => rgbaStringToComponents(c)) as ColorRange
    )
  }

  _calculateColorDomain = () => {
    // TODO use to get the real bin value considering the NO_DATA_VALUE and negatives
    // NO_DATA_VALUE = 0
    // SCALE_VALUE = 0.01
    // OFFSET_VALUE = 0
    const currentZoomData = this.getData()
    if (!currentZoomData.length) {
      return this.getColorDomain()
    }
    const dataSample =
      currentZoomData.length > MAX_VALUES_PER_TILE
        ? currentZoomData.filter(filterElementByPercentOfIndex)
        : currentZoomData

    if (this.props.comparisonMode === HeatmapAnimatedMode.Bivariate) {
      let allValues: [number[], number[]] = [[], []]
      dataSample.forEach((feature) => {
        feature.properties?.values.forEach((sublayerValues, sublayerIndex) => {
          allValues[sublayerIndex].push(...sublayerValues.filter(filterElementByPercentOfIndex))
        })
      })
      if (!allValues.length) {
        return this.getColorDomain()
      }
      const steps = allValues.map((sublayerValues) =>
        ckmeans(sublayerValues, Math.min(sublayerValues.length, 4)).map((step) => step[0])
      )
      return steps
    }

    const allValues = dataSample.flatMap((feature) =>
      feature.properties?.values.flatMap((values) => {
        return (values || []).filter(filterElementByPercentOfIndex)
      })
    )

    if (!allValues.length) {
      return this.getColorDomain()
    }
    const steps = ckmeans(allValues, Math.min(allValues.length, COLOR_RAMP_DEFAULT_NUM_STEPS)).map(
      (step) => step[0]
    )
    return steps
  }

  updateColorDomain = debounce(() => {
    requestAnimationFrame(() => {
      this.setState({ colorDomain: this._calculateColorDomain() })
    })
  }, 500)

  _onViewportLoad = (tiles: Tile2DHeader[]) => {
    this.updateColorDomain()
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
    const chunk = getChunk(minFrame, maxFrame)
    const getSublayerData: any = async (sublayer: FourwingsDeckSublayer) => {
      const url = getDataUrlBySublayer({ tile, chunk, sublayer }) as string
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
        minFrame: chunk.start,
        maxFrame: chunk.end,
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

  _getTileDataCache = (minFrame: number, maxFrame: number): FourwingsHeatmapTilesCache => {
    const interval = getInterval(minFrame, maxFrame)
    const { start, end } = getChunk(minFrame, maxFrame)
    return { start, end, interval }
  }

  _getTileDataCacheKey = (): string => {
    return Object.values(this.state.tilesCache).join(',')
  }

  updateState({ props, oldProps }: UpdateParameters<this>) {
    const { minFrame, maxFrame } = props
    const { tilesCache, colorRanges } = this.state as FourwingsTileLayerState
    const newSublayerColorRanges = this._getColorRanges()
    const sublayersHaveNewColors = colorRanges.join() !== newSublayerColorRanges.join()

    if (sublayersHaveNewColors) {
      this.setState({ colorRanges: newSublayerColorRanges })
    }

    const newMode = props.comparisonMode !== oldProps.comparisonMode
    if (newMode) {
      this.setState({ colorDomain: this._calculateColorDomain() })
    }

    const isStartOutRange = minFrame <= tilesCache.start
    const isEndOutRange = maxFrame >= tilesCache.end
    const needsCaheKeyUpdate =
      isStartOutRange || isEndOutRange || getInterval(minFrame, maxFrame) !== tilesCache.interval
    if (needsCaheKeyUpdate) {
      this.setState({ tilesCache: this._getTileDataCache(minFrame, maxFrame) })
    }
  }

  renderLayers(): Layer<{}> | LayersList {
    const { sublayers, comparisonMode } = this.props
    const { colorDomain, colorRanges } = this.state as FourwingsTileLayerState
    const cacheKey = this._getTileDataCacheKey()
    const sublayersIds = sublayers.map((s) => s.id).join(',')

    return new TileLayer(
      this.props,
      this.getSubLayerProps({
        id: `${HEATMAP_ID}-tiles`,
        tileSize: 512,
        colorDomain,
        colorRanges,
        comparisonMode,
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
        if (l.props.tile.zoom === l.props.maxZoom) {
          return l.getData()
        }
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
    return (this.state as FourwingsTileLayerState).colorDomain
  }

  getColorRange = () => {
    return (this.state as FourwingsTileLayerState).colorRanges
  }

  getColorScale = () => {
    return {
      range: this.getColorRange(),
      domain: this.getColorDomain(),
    }
  }
}
