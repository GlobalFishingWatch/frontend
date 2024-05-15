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
import { scaleLinear } from 'd3-scale'
import {
  FourwingsFeature,
  FourwingsInterval,
  FourwingsLoader,
  ParseFourwingsOptions,
} from '@globalfishingwatch/deck-loaders'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import {
  COLOR_RAMP_BIVARIATE_NUM_STEPS,
  COLOR_RAMP_DEFAULT_NUM_STEPS,
  ColorRampId,
  TIME_COMPARE_COLOR_RAMP,
  getBivariateRamp,
  getColorRamp,
} from '../../../utils/colorRamps'
import {
  HEATMAP_API_TILES_URL,
  FOURWINGS_MAX_ZOOM,
  getInterval,
  MAX_RAMP_VALUES_PER_TILE,
} from '../fourwings.config'
import {
  FourwingsDeckSublayer,
  FourwingsTileLayerColorDomain,
  FourwingsTileLayerColorRange,
  FourwingsTileLayerColorScale,
} from '../fourwings.types'
import {
  aggregateCellTimeseries,
  getFourwingsChunk,
  getDataUrlBySublayer,
  filterCells,
  compareCell,
} from './fourwings-heatmap.utils'
import { FourwingsHeatmapLayer } from './FourwingsHeatmapLayer'
import {
  FourwingsAggregationOperation,
  FourwingsChunk,
  FourwingsComparisonMode,
  FourwingsHeatmapTileLayerProps,
  FourwingsHeatmapTilesCache,
  FourwingsTileLayerState,
  FourwinsTileLayerScale,
} from './fourwings-heatmap.types'

const defaultProps: DefaultProps<FourwingsHeatmapTileLayerProps> = {
  maxRequests: 100,
  debounceTime: 500,
  comparisonMode: FourwingsComparisonMode.Compare,
  aggregationOperation: FourwingsAggregationOperation.Sum,
  tilesUrl: HEATMAP_API_TILES_URL,
  resolution: 'default',
}

export class FourwingsHeatmapTileLayer extends CompositeLayer<FourwingsHeatmapTileLayerProps> {
  static layerName = 'FourwingsHeatmapTileLayer'
  static defaultProps = defaultProps
  initialBinsLoad = false

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      scales: [],
      tilesCache: this._getTileDataCache(
        this.props.startTime,
        this.props.endTime,
        this.props.availableIntervals
      ),
      colorDomain: [],
      colorRanges: this._getColorRanges(),
    }
  }

  _getColorRanges = () => {
    // TODO:deck research if we can use the context to get other layers so we can enable whiteEnd
    // TODO:deck remove this and calculate values equal to Compare
    if (this.props.comparisonMode === FourwingsComparisonMode.Bivariate) {
      return getBivariateRamp(this.props.sublayers.map((s) => s?.colorRamp) as ColorRampId[])
    }
    if (this.props.comparisonMode === FourwingsComparisonMode.TimeCompare) {
      return [TIME_COMPARE_COLOR_RAMP]
    }
    return this.props.sublayers.map(({ colorRamp }) =>
      getColorRamp({ rampId: colorRamp as ColorRampId, whiteEnd: this.props.colorRampWhiteEnd })
    )
  }

  _calculateColorDomain = () => {
    // TODO use to get the real bin value considering the NO_DATA_VALUE and negatives
    // NO_DATA_VALUE = 0
    // SCALE_VALUE = 0.01
    // OFFSET_VALUE = 0
    const { comparisonMode, aggregationOperation, minVisibleValue, maxVisibleValue } = this.props
    const currentZoomData = this.getData()
    if (!currentZoomData.length) {
      return this.getColorDomain()
    }
    const dataSample =
      currentZoomData.length > MAX_RAMP_VALUES_PER_TILE
        ? currentZoomData.filter((d, i) => filterCells(d, i))
        : currentZoomData

    // TODO:deck remove this and calculate values equal to Compare
    if (comparisonMode === FourwingsComparisonMode.Bivariate) {
      let allValues: [number[], number[]] = [[], []]
      dataSample.forEach((feature) => {
        feature.properties?.values.forEach((sublayerValues, sublayerIndex) => {
          allValues[sublayerIndex].push(...sublayerValues.filter((d, i) => filterCells(d, i)))
        })
      })
      if (!allValues.length) {
        return this.getColorDomain()
      }

      const steps = allValues
        .filter((sublayer) => sublayer.length)
        .map((sublayerValues) =>
          ckmeans(
            sublayerValues,
            Math.min(sublayerValues.length, COLOR_RAMP_BIVARIATE_NUM_STEPS)
          ).map((step) => step[0])
        )
      return steps
    }

    if (comparisonMode === FourwingsComparisonMode.TimeCompare) {
      const allPositiveValues = []
      const allNegativeValues = []
      for (const feature of dataSample) {
        const aggregatedCellValues = compareCell({
          cellValues: feature.properties.values,
          aggregationOperation,
        })
        if (aggregatedCellValues[0] >= 0) {
          allPositiveValues.push(aggregatedCellValues[0])
        } else {
          allNegativeValues.push(aggregatedCellValues[0])
        }
      }
      if (!allNegativeValues.length || !allPositiveValues.length) {
        return this.getColorDomain()
      }
      const negativeValuesFiltered = this.removeOutliers({
        allValues: allNegativeValues,
        aggregationOperation,
      })
      const positiveValuesFiltered = this.removeOutliers({
        allValues: allPositiveValues,
        aggregationOperation,
      })
      const negativeSteps = ckmeans(
        negativeValuesFiltered,
        COLOR_RAMP_DEFAULT_NUM_STEPS / 2 - 1
      ).map((step) => step[0])
      const positiveSteps = ckmeans(positiveValuesFiltered, COLOR_RAMP_DEFAULT_NUM_STEPS / 2).map(
        (step) => step[0]
      )
      return [...negativeSteps, 0, ...positiveSteps]
    }
    const allValues = dataSample.flatMap((feature) =>
      feature.properties?.values.flatMap((values) => {
        if (!values || !values.length || !Array.isArray(values)) {
          return []
        }
        return values.filter((d, i) => filterCells(d, i, minVisibleValue, maxVisibleValue))
      })
    )

    if (!allValues.length) {
      return this.getColorDomain()
    }

    const dataFiltered = this.removeOutliers({ allValues, aggregationOperation })

    const steps = ckmeans(
      dataFiltered,
      Math.min(dataFiltered.length, COLOR_RAMP_DEFAULT_NUM_STEPS)
    ).map((step) => step[0])
    return steps
  }

  removeOutliers = ({
    allValues,
    aggregationOperation,
  }: {
    allValues: number[]
    aggregationOperation: FourwingsAggregationOperation | undefined
  }) => {
    const meanValue = mean(allValues)
    const deviationScale = aggregationOperation === FourwingsAggregationOperation.Avg ? 2 : 5
    const standardDeviationValue = standardDeviation(allValues)
    const upperCut = meanValue + standardDeviationValue * deviationScale
    const lowerCut = meanValue - standardDeviationValue * deviationScale
    return allValues.filter((a) => a >= lowerCut && a <= upperCut)
  }

  updateColorDomain = debounce(() => {
    requestAnimationFrame(() => {
      const colorDomain = this._calculateColorDomain()
      const colorRanges = this._getColorRanges()
      const scales = this._getColorScales(colorDomain, colorRanges)
      this.setState({ colorDomain, scales })
    })
  }, 500)

  _getColorScales = (
    colorDomain: FourwingsTileLayerColorDomain,
    colorRanges: FourwingsTileLayerColorRange
  ): FourwinsTileLayerScale[] => {
    if (this.props.comparisonMode === FourwingsComparisonMode.Bivariate) {
      return (colorDomain as number[][]).map((cd, i) => {
        return scaleLinear(cd, colorRanges[i] as string[]).clamp(true)
      })
    }
    if (this.props.comparisonMode === FourwingsComparisonMode.TimeCompare) {
      return [scaleLinear(colorDomain as number[], colorRanges[0] as string[]).clamp(true)]
    }
    return colorRanges.map((cr) => scaleLinear(colorDomain as number[], cr as string[]).clamp(true))
  }

  _onViewportLoad = (tiles: Tile2DHeader[]) => {
    this.updateColorDomain()
    if (this.props.onViewportLoad) {
      this.props.onViewportLoad(tiles)
    }
  }

  _getTimeCompareSublayers = () => {
    const { startTime, endTime, availableIntervals, compareStart, compareEnd } = this.props
    if (!compareStart || !compareEnd) {
      // TODO:deck handle this
      throw new Error('Missing compare start or end')
    }
    const interval = getInterval(startTime, endTime, availableIntervals)
    if (!interval) {
      throw new Error('Missing valid interval in time compare mode')
    }
    const visibleSublayers = this.props.sublayers.filter((sublayer) => sublayer.visible)
    const sublayerDatasets = Array.from(new Set(visibleSublayers.flatMap((d) => d.datasets)))
    const sublayers: (FourwingsDeckSublayer & { chunk: FourwingsChunk })[] = [
      {
        ...visibleSublayers[0],
        id: `${startTime}-${endTime}`,
        datasets: sublayerDatasets,
        chunk: {
          id: `${startTime}-${endTime}`,
          start: startTime,
          bufferedStart: startTime,
          end: endTime,
          bufferedEnd: endTime,
          interval,
        },
      },
      {
        ...visibleSublayers[0],
        id: `${compareStart}-${compareEnd}`,
        datasets: sublayerDatasets,
        chunk: {
          id: `${compareStart}-${compareEnd}`,
          start: compareStart,
          bufferedStart: compareStart,
          end: compareEnd,
          bufferedEnd: compareEnd,
          interval,
        },
      },
    ]
    return sublayers
  }

  _fetchTimeCompareTileData: any = async (tile: TileLoadProps) => {
    const {
      startTime,
      endTime,
      aggregationOperation,
      availableIntervals,
      tilesUrl,
      compareStart,
      compareEnd,
    } = this.props
    if (!compareStart || !compareEnd) {
      // TODO:deck handle this
      throw new Error('Missing compare start or end')
    }
    const { colorDomain, colorRanges } = this.state as FourwingsTileLayerState
    const interval = getInterval(startTime, endTime, availableIntervals)
    if (!interval) {
      throw new Error('Invalid interval')
    }
    const sublayers = this._getTimeCompareSublayers()
    let cols: number = 0
    let rows: number = 0
    let scale: number = 0
    let offset: number = 0
    let noDataValue: number = 0

    const getSublayerData: any = async (
      sublayer: FourwingsDeckSublayer & { chunk: FourwingsChunk }
    ) => {
      const url = getDataUrlBySublayer({
        tile,
        chunk: sublayer.chunk,
        sublayer,
        tilesUrl,
      }) as string
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

      // TODO:deck is this needed?
      // const bins = JSON.parse(response.headers.get('X-bins-0') as string)?.map((n: string) => {
      //   return (parseInt(n) - offset) * scale
      // })
      // if (
      //   !colorDomain?.length &&
      //   !this.initialBinsLoad &&
      //   comparisonMode === FourwingsComparisonMode.Compare &&
      //   bins
      // ) {
      //   const scales = this._getColorScales(bins, colorRanges)
      //   this.setState({ colorDomain: bins, scales })
      //   this.initialBinsLoad = true
      // }
      return await response.arrayBuffer()
    }

    const promises = sublayers.map(getSublayerData) as Promise<ArrayBuffer>[]
    // TODO:deck decide what to do when a chunk load fails
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
        scale,
        offset,
        noDataValue,
        bufferedStartDate: sublayers[0]?.chunk.bufferedStart,
        initialTimeRange: {
          start: startTime,
          end: endTime,
        },
        interval,
        tile,
        aggregationOperation,
        buffersLength: settledPromises.map((p) =>
          p.status === 'fulfilled' && p.value !== undefined ? p.value.byteLength : 0
        ),
      } as ParseFourwingsOptions,
    })
    return data
  }

  _fetchTimeseriesTileData: any = async (tile: TileLoadProps) => {
    const {
      startTime,
      endTime,
      sublayers,
      aggregationOperation,
      availableIntervals,
      tilesUrl,
      comparisonMode,
    } = this.props
    const { colorDomain, colorRanges } = this.state as FourwingsTileLayerState
    const visibleSublayers = sublayers.filter((sublayer) => sublayer.visible)
    let cols: number = 0
    let rows: number = 0
    let scale: number = 0
    let offset: number = 0
    let noDataValue: number = 0

    const interval = getInterval(startTime, endTime, availableIntervals)
    const chunk = getFourwingsChunk(startTime, endTime, availableIntervals)
    const getSublayerData: any = async (sublayer: FourwingsDeckSublayer) => {
      const url = getDataUrlBySublayer({ tile, chunk, sublayer, tilesUrl }) as string
      const response = await GFWAPI.fetch<Response>(url!, {
        signal: tile.signal,
        responseType: 'default',
      })
      if (tile.signal?.aborted || response.status !== 200) {
        // TODO:deck handle this error better
        throw new Error()
      }
      cols = parseInt(response.headers.get('X-columns') as string)
      rows = parseInt(response.headers.get('X-rows') as string)
      scale = parseFloat(response.headers.get('X-scale') as string)
      offset = parseInt(response.headers.get('X-offset') as string)
      noDataValue = parseInt(response.headers.get('X-empty-value') as string)
      const bins = JSON.parse(response.headers.get('X-bins-0') as string)?.map((n: string) => {
        return (parseInt(n) - offset) * scale
      })
      if (
        !colorDomain?.length &&
        !this.initialBinsLoad &&
        comparisonMode === FourwingsComparisonMode.Compare &&
        bins
      ) {
        const scales = this._getColorScales(bins, colorRanges)
        this.setState({ colorDomain: bins, scales })
        this.initialBinsLoad = true
      }
      return await response.arrayBuffer()
    }

    const promises = visibleSublayers.map(getSublayerData) as Promise<ArrayBuffer>[]
    // TODO:deck decide what to do when a chunk load fails
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
        aggregationOperation,
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
    return this.props.comparisonMode === FourwingsComparisonMode.TimeCompare
      ? this._fetchTimeCompareTileData(tile)
      : this._fetchTimeseriesTileData(tile)
  }

  _getTileDataCache = (
    startTime: number,
    endTime: number,
    availableIntervals?: FourwingsInterval[]
  ): FourwingsHeatmapTilesCache => {
    const interval = getInterval(startTime, endTime, availableIntervals)
    const { start, end, bufferedStart } = getFourwingsChunk(startTime, endTime, availableIntervals)
    return { start, end, bufferedStart, interval }
  }

  _getTileDataCacheKey = (): string => {
    const dataCache = Object.values(this.state.tilesCache || {}).join(',')
    const sublayersIds = this.props.sublayers?.map((s) => s.id).join(',')
    const sublayersFilter = this.props.sublayers?.flatMap((s) => s.filter || []).join(',')
    const sublayersVesselGroups = this.props.sublayers?.map((s) => s.vesselGroups || []).join(',')
    return [dataCache, sublayersIds, sublayersFilter, sublayersVesselGroups].join('-')
  }

  updateState({ props, oldProps }: UpdateParameters<this>) {
    const {
      startTime,
      endTime,
      availableIntervals,
      comparisonMode,
      minVisibleValue,
      maxVisibleValue,
    } = props
    const { tilesCache, colorRanges, colorDomain } = this.state as FourwingsTileLayerState
    const newSublayerColorRanges = this._getColorRanges()
    const sublayersHaveNewColors = colorRanges.join() !== newSublayerColorRanges.join()
    const newMode = oldProps.comparisonMode && comparisonMode !== oldProps.comparisonMode
    const newVisibleValueLimits =
      (oldProps.minVisibleValue && minVisibleValue !== oldProps.minVisibleValue) ||
      (oldProps.maxVisibleValue && maxVisibleValue !== oldProps.maxVisibleValue)

    if (sublayersHaveNewColors || newMode || newVisibleValueLimits) {
      const newColorDomain =
        newMode || newVisibleValueLimits ? this._calculateColorDomain() : colorDomain
      const scales = this._getColorScales(newColorDomain, newSublayerColorRanges)
      this.setState({ colorRanges: newSublayerColorRanges, colorDomain: newColorDomain, scales })
    }

    const isStartOutRange = startTime <= tilesCache.start
    const isEndOutRange = endTime >= tilesCache.end
    const needsCaheKeyUpdate =
      isStartOutRange ||
      isEndOutRange ||
      getInterval(startTime, endTime, availableIntervals) !== tilesCache.interval
    if (needsCaheKeyUpdate) {
      this.setState({ tilesCache: this._getTileDataCache(startTime, endTime, availableIntervals) })
    }
  }

  renderLayers(): Layer<{}> | LayersList {
    const { resolution, comparisonMode } = this.props
    const { colorDomain, colorRanges, tilesCache, scales } = this.state as FourwingsTileLayerState
    const cacheKey = this._getTileDataCacheKey()

    return new TileLayer(
      this.props,
      this.getSubLayerProps({
        id: `tiles-${resolution}`,
        tileSize: 512,
        colorDomain,
        colorRanges,
        comparisonMode,
        tilesCache,
        scales,
        minZoom: 0,
        maxZoom: FOURWINGS_MAX_ZOOM,
        zoomOffset: this.props.resolution === 'high' ? 1 : 0,
        opacity: 1,
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

  getTilesData({ aggregated } = {} as { aggregated?: boolean }) {
    const layer = this.getLayerInstance()
    if (layer) {
      const zoom = Math.round(this.context.viewport.zoom)
      const offset = this.props.resolution === 'high' ? 1 : 0
      return layer
        .getSubLayers()
        .map((l: any) => {
          if (!l.props.tile.isVisible) {
            return []
          }
          if (l.props.tile.zoom === l.props.maxZoom) {
            return l.getData({ aggregated })
          }
          return l.props.tile.zoom === zoom + offset ? l.getData({ aggregated }) : []
        })
        .filter((t) => t.length > 0) as FourwingsFeature[][]
    }
    return [[]] as FourwingsFeature[][]
  }

  getData({ aggregated } = {} as { aggregated?: boolean }) {
    return this.getTilesData({ aggregated }).flat()
  }

  getTilesStats({ aggregated } = {} as { aggregated?: boolean }) {
    const tilesData = this.getTilesData({ aggregated })
    return tilesData.map((tileData) => ({
      count: Math.round(
        tileData.reduce((acc, feature) => {
          if (!feature.properties?.values?.length) {
            return acc
          }
          return Math.round(
            acc +
              feature.properties?.values.flat().reduce((acc, value) => {
                return value ? acc + value : acc
              }, 0)
          )
        }, 0)
      ),
    }))
  }

  getViewportData() {
    const data = this.getData()
    const { viewport } = this.context
    const [west, north] = viewport.unproject([0, 0])
    const [east, south] = viewport.unproject([viewport.width, viewport.height])
    if (data?.length) {
      const dataFiltered = filterFeaturesByBounds(data, { north, south, west, east })
      return dataFiltered as FourwingsFeature[]
    }
    return []
  }

  getFourwingsLayers() {
    const sublayers =
      this.props.comparisonMode === FourwingsComparisonMode.TimeCompare
        ? this._getTimeCompareSublayers()
        : this.props.sublayers
    return sublayers
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
    return getInterval(startTime, endTime, availableIntervals)
  }

  getChunk = () => {
    const { startTime, endTime, availableIntervals } = this.props
    return getFourwingsChunk(startTime, endTime, availableIntervals)
  }

  getColorDomain = () => {
    return (this.state as FourwingsTileLayerState).colorDomain
  }

  getColorRange = () => {
    return (this.state as FourwingsTileLayerState).colorRanges
  }

  getColorScale = () => {
    return {
      colorRange: this.getColorRange(),
      colorDomain: this.getColorDomain(),
    } as FourwingsTileLayerColorScale
  }
}
