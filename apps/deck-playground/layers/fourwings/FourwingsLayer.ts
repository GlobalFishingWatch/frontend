import {
  Color,
  CompositeLayer,
  CompositeLayerProps,
  Layer,
  LayerContext,
  LayersList,
  UpdateParameters,
} from '@deck.gl/core/typed'
// import { Layer } from '@deck.gl/core/typed'
import { MVTLayer, TileLayer, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { fourwingsLayerLoader } from 'loaders/fourwings/fourwingsLayerLoader'
import { ckmeans, sample, mean, standardDeviation } from 'simple-statistics'
import { aggregateCell, FourwingsTileLayer } from 'layers/fourwings/FourwingsTileLayer'
import { aggregateCellTimeseries } from 'layers/fourwings/fourwings.utils'
import { debounce } from 'lodash'
import { VesselPositionsLayer } from 'layers/fourwings/VesselPositionsLayer'
import { TileCell } from 'loaders/fourwings/fourwingsTileParser'
import { COLOR_RAMP_DEFAULT_NUM_STEPS } from '@globalfishingwatch/layer-composer'

const HEATMAP_ID = 'heatmap'
const POSITIONS_ID = 'positions'
export type FourwingsLayerMode = typeof HEATMAP_ID | typeof POSITIONS_ID
export type FourwingsColorRamp = {
  colorDomain: number[]
  colorRange: Color[]
}

export type FourwingsLayerProps = {
  mode?: FourwingsLayerMode
  minFrame: number
  maxFrame: number
  colorDomain: number[]
  colorRange: Color[]
  onColorRampUpdate: (colorRamp: FourwingsColorRamp) => void
}

export class FourwingsLayer extends CompositeLayer<FourwingsLayerProps & TileLayerProps> {
  getHeatmapColorRamp() {
    const { maxFrame, minFrame } = this.props
    const viewportData = this.getDataFilteredByViewport()
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
      return { colorDomain: steps, colorRange }
    }
  }

  debouncedOnColorRampUpdate = debounce(() => {
    return this.props.onColorRampUpdate(this.getHeatmapColorRamp())
  }, 200)

  onViewportLoad: TileLayerProps['onViewportLoad'] = (tiles) => {
    // if (this.props.onColorRampUpdate) {
    //   this.debouncedOnColorRampUpdate()
    // }
    if (this.props.onViewportLoad) {
      return this.props.onViewportLoad(tiles)
    }
  }

  onTileLoad: TileLayerProps['onTileLoad'] = (tile) => {
    if (this.props.onColorRampUpdate) {
      this.debouncedOnColorRampUpdate()
    }
    if (this.props.onTileLoad) {
      return this.props.onTileLoad(tile)
    }
  }

  // updateState(
  //   params: UpdateParameters<Layer<FourwingsLayerProps & Required<CompositeLayerProps<any>>>>
  // ): void {
  //   const prevTimeRangeDuration = params.oldProps.maxFrame - params.oldProps.minFrame
  //   const newTimeRangeDuration = params.props.maxFrame - params.props.minFrame
  //   if (prevTimeRangeDuration !== newTimeRangeDuration) {
  //     // this.updateRampScale()
  //   }
  // }

  _getHeatmapLayer() {
    const TileLayerClass = this.getSubLayerClass(HEATMAP_ID, TileLayer)
    return new TileLayerClass(
      this.props,
      this.getSubLayerProps({
        id: HEATMAP_ID,
        data: 'https://gateway.api.dev.globalfishingwatch.org/v2/4wings/tile/heatmap/{z}/{x}/{y}?interval=day&date-range=2022-01-01,2022-08-25&format=intArray&temporal-aggregation=false&proxy=true&datasets[0]=public-global-fishing-effort:v20201001',
        minZoom: 0,
        maxZoom: 8,
        // tileSize: 256,
        // zoomOffset: -1,
        // maxCacheSize: 0,
        opacity: 1,
        loaders: [fourwingsLayerLoader],
        loadOptions: { worker: false },
        onViewportLoad: this.onViewportLoad,
        onTileLoad: this.onTileLoad,
        renderSubLayers: (props) => {
          return new FourwingsTileLayer(props)
        },
      })
    )
  }
  _getVesselPositionsLayer() {
    const MVTLayerClass = this.getSubLayerClass('positions', MVTLayer)
    return new MVTLayerClass(
      this.getSubLayerProps({
        id: 'positions',
        data: 'https://gateway.api.dev.globalfishingwatch.org/v2/4wings/tile/position/{z}/{x}/{y}?datasets[0]=public-global-fishing-effort%3Av20201001&date-range=2022-01-01,2022-02-02',
        binary: false,
        minZoom: 8,
        onTileLoad: this.props.onTileLoad,
        onViewportLoad: this.props.onViewportLoad,
        renderSubLayers: (props) => {
          return new VesselPositionsLayer(props)
        },
      })
    )
  }

  renderLayers(): Layer<{}> | LayersList {
    const { mode = 'heatmap' } = this.props
    if (mode === 'heatmap') {
      return this._getHeatmapLayer()
    }
    // this.debouncedUpdateRampScale.cancel()
    return this._getVesselPositionsLayer()
  }

  getHeatmapData() {
    const layer = this.getSubLayers().find(
      (l) => l.id === `FourwingsLayer-${HEATMAP_ID}`
    ) as TileLayer
    if (layer) {
      const zoom = Math.round(this.context.viewport.zoom)
      return layer.getSubLayers().flatMap((l: FourwingsTileLayer) => {
        return l.props.tile.zoom === zoom ? (l.getTileData().cells as TileCell[]) : []
      })
    }
  }

  getPositionsData() {
    const layer = this.getSubLayers().find(
      (l) => l.id === `FourwingsLayer-${POSITIONS_ID}`
    ) as MVTLayer
    if (layer) {
      return layer.getSubLayers().flatMap((l: FourwingsTileLayer) => l.getTileData())
    }
  }

  getData() {
    return this.props.mode === 'heatmap' ? this.getHeatmapData() : this.getPositionsData()
  }

  getColorDomain() {
    return this.props?.colorDomain
  }

  getMode() {
    return this.props?.mode
  }

  getDataFilteredByViewport() {
    const data = this.getData()
    // const { viewport } = this.context
    // const [west, north] = viewport.unproject([0, 0])
    // const [east, south] = viewport.unproject([viewport.width, viewport.height])
    // const filter = filterCellsByBounds(data, { north, west, south, east })
    return data
  }

  getHeatmapTimeseries() {
    const data = this.getHeatmapData()
    const cells = aggregateCellTimeseries(data)
    return cells
  }

  getVesselPositions() {
    const data = this.getPositionsData()
    return data
  }
}
