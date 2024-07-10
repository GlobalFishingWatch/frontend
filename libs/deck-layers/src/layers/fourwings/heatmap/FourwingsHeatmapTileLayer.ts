import {
  CompositeLayer,
  Layer,
  LayerContext,
  LayersList,
  DefaultProps,
  UpdateParameters,
} from '@deck.gl/core'
import { TileLayer, TileLayerProps } from '@deck.gl/geo-layers'
import { parse } from '@loaders.gl/core'
import { debounce, sum } from 'lodash'
import { Tile2DHeader, TileLoadProps } from '@deck.gl/geo-layers/dist/tileset-2d'
import { scaleLinear } from 'd3-scale'
import {
  FourwingsFeature,
  FourwingsInterval,
  FourwingsLoader,
  getFourwingsInterval,
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
  MAX_RAMP_VALUES,
  MAX_POSITIONS_PER_TILE_SUPPORTED,
  DYNAMIC_RAMP_CHANGE_THRESHOLD,
} from '../fourwings.config'
import {
  FourwingsColorObject,
  FourwingsDeckSublayer,
  FourwingsTileLayerColorDomain,
  FourwingsTileLayerColorRange,
  FourwingsTileLayerColorScale,
} from '../fourwings.types'
import { getSteps, hexToRgb, removeOutliers } from '../../../utils'
import {
  aggregateCellTimeseries,
  getFourwingsChunk,
  getDataUrlBySublayer,
  filterCells,
  compareCell,
  aggregateCell,
  getIntervalFrames,
  getZoomOffsetByResolution,
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
  state!: FourwingsTileLayerState

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      scales: [],
      tilesCache: this._getTileDataCache({
        startTime: this.props.startTime,
        endTime: this.props.endTime,
        availableIntervals: this.props.availableIntervals,
        compareStart: this.props.compareStart,
        compareEnd: this.props.compareEnd,
      }),
      colorDomain: [],
      colorRanges: this._getColorRanges(),
      rampDirty: false,
    }
  }

  get isLoaded(): boolean {
    return super.isLoaded && !this.state.rampDirty
  }

  _getColorRanges = () => {
    // TODO:deck research if we can use the context to get other layers so we can enable whiteEnd
    // TODO:deck remove this and calculate values equal to Compare
    if (this.props.comparisonMode === FourwingsComparisonMode.Bivariate) {
      return getBivariateRamp(this.props.sublayers.map((s) => s?.colorRamp) as ColorRampId[])
    }
    if (this.props.comparisonMode === FourwingsComparisonMode.TimeCompare) {
      return [TIME_COMPARE_COLOR_RAMP].map((ramp) =>
        ramp.map((color) => hexToRgb(color) as FourwingsColorObject)
      )
    }
    return this.props.sublayers.map(({ colorRamp }) =>
      getColorRamp({ rampId: colorRamp as ColorRampId, whiteEnd: this.props.colorRampWhiteEnd })
    )
  }

  _calculateColorDomain = () => {
    const {
      comparisonMode,
      aggregationOperation,
      minVisibleValue,
      maxVisibleValue,
      startTime,
      endTime,
      availableIntervals,
    } = this.props
    const currentZoomData = this.getData()
    if (!currentZoomData.length) {
      return this.getColorDomain()
    }

    const { startFrame, endFrame } = getIntervalFrames({
      startTime,
      endTime,
      availableIntervals,
      bufferedStart:
        this._getTileDataCache({
          startTime: this.props.startTime,
          endTime: this.props.endTime,
          availableIntervals: this.props.availableIntervals,
        })?.bufferedStart || 0,
    })

    const dataSample =
      currentZoomData.length > MAX_RAMP_VALUES
        ? currentZoomData.filter((d, i) => filterCells(d, i))
        : currentZoomData

    if (comparisonMode === FourwingsComparisonMode.Bivariate) {
      let allValues: [number[], number[]] = [[], []]
      dataSample.forEach((feature) => {
        feature.properties?.values.forEach((sublayerValues, sublayerIndex) => {
          const sublayerAggregation = aggregateCell({
            cellValues: [sublayerValues.filter(Boolean)],
            aggregationOperation,
            startFrame,
            endFrame,
            cellStartOffsets: feature.properties.startOffsets,
          })
          allValues[sublayerIndex].push(...sublayerAggregation)
        })
      })
      if (!allValues.length) {
        return this.getColorDomain()
      }

      const steps = allValues
        .filter((sublayer) => sublayer.length)
        .map((sublayerValues) =>
          getSteps(
            removeOutliers({ allValues: sublayerValues, aggregationOperation }),
            COLOR_RAMP_BIVARIATE_NUM_STEPS
          )
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
        if (aggregatedCellValues[0] !== undefined) {
          if (aggregatedCellValues[0] >= 0) {
            allPositiveValues.push(aggregatedCellValues[0])
          } else {
            allNegativeValues.push(aggregatedCellValues[0])
          }
        }
      }
      if (!allNegativeValues.length || !allPositiveValues.length) {
        return this.getColorDomain()
      }
      const negativeValuesFiltered = removeOutliers({
        allValues: allNegativeValues,
        aggregationOperation,
      })

      const positiveValuesFiltered = removeOutliers({
        allValues: allPositiveValues,
        aggregationOperation,
      })
      const negativeSteps = getSteps(negativeValuesFiltered, COLOR_RAMP_DEFAULT_NUM_STEPS / 2 - 1)
      const positiveSteps = getSteps(positiveValuesFiltered, COLOR_RAMP_DEFAULT_NUM_STEPS / 2)
      return [...negativeSteps, 0, ...positiveSteps]
    }

    const allValues = dataSample.flatMap((feature) =>
      aggregateCell({
        cellValues: feature.properties.values.filter((sublayerValues) =>
          sublayerValues.map(
            (value) =>
              value &&
              (!minVisibleValue || value >= minVisibleValue) &&
              (!maxVisibleValue || value <= maxVisibleValue)
          )
        ),
        aggregationOperation,
        startFrame,
        endFrame,
        cellStartOffsets: feature.properties.startOffsets,
      })
    )
    if (!allValues.length) {
      return this.getColorDomain()
    }

    const dataFiltered = removeOutliers({ allValues, aggregationOperation })
    return getSteps(dataFiltered)
  }

  updateColorDomain = debounce(() => {
    requestAnimationFrame(() => {
      const { comparisonMode } = this.props
      const { colorDomain: oldColorDomain } = this.state
      const newColorDomain = this._calculateColorDomain()
      let avgChange = Infinity
      let change: number[] = []
      if (oldColorDomain.length) {
        if (comparisonMode === FourwingsComparisonMode.Bivariate) {
          change = (oldColorDomain as number[][])
            .map((oldColorDomainAxis, oldColorDomainAxisIndex) => {
              return oldColorDomainAxis.map((oldValue, i) => {
                const newValue = (newColorDomain as number[][])[oldColorDomainAxisIndex][i]
                return (Math.abs(newValue - oldValue) / oldValue) * 100 || 0
              })
            })
            .flat()
        } else if (comparisonMode === FourwingsComparisonMode.Compare) {
          change = (oldColorDomain as number[]).map((oldValue, i) => {
            const newValue = newColorDomain[i] as number
            return (Math.abs(newValue - oldValue) / oldValue) * 100 || 0
          })
        }
        if (change.length) {
          avgChange = sum(change) / change.length
        }
      }
      if (avgChange > DYNAMIC_RAMP_CHANGE_THRESHOLD) {
        const colorRanges = this._getColorRanges()
        const scales = this._getColorScales(newColorDomain, colorRanges)
        this.setState({ colorDomain: newColorDomain, scales, rampDirty: false })
      } else {
        this.setState({ rampDirty: false })
      }
    })
  }, 500)

  _getColorScales = (
    colorDomain: FourwingsTileLayerColorDomain,
    colorRanges: FourwingsTileLayerColorRange
  ): FourwinsTileLayerScale[] => {
    if (this.props.comparisonMode === FourwingsComparisonMode.Bivariate) {
      return (colorDomain as number[][]).map((cd, i) => {
        return scaleLinear(cd, colorRanges[i] as FourwingsColorObject[]).clamp(true)
      })
    }
    if (this.props.comparisonMode === FourwingsComparisonMode.TimeCompare) {
      return [
        scaleLinear(colorDomain as number[], colorRanges[0] as FourwingsColorObject[]).clamp(true),
      ]
    }
    return colorRanges.map((cr) =>
      scaleLinear(colorDomain as number[], cr as FourwingsColorObject[]).clamp(true)
    )
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
      throw new Error('Missing compare start or end')
    }
    const interval = getFourwingsInterval(startTime, endTime, availableIntervals)
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
      throw new Error('Missing compare start or end')
    }
    const interval = getFourwingsInterval(startTime, endTime, availableIntervals)
    if (!interval) {
      throw new Error('Invalid interval')
    }
    const sublayers = this._getTimeCompareSublayers()
    let cols: number = 0
    let rows: number = 0
    let scale: number = 0
    let offset: number = 0
    let noDataValue: number = 0

    this.setState({ rampDirty: true })
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

    const data = await parse(arrayBuffers.filter(Boolean) as ArrayBuffer[], FourwingsLoader, {
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
    const { colorDomain, colorRanges } = this.state
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
        bins?.length === COLOR_RAMP_DEFAULT_NUM_STEPS
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
    return { start, end, bufferedStart, interval, compareStart, compareEnd }
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
      compareStart,
      compareEnd,
      availableIntervals,
      comparisonMode,
      minVisibleValue,
      maxVisibleValue,
    } = props
    const { tilesCache, colorRanges, colorDomain } = this.state
    const newSublayerColorRanges = this._getColorRanges()
    const sublayersHaveNewColors = colorRanges.join() !== newSublayerColorRanges.join()
    const newMode = oldProps.comparisonMode && comparisonMode !== oldProps.comparisonMode
    const newVisibleValueLimits =
      (oldProps.minVisibleValue && minVisibleValue !== oldProps.minVisibleValue) ||
      (oldProps.maxVisibleValue && maxVisibleValue !== oldProps.maxVisibleValue)
    if (newMode || sublayersHaveNewColors || newVisibleValueLimits) {
      this.setState({ rampDirty: true, colorDomain: [], colorRanges: [], scales: [] })
      const newColorDomain =
        newMode || newVisibleValueLimits ? this._calculateColorDomain() : colorDomain
      const scales = this._getColorScales(newColorDomain, newSublayerColorRanges)
      requestAnimationFrame(() => {
        this.setState({
          colorRanges: newSublayerColorRanges,
          colorDomain: newColorDomain,
          scales,
          rampDirty: false,
        })
      })
    }

    const isStartOutRange = startTime <= tilesCache.start
    const isCompareStartOutRange = compareStart ? compareStart <= tilesCache.compareStart! : false
    const isCompareEndOutRange = compareEnd ? compareEnd <= tilesCache.compareEnd! : false
    const isEndOutRange = endTime >= tilesCache.end
    const needsCacheKeyUpdate =
      isStartOutRange ||
      isCompareStartOutRange ||
      isEndOutRange ||
      isCompareEndOutRange ||
      getFourwingsInterval(startTime, endTime, availableIntervals) !== tilesCache.interval
    if (needsCacheKeyUpdate) {
      this.setState({
        tilesCache: this._getTileDataCache({
          startTime,
          endTime,
          availableIntervals,
          compareStart,
          compareEnd,
        }),
      })
    }
  }

  renderLayers(): Layer<{}> | LayersList {
    const { resolution, comparisonMode } = this.props
    const { colorDomain, colorRanges, tilesCache, scales } = this.state
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
        zoomOffset: getZoomOffsetByResolution(resolution),
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
      const offset = getZoomOffsetByResolution(this.props.resolution)
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
    return getFourwingsInterval(startTime, endTime, availableIntervals)
  }

  getChunk = () => {
    const { startTime, endTime, availableIntervals } = this.props
    return getFourwingsChunk(startTime, endTime, availableIntervals)
  }

  getColorDomain = () => {
    return this.state.colorDomain
  }

  getColorRange = () => {
    return this.state.colorRanges
  }

  getColorScale = () => {
    return {
      colorRange: this.getColorRange(),
      colorDomain: this.getColorDomain(),
    } as FourwingsTileLayerColorScale
  }
}