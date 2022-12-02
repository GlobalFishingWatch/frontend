import { Color, CompositeLayer, Layer, LayerContext, LayersList } from '@deck.gl/core/typed'
import { TileLayer, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { parseFourWings } from 'loaders/fourwings/fourwingsLayerLoader'
import { ckmeans, sample, mean, standardDeviation } from 'simple-statistics'
import { aggregateCell, FourwingsHeatmapLayer } from 'layers/fourwings/FourwingsHeatmapLayer'
import {
  ACTIVITY_SWITCH_ZOOM_LEVEL,
  aggregateCellTimeseries,
  getDataUrlByChunk,
} from 'layers/fourwings/fourwings.utils'
import { TileCell } from 'loaders/fourwings/fourwingsTileParser'
import Tile2DHeader from '@deck.gl/geo-layers/typed/tile-layer/tile-2d-header'
import { GeoJsonLayer } from '@deck.gl/layers/typed'
import { COLOR_RAMP_DEFAULT_NUM_STEPS, Interval } from '@globalfishingwatch/layer-composer'
import { FourwingsColorRamp, HEATMAP_ID } from './FourwingsLayer'
import { Chunk, getChunksByInterval, getInterval } from './fourwings.config'

export type FourwingsLayerResolution = 'default' | 'high'
export type FourwingsHeatmapTileLayerProps<DataT = any> = {
  interval: Interval
  resolution?: FourwingsLayerResolution
  minFrame: number
  maxFrame: number
  colorRange: FourwingsColorRamp['colorRange']
  colorDomain: FourwingsColorRamp['colorDomain']
  onViewportLoad?: (tiles: Tile2DHeader[]) => void
  onColorRampUpdate?: (colorRamp: FourwingsColorRamp) => void
}

export class FourwingsHeatmapTileLayer extends CompositeLayer<
  FourwingsHeatmapTileLayerProps & TileLayerProps
> {
  static layerName = 'FourwingsHeatmapTileLayer'

  initializeState(context: LayerContext): void {
    super.initializeState(context)
    this.state = { cacheStart: undefined, cacheEnd: undefined }
  }

  getColorRamp = () => {
    const { maxFrame, minFrame } = this.props
    const viewportData = this.getData()
    if (viewportData?.length > 0) {
      const cells = viewportData.map((cell) => aggregateCell(cell, { minFrame, maxFrame }))
      const dataSampled = cells.length > 1000 ? sample(cells, 1000, Math.random) : cells
      // filter data to 2 standard deviations from mean to remove outliers
      const meanValue = mean(dataSampled)
      const standardDeviationValue = standardDeviation(dataSampled)
      const upperCut = meanValue + standardDeviationValue * 2
      const lowerCut = meanValue - standardDeviationValue * 2
      const dataFiltered = dataSampled.filter((a) => a >= lowerCut && a <= upperCut)
      const stepsNum = Math.min(dataFiltered.length, COLOR_RAMP_DEFAULT_NUM_STEPS)
      // using ckmeans as jenks
      const steps = ckmeans(dataFiltered, stepsNum).map(([clusterFirst]) =>
        parseFloat(clusterFirst.toFixed(3))
      )
      const colorRange = steps.map((s, i) => {
        const opacity = ((i + 1) / COLOR_RAMP_DEFAULT_NUM_STEPS) * 255
        return [255, 0, 255, opacity] as Color
      })
      // this.colorRampUpdated = true
      return { colorDomain: steps, colorRange }
    }
  }

  getColorDomain = () => {
    return this.props.colorDomain
  }

  _onViewportLoad = (tiles) => {
    if (this.props.onColorRampUpdate) {
      const colorRamp = this.getColorRamp()
      this.props.onColorRampUpdate(colorRamp)
    }
    if (this.props.onViewportLoad) {
      return this.props.onViewportLoad(tiles)
    }
  }

  _getTileData: TileLayerProps['getTileData'] = async (tile) => {
    const promises = this._getChunks(this.props.minFrame, this.props.maxFrame).map(
      async (chunk) => {
        // if (cache[chunk]) {
        //   return Promise.resolve(cache[chunk])
        // }
        const response = await fetch(getDataUrlByChunk(tile, chunk), { signal: tile.signal })
        if (tile.signal?.aborted || !response.ok) {
          throw new Error()
        }
        return parseFourWings(await response.arrayBuffer())
      }
    )
    const data = (await Promise.allSettled(promises)).flatMap((d) =>
      d.status === 'fulfilled' ? d.value : []
    )
    return { cols: data[0]?.cols, rows: data[0]?.rows, cells: data.flatMap((d) => d.cells) }
  }

  _getChunks(minFrame: number, maxFrame: number) {
    const interval = getInterval(minFrame, maxFrame)
    const chunks = getChunksByInterval(minFrame, maxFrame, interval)
    return chunks
  }

  _getTileDataCacheKey = (start: number, end: number, chunks: Chunk[]): 'cache' | 'no-cache' => {
    const isStartOutRange = start <= this.state.cacheStart
    const isEndOutRange = end >= this.state.cacheEnd
    if (!this.state.cacheStart || !this.state.cacheEnd || isStartOutRange || isEndOutRange) {
      this.setState({
        // Using the first chunk index to invalidate cache when the timebar is about to end the buffer
        cacheStart: chunks[1].start,
        cacheEnd: chunks[chunks.length - 2].end,
      })
      return 'no-cache'
    }
    return 'cache'
  }

  renderLayers(): Layer<{}> | LayersList {
    const TileLayerClass = this.getSubLayerClass(HEATMAP_ID, TileLayer)
    const { minFrame, maxFrame } = this.props
    const chunks = this._getChunks(minFrame, maxFrame)
    const cacheKey = this._getTileDataCacheKey(minFrame, maxFrame, chunks)
    if (cacheKey === 'no-cache') {
      console.log(chunks)
    }

    return new TileLayerClass(
      this.props,
      this.getSubLayerProps({
        id: HEATMAP_ID,
        // tileSize: 512,
        minZoom: 0,
        maxZoom: ACTIVITY_SWITCH_ZOOM_LEVEL,
        zoomOffset: this.props.resolution === 'high' ? 1 : 0,
        opacity: 1,
        getTileData: this._getTileData,
        updateTriggers: {
          getTileData: [cacheKey],
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
      (l) => l.id === `${FourwingsHeatmapTileLayer.layerName}-${HEATMAP_ID}`
    ) as TileLayer
  }

  getData() {
    const layer = this.getLayerInstance()
    if (layer) {
      const zoom = Math.round(this.context.viewport.zoom)
      const offset = this.props.resolution === 'high' ? 1 : 0
      return layer.getSubLayers().flatMap((l: FourwingsHeatmapLayer) => {
        return l.props.tile.zoom === zoom + offset ? (l.getData() as TileCell[]) : []
      })
    }
  }

  getTimeseries() {
    const data = this.getData()
    if (data?.length) {
      const cells = aggregateCellTimeseries(data)
      return cells
    }
    return []
  }
}
