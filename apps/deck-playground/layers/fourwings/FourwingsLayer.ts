import { Color, CompositeLayer, Layer, LayersList } from '@deck.gl/core/typed'
// import { Layer } from '@deck.gl/core/typed'
import { MVTLayer, TileLayer, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { fourwingsLayerLoader } from 'loaders/fourwings/fourwingsLayerLoader'
import { ckmeans, sample, mean, standardDeviation } from 'simple-statistics'
import { aggregateCell, FourwingsTileLayer } from 'layers/fourwings/FourwingsTileLayer'
import {
  ACTIVITY_SWITCH_ZOOM_LEVEL,
  aggregateCellTimeseries,
  getRoundedDateFromTS,
} from 'layers/fourwings/fourwings.utils'
import { debounce } from 'lodash'
import { VesselPositionsLayer } from 'layers/fourwings/VesselPositionsLayer'
import { TileCell } from 'loaders/fourwings/fourwingsTileParser'
import { COLOR_RAMP_DEFAULT_NUM_STEPS } from '@globalfishingwatch/layer-composer'
import { API_TOKEN } from 'data/config'

const HEATMAP_ID = 'heatmap'
const POSITIONS_ID = 'positions'

export type FourwingsLayerMode = typeof HEATMAP_ID | typeof POSITIONS_ID
export type FourwingsLayerResolution = 'default' | 'high'
export type FourwingsColorRamp = {
  colorDomain: number[]
  colorRange: Color[]
}

export type FourwingsLayerProps = {
  mode?: FourwingsLayerMode
  resolution?: FourwingsLayerResolution
  minFrame: number
  maxFrame: number
  colorDomain: number[]
  colorRange: Color[]
  highlightedVesselId?: string
  onColorRampUpdate: (colorRamp: FourwingsColorRamp) => void
  onVesselHighlight?: (vesselId: string) => void
  onVesselClick?: (vesselId: string) => void
}

export class FourwingsLayer extends CompositeLayer<FourwingsLayerProps & TileLayerProps> {
  static layerName = 'FourwingsLayer'

  getHeatmapColorRamp() {
    const { maxFrame, minFrame } = this.props
    const viewportData = this.getHeatmapData()
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

  getPositionsColorRamp() {
    const data = this.getPositionsData()
    if (data?.length > 0) {
      const hours = data.map((d) => d.properties.value)
      const dataSampled = hours.length > 1000 ? sample(hours, 1000, Math.random) : hours
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
    const colorRamp =
      this.props.mode === 'heatmap' ? this.getHeatmapColorRamp() : this.getPositionsColorRamp()
    return this.props.onColorRampUpdate(colorRamp)
  }, 200)

  onViewportLoad: TileLayerProps['onViewportLoad'] = (tiles) => {
    if (this.props.onColorRampUpdate) {
      this.debouncedOnColorRampUpdate()
    }
    if (this.props.onViewportLoad) {
      return this.props.onViewportLoad(tiles)
    }
  }

  onTileLoad: TileLayerProps['onTileLoad'] = (tile) => {
    // if (this.props.onColorRampUpdate) {
    //   this.debouncedOnColorRampUpdate()
    // }
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

  _getDateRangeParam = () => {
    return `date-range=${getRoundedDateFromTS(this.props.minFrame)},${getRoundedDateFromTS(
      this.props.maxFrame
    )}`
  }

  _getHeatmapLayer() {
    const TileLayerClass = this.getSubLayerClass(HEATMAP_ID, TileLayer)
    return new TileLayerClass(
      this.props,
      this.getSubLayerProps({
        id: HEATMAP_ID,
        data: 'https://gateway.api.dev.globalfishingwatch.org/v2/4wings/tile/heatmap/{z}/{x}/{y}?interval=day&date-range=2021-01-01,2022-09-15&format=intArray&temporal-aggregation=false&proxy=true&datasets[0]=public-global-fishing-effort:v20201001',
        minZoom: 0,
        maxZoom: ACTIVITY_SWITCH_ZOOM_LEVEL,
        // tileSize: 256,
        zoomOffset: this.props.resolution === 'high' ? 1 : 0,
        // maxCacheSize: 0,
        opacity: 1,
        loaders: [fourwingsLayerLoader],
        loadOptions: {
          worker: false,
          fetch: {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
            },
          },
        },
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
    return new MVTLayerClass({
      id: 'positions',
      data: `https://gateway.api.dev.globalfishingwatch.org/v2/4wings/tile/position/{z}/{x}/{y}?datasets[0]=public-global-fishing-effort%3Av20201001&${this._getDateRangeParam()}`,
      binary: false,
      minZoom: ACTIVITY_SWITCH_ZOOM_LEVEL,
      maxZoom: 12,
      loadOptions: {
        fetch: {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        },
      },
      onVesselHighlight: this.props.onVesselHighlight,
      onVesselClick: this.props.onVesselClick,
      highlightedVesselId: this.props.highlightedVesselId || '',
      onTileLoad: this.props.onTileLoad,
      onViewportLoad: this.onViewportLoad,
      colorDomain: this.props.colorDomain,
      colorRange: this.props.colorRange,
      renderSubLayers: (props) => {
        return new VesselPositionsLayer(this.getSubLayerProps(props))
      },
    })
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
      (l) => l.id === `${FourwingsLayer.layerName}-${HEATMAP_ID}`
    ) as TileLayer
    if (layer) {
      const zoom = Math.round(this.context.viewport.zoom)
      const offset = this.props.resolution === 'high' ? 1 : 0
      return layer.getSubLayers().flatMap((l: FourwingsTileLayer) => {
        return l.props.tile.zoom === zoom + offset ? (l.getTileData().cells as TileCell[]) : []
      })
    }
  }

  getPositionsData() {
    const layer = this.getSubLayers().find((l) => l.id === POSITIONS_ID) as MVTLayer
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

  getResolution() {
    return this.props?.resolution
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
