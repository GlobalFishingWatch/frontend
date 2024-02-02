import {
  Color,
  CompositeLayer,
  Layer,
  LayerContext,
  LayersList,
  DefaultProps,
} from '@deck.gl/core/typed'
import { TileLayer, TileLayerProps } from '@deck.gl/geo-layers/typed'
import {
  ckmeans,
  sample,
  mean,
  standardDeviation,
  equalIntervalBreaks,
  jenks,
  median,
} from 'simple-statistics'
// import Tile2DHeader from '@deck.gl/geo-layers/typed/tile-layer/tile-2d-header'
// import { TileLoadProps } from '@deck.gl/geo-layers/typed/tile-layer/types'
import { debounce, range } from 'lodash'
import { Tile2DHeader, TileLoadProps } from '@deck.gl/geo-layers/typed/tileset-2d'
import {
  COLOR_RAMP_DEFAULT_NUM_STEPS,
  HEATMAP_COLOR_RAMPS,
  Interval,
  rgbaStringToComponents,
  Group,
  GROUP_ORDER,
} from '@globalfishingwatch/layer-composer'
import { VALUE_MULTIPLIER } from '../../loaders/constants'
import { TileCell } from '../../loaders/fourwings/fourwingsTileParser'
import {
  FourwingsTileData,
  RawFourwingsTileData,
  SCALE_VALUE,
  parseFourWings,
} from '../../loaders/fourwings/fourwingsLayerLoader'
import { FourwingsDataviewCategory } from '../../layer-composer/types/fourwings'
import {
  ACTIVITY_SWITCH_ZOOM_LEVEL,
  aggregateCell,
  aggregateCellTimeseries,
  asyncAwaitMS,
  getDataUrlByChunk,
} from './fourwings.utils'
import { FourwingsHeatmapLayer } from './FourwingsHeatmapLayer'
import {
  Chunk,
  HEATMAP_ID,
  getChunkBuffer,
  getChunksByInterval,
  getInterval,
} from './fourwings.config'
import { FourwingsDeckSublayer, FourwingsSublayerId } from './fourwings.types'

export type FourwingsLayerResolution = 'default' | 'high'
export type _FourwingsHeatmapTileLayerProps = {
  debug?: boolean
  interval: Interval
  resolution?: FourwingsLayerResolution
  minFrame: number
  maxFrame: number
  zIndex?: number
  category: FourwingsDataviewCategory
  sublayers: FourwingsDeckSublayer[]
  onTileLoad?: (tile: Tile2DHeader, allTilesLoaded: boolean) => void
  onViewportLoad?: (string: string) => void
}

export type FourwingsHeatmapTileLayerProps = _FourwingsHeatmapTileLayerProps & TileLayerProps

const defaultProps: DefaultProps<FourwingsHeatmapTileLayerProps> = {
  zIndex: { type: 'number', value: GROUP_ORDER.indexOf(Group.Heatmap) },
}

export type ColorDomain = number[]
export type ColorRange = Color[]
export type SublayerColorRanges = ColorRange[]

export class FourwingsHeatmapTileLayer extends CompositeLayer<
  FourwingsHeatmapTileLayerProps & TileLayerProps
> {
  static layerName = 'FourwingsHeatmapTileLayer'
  static defaultProps = defaultProps

  initializeState(context: LayerContext): void {
    super.initializeState(context)
    this.id = `${this.props.category}`
    this.state = {
      ...this.getCacheRange(this.props.minFrame, this.props.maxFrame),
      colorDomain: [1, 20, 50, 100, 500, 5000, 10000, 500000],
      // TODO: update colorRanges only when a sublayer colorRamp prop changes
      colorRanges: this.props.sublayers.map(
        ({ config }) =>
          HEATMAP_COLOR_RAMPS[config.colorRamp].map((c) => rgbaStringToComponents(c)) as ColorRange
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

  calculateColorDomain = (tiles: Tile2DHeader[]) => {
    // TODO use to get the real bin value considering the NO_DATA_VALUE and negatives
    // NO_DATA_VALUE = 0
    // SCALE_VALUE = 0.01
    // OFFSET_VALUE = 0
    // TODO get the bigger bin values from every tile
    // const bins = tiles[0]?.content?.bins[0]
    // return bins
    // return bins.map((b) => (b * SCALE_VALUE * 180) / 365)

    // Bins from API are calculated based on the sum of all values for each cell
    const binsInViewport = tiles.map((tile) => {
      // TODO we have to keep all the bins
      // TODO review why we dividing by VALUE_MULTIPLIER again makes the ramp much better
      // return ((tile.content?.bins as number[][]) || []).flat().map((d) => (d / 100) * SCALE_VALUE)
      return ((tile.content?.bins as number[][]) || []).flat().map((d) => d * SCALE_VALUE)
    })
    // const binsInViewport = tiles.flatMap((tile) => {
    //   // TODO we have to keep all the bins
    //   // TODO review why we dividing by VALUE_MULTIPLIER again makes the ramp much better
    //   // return ((tile.content?.bins as number[][]) || []).flat().map((d) => (d / 100) * SCALE_VALUE)
    //   return ((tile.content?.bins as number[][]) || []).flat().map((d) => d * SCALE_VALUE)
    // })
    // const meanValue = mean(binsInViewport)
    // const standardDeviationValue = standardDeviation(binsInViewport)
    // const upperCut = meanValue + standardDeviationValue
    // const lowerCut = meanValue - standardDeviationValue
    // const binsInViewportWithoutOutlayer = binsInViewport.filter(
    //   (a) => a >= lowerCut && a <= upperCut
    // )
    // const stepsNum = Math.min(binsInViewport.length, COLOR_RAMP_DEFAULT_NUM_STEPS)
    // const steps = ckmeans(binsInViewport, stepsNum).map(([clusterFirst]) => {
    //   return clusterFirst / 100
    // })
    // return steps

    if (binsInViewport.length) {
      const avgSteps = range(COLOR_RAMP_DEFAULT_NUM_STEPS - 1).map((r, i, ramp) => {
        const binsInStep = binsInViewport.map((tile) => tile?.[i])
        console.log(
          '🚀 ~ avgSteps ~ binsInStep:',
          binsInStep.sort((a, b) => a - b)
        )
        const medianValue = median(binsInStep)
        const standardDeviationValue = standardDeviation(binsInStep)
        const upperCut = medianValue + standardDeviationValue * 0.1
        const lowerCut = medianValue - standardDeviationValue * 0.1
        const binsInViewportWithoutOutlayer = binsInStep
          .filter((a) => a <= upperCut)
          .sort((a, b) => a - b)
        console.log('🚀 ~ avgSteps ~ binsInViewportWithoutOutlayer:', binsInViewportWithoutOutlayer)
        return median(
          binsInViewportWithoutOutlayer.length ? binsInViewportWithoutOutlayer : binsInStep
        )
      })
      // TODO review if multiply for the interval of the timerange in comparison to the tile range
      // TODO: ADD MUTIPLY WITH THE NUM OF INTERVAL UNITS / TOTAL TILE INTERVAL UNITS
      console.log('🚀 ~ avgSteps:', avgSteps)
      return avgSteps.map((s) => s)

      // const data = tiles.flatMap((t) => t.content?.bins.flat() || ([] as number[])) as number[]
      // const steps = jenks(data, COLOR_RAMP_DEFAULT_NUM_STEPS).map((step) => {
      //   return step * SCALE_VALUE
      // })
      // return steps.map((s) => (s * 60) / 365)
    } else {
      // // TODO: remove this when all the bins comes in the response headers
      // const { maxFrame, minFrame } = this.props
      // const viewportData = this.getData()
      // if (viewportData?.length && viewportData?.length > 0) {
      //   const cells = viewportData.flatMap((cell) => {
      //     return aggregateCell(cell, { minFrame, maxFrame })
      //   })
      //   const dataSampled = (cells.length > 1000 ? sample(cells, 1000, Math.random) : cells).map(
      //     (c) => c
      //   )
      //   // filter data to 2 standard deviations from mean to remove outliers
      //   const meanValue = mean(dataSampled)
      //   const standardDeviationValue = standardDeviation(dataSampled)
      //   const upperCut = meanValue + standardDeviationValue * 2
      //   const lowerCut = meanValue - standardDeviationValue * 2
      //   const dataFiltered = dataSampled.filter((a) => a >= lowerCut && a <= upperCut)
      //   const stepsNum = Math.min(dataFiltered.length, COLOR_RAMP_DEFAULT_NUM_STEPS)
      //   // using ckmeans as jenks
      //   const steps = ckmeans(dataFiltered, stepsNum).map(([clusterFirst]) => {
      //     return parseFloat(clusterFirst.toFixed(3))
      //   })
      //   return steps
      // }
      return this.state.colorDomain
    }
  }

  updateColorDomain = debounce((tiles) => {
    requestAnimationFrame(() => {
      this.setState({ colorDomain: this.calculateColorDomain(tiles) })
    })
  }, 500)

  _onTileLoad = (tile: Tile2DHeader) => {
    const allTilesLoaded = this.getLayerInstance().state.tileset.tiles.every(
      (tile: Tile2DHeader) => tile.isLoaded === true
    )
    if (this.props.onTileLoad) {
      this.props.onTileLoad(tile, allTilesLoaded)
    }
  }

  _onViewportLoad = (tiles: Tile2DHeader[]) => {
    this.updateColorDomain(tiles)
    if (this.props.onViewportLoad) {
      this.props.onViewportLoad(this.id)
    }
  }

  _fetchTileData: any = async (tile: TileLoadProps) => {
    const { minFrame, maxFrame, sublayers } = this.props
    const visibleSublayers = sublayers.filter((sublayer) => sublayer.visible)
    const datasets = visibleSublayers.map((sublayer) => sublayer.datasets.join(','))
    const bins = [] as number[][]
    const getChunkData: any = async (chunk: any) => {
      // if (cache[chunk]) {
      //   return Promise.resolve(cache[chunk])
      // }
      const response = await fetch(getDataUrlByChunk({ tile, chunk, datasets })!, {
        signal: tile.signal,
      })
      if (tile.signal?.aborted || response.status !== 200) {
        throw new Error()
      }
      // TODO: get bins based of the number of datasets, not just 0
      datasets.forEach((dataset, i) => {
        bins[i] = JSON.parse(response.headers.get(`X-bins-${i}`) as string)
      })
      const cols = parseInt(response.headers.get('X-columns') as string)
      const rows = parseInt(response.headers.get('X-rows') as string)
      const data = await response.arrayBuffer()
      return { data, cols, rows } as RawFourwingsTileData
      // return parseFourWings(await response.arrayBuffer(), {
      //   sublayers: this.props.sublayers,
      // })
    }
    const chunks = this._getChunks(minFrame, maxFrame)
    const promises = chunks.map(getChunkData)
    if (tile.signal?.aborted) {
      throw new Error('tile aborted')
    }
    // TODO decide what to do when a chunk load fails
    const data = (await Promise.allSettled(promises)).flatMap((d) => {
      return d.status === 'fulfilled' && d.value !== undefined
        ? (d.value as RawFourwingsTileData)
        : []
    })

    if (!data.length) {
      return null
    }

    const mergeChunkDataCells = await parseFourWings(data, {
      cols: data[0].cols,
      rows: data[0].rows,
      bins: bins,
      sublayers: visibleSublayers,
      // TODO rename variables with tile in the name
      minFrame: chunks[0].start,
      maxFrame: chunks[0].end,
      interval: getInterval(minFrame, maxFrame),
    })
    // return data[0]

    return mergeChunkDataCells
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

  renderLayers(): Layer<{}> | LayersList {
    const TileLayerClass = this.getSubLayerClass(HEATMAP_ID, TileLayer)
    const { minFrame, maxFrame } = this.props
    const { colorDomain, colorRanges } = this.state
    const chunks = this._getChunks(minFrame, maxFrame)
    const cacheKey = this._getTileDataCacheKey(minFrame, maxFrame, chunks)
    // TODO review this to avoid rerendering when sublayers change
    const visibleSublayersIds = this.props.sublayers.filter((s) => s.visible).join(',')
    return new TileLayerClass(
      this.props,
      this.getSubLayerProps({
        id: `${this.props.category}-${HEATMAP_ID}`,
        // tileSize: 512,
        colorDomain,
        colorRanges,
        minZoom: 0,
        maxZoom: ACTIVITY_SWITCH_ZOOM_LEVEL,
        zoomOffset: this.props.resolution === 'high' ? 1 : 0,
        opacity: 1,
        maxRequests: 9,
        onTileLoad: this._onTileLoad,
        getTileData: this._getTileData,
        updateTriggers: {
          getTileData: [cacheKey /*visibleSublayersIds*/],
        },
        onViewportLoad: this._onViewportLoad,
        renderSubLayers: (props: any) => {
          return new FourwingsHeatmapLayer({
            ...props,
            cols: props.data?.cols,
            rows: props.data?.rows,
            data: props.data?.cells,
          })
        },
      })
    )
  }

  getLayerInstance() {
    return this.getSubLayers().find(
      (l) => l.id === `${FourwingsHeatmapTileLayer.layerName}-${this.props.category}-${HEATMAP_ID}`
    ) as TileLayer
  }

  getData() {
    const layer = this.getLayerInstance()
    if (layer) {
      const zoom = Math.round(this.context.viewport.zoom)
      const offset = this.props.resolution === 'high' ? 1 : 0
      return layer.getSubLayers().flatMap((l: any) => {
        return l.props.tile.zoom === zoom + offset ? (l.getData() as TileCell[]) : []
      })
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
