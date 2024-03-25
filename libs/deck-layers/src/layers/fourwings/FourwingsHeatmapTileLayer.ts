import {
  CompositeLayer,
  Layer,
  LayerContext,
  LayersList,
  DefaultProps,
  UpdateParameters,
} from '@deck.gl/core'
import { TileLayer, TileLayerProps } from '@deck.gl/geo-layers'
import { ckmeans, mean, standardDeviation } from 'simple-statistics'
import { load } from '@loaders.gl/core'
import { debounce } from 'lodash'
import { Tile2DHeader, TileLoadProps } from '@deck.gl/geo-layers/dist/tileset-2d'
import {
  FourWingsFeature,
  FourwingsInterval,
  FourwingsLoader,
  ParseFourwingsOptions,
} from '@globalfishingwatch/deck-loaders'
import {
  HEATMAP_COLOR_RAMPS,
  rgbaStringToComponents,
  ColorRampsIds,
} from '@globalfishingwatch/layer-composer'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import { COLOR_RAMP_DEFAULT_NUM_STEPS, ColorRampId, getBivariateRamp } from '../../utils/colorRamps'
import {
  aggregateCellTimeseries,
  filterElementByPercentOfIndex,
  getChunk,
  getDataUrlBySublayer,
} from './fourwings.utils'
import { FourwingsHeatmapLayer } from './FourwingsHeatmapLayer'
import {
  HEATMAP_API_TILES_URL,
  FOURWINGS_MAX_ZOOM,
  PATH_BASENAME,
  getInterval,
  MAX_RAMP_VALUES_PER_TILE,
} from './fourwings.config'
import {
  ColorRange,
  FourwingsDeckSublayer,
  FourwingsHeatmapTileLayerProps,
  FourwingsTileLayerState,
  FourwingsHeatmapTilesCache,
  FourwingsComparisonMode,
  FourwingsAggregationOperation,
} from './fourwings.types'

const defaultProps: DefaultProps<FourwingsHeatmapTileLayerProps> = {
  maxRequests: 100,
  debounceTime: 500,
  comparisonMode: FourwingsComparisonMode.Compare,
  aggregationOperation: FourwingsAggregationOperation.Sum,
  tilesUrl: HEATMAP_API_TILES_URL,
  resolution: 'default',
}

export class FourwingsHeatmapTileLayer extends CompositeLayer<
  FourwingsHeatmapTileLayerProps & TileLayerProps
> {
  static layerName = 'FourwingsHeatmapTileLayer'
  static defaultProps = defaultProps
  initialBinsLoad = false

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      tilesCache: this._getTileDataCache(
        this.props.minFrame,
        this.props.maxFrame,
        this.props.availableIntervals
      ),
      colorDomain:
        this.props.comparisonMode === FourwingsComparisonMode.Bivariate
          ? [
              [1, 100, 5000, 500000],
              [1, 100, 5000, 500000],
            ]
          : [],
      colorRanges: this._getColorRanges(),
    }
  }

  _getColorRanges = () => {
    // TODO: research if we can use the context to get other layers so we can enable whiteEnd
    if (this.props.comparisonMode === FourwingsComparisonMode.Bivariate) {
      return getBivariateRamp(this.props.sublayers.map((s) => s?.colorRamp) as ColorRampId[])
    }
    return this.props.sublayers.map(
      ({ colorRamp }) =>
        HEATMAP_COLOR_RAMPS[
          (this.props.colorRampWhiteEnd ? `${colorRamp}_toWhite` : colorRamp) as ColorRampsIds
        ].map((c) => rgbaStringToComponents(c)) as ColorRange
    )
  }

  _calculateColorDomain = () => {
    // TODO use to get the real bin value considering the NO_DATA_VALUE and negatives
    // NO_DATA_VALUE = 0
    // SCALE_VALUE = 0.01
    // OFFSET_VALUE = 0
    const { comparisonMode, aggregationOperation } = this.props
    const currentZoomData = this.getData()
    if (!currentZoomData.length) {
      return this.getColorDomain()
    }
    const dataSample =
      currentZoomData.length > MAX_RAMP_VALUES_PER_TILE
        ? currentZoomData.filter(filterElementByPercentOfIndex)
        : currentZoomData

    if (comparisonMode === FourwingsComparisonMode.Bivariate) {
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

    const meanValue = mean(allValues)
    const deviationScale = aggregationOperation === FourwingsAggregationOperation.Avg ? 2 : 5
    const standardDeviationValue = standardDeviation(allValues)
    const upperCut = meanValue + standardDeviationValue * deviationScale
    const lowerCut = meanValue - standardDeviationValue * deviationScale
    const dataFiltered = allValues.filter((a) => a >= lowerCut && a <= upperCut)

    const steps = ckmeans(
      dataFiltered,
      Math.min(dataFiltered.length, COLOR_RAMP_DEFAULT_NUM_STEPS)
    ).map((step) => step[0])
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
    const {
      minFrame,
      maxFrame,
      sublayers,
      aggregationOperation,
      comparisonMode,
      availableIntervals,
      tilesUrl,
    } = this.props
    const { colorDomain } = this.state as FourwingsTileLayerState
    const visibleSublayers = sublayers.filter((sublayer) => sublayer.visible)
    let cols: number = 0
    let rows: number = 0
    let scale: number = 0
    let offset: number = 0
    let noDataValue: number = 0

    const interval = getInterval(minFrame, maxFrame, availableIntervals)
    const chunk = getChunk(minFrame, maxFrame, availableIntervals)
    const getSublayerData: any = async (sublayer: FourwingsDeckSublayer) => {
      const url = getDataUrlBySublayer({ tile, chunk, sublayer, tilesUrl }) as string
      const response = await GFWAPI.fetch<Response>(url!, {
        signal: tile.signal,
        responseType: 'default',
      })
      if (tile.signal?.aborted || response.status !== 200) {
        throw new Error()
      }
      cols = parseInt(response.headers.get('X-columns') as string)
      rows = parseInt(response.headers.get('X-rows') as string)
      scale = parseFloat(response.headers.get('X-scale') as string)
      offset = parseInt(response.headers.get('X-offset') as string)
      noDataValue = parseInt(response.headers.get('X-empty-value') as string)
      const bins = JSON.parse(response.headers.get('X-bins-0') as string)?.map((n: string) => {
        return parseInt(n)
      })
      if (
        comparisonMode === FourwingsComparisonMode.Compare &&
        !colorDomain?.length &&
        !this.initialBinsLoad &&
        bins?.length >= COLOR_RAMP_DEFAULT_NUM_STEPS
      ) {
        // TODO fix avg for bins in API
        this.setState({ colorDomain: bins })
        this.initialBinsLoad = true
      }
      // TODO test if setting the x-bins until the full viewport loads improves the experience
      // this.setState({ colorDomain: bins })
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
        sublayers: 1, // TODO make this dynamic
        cols,
        rows,
        scale,
        offset,
        noDataValue,
        minFrame: chunk.start,
        maxFrame: chunk.end,
        initialTimeRange: {
          start: minFrame,
          end: maxFrame,
        },
        interval,
        tile,
        aggregationOperation,
        workerUrl: `${PATH_BASENAME}/workers/fourwings-worker.js`,
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
    if (this.props.onTileDataLoading) {
      this.props.onTileDataLoading(tile)
    }
    return this._fetchTileData(tile)
  }

  _getTileDataCache = (
    minFrame: number,
    maxFrame: number,
    availableIntervals?: FourwingsInterval[]
  ): FourwingsHeatmapTilesCache => {
    const interval = getInterval(minFrame, maxFrame, availableIntervals)
    const { start, end } = getChunk(minFrame, maxFrame, availableIntervals)
    return { start, end, interval }
  }

  _getTileDataCacheKey = (): string => {
    const dataCache = Object.values(this.state.tilesCache || {}).join(',')
    const sublayersIds = this.props.sublayers?.map((s) => s.id).join(',')
    const sublayersFilter = this.props.sublayers?.flatMap((s) => s.filter || []).join(',')
    const sublayersVesselGroups = this.props.sublayers?.map((s) => s.vesselGroups || []).join(',')
    return [dataCache, sublayersIds, sublayersFilter, sublayersVesselGroups].join('-')
  }

  updateState({ props, oldProps }: UpdateParameters<this>) {
    const { minFrame, maxFrame, availableIntervals } = props
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
      isStartOutRange ||
      isEndOutRange ||
      getInterval(minFrame, maxFrame, availableIntervals) !== tilesCache.interval
    if (needsCaheKeyUpdate) {
      this.setState({ tilesCache: this._getTileDataCache(minFrame, maxFrame, availableIntervals) })
    }
  }

  renderLayers(): Layer<{}> | LayersList {
    const { resolution, comparisonMode } = this.props
    const { colorDomain, colorRanges } = this.state as FourwingsTileLayerState
    const cacheKey = this._getTileDataCacheKey()

    return new TileLayer(
      this.props,
      this.getSubLayerProps({
        id: `tiles-${resolution}`,
        tileSize: 512,
        colorDomain,
        colorRanges,
        comparisonMode,
        minZoom: 0,
        maxZoom: FOURWINGS_MAX_ZOOM,
        zoomOffset: this.props.resolution === 'high' ? 1 : 0,
        opacity: 1,
        debug: this.props.debug,
        maxRequests: this.props.maxRequests,
        debounceTime: this.props.debounceTime,
        getTileData: this._getTileData,
        updateTriggers: {
          getTileData: [cacheKey, resolution],
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
      return dataFiltered as FourWingsFeature[]
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
