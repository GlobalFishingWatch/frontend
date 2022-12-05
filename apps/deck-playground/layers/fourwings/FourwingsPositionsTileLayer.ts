import { Color, CompositeLayer, Layer, LayersList } from '@deck.gl/core/typed'
import { MVTLayer, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { ckmeans, sample, mean, standardDeviation } from 'simple-statistics'
import { ACTIVITY_SWITCH_ZOOM_LEVEL, getDateRangeParam } from 'layers/fourwings/fourwings.utils'
import { FourwingsPositionsLayer } from 'layers/fourwings/FourwingsPositionsLayer'
import { COLOR_RAMP_DEFAULT_NUM_STEPS } from '@globalfishingwatch/layer-composer'
import { FourwingsColorRamp, POSITIONS_ID } from './FourwingsLayer'

export type FourwingsPositionsTileLayerProps<DataT = any> = {
  minFrame: number
  maxFrame: number
  colorDomain: number[]
  colorRange: Color[]
  highlightedVesselId?: string
  onDataLoad?: (data: DataT) => void
  onColorRampUpdate: (colorRamp: FourwingsColorRamp) => void
  onVesselHighlight?: (vesselId: string) => void
  onVesselClick?: (vesselId: string) => void
}

export class FourwingsPositionsTileLayer extends CompositeLayer<
  FourwingsPositionsTileLayerProps & TileLayerProps
> {
  static layerName = 'FourwingsPositionsTileLayer'

  getColorRamp() {
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

  getColorDomain() {
    return []
  }

  renderLayers(): Layer<{}> | LayersList {
    const MVTLayerClass = this.getSubLayerClass('positions', MVTLayer)
    return new MVTLayerClass(this.props, {
      id: 'positions',
      data: `https://gateway.api.dev.globalfishingwatch.org/v2/4wings/tile/position/{z}/{x}/{y}?datasets[0]=public-global-fishing-effort%3Av20201001&${getDateRangeParam(
        this.props.minFrame,
        this.props.maxFrame
      )}`,
      binary: false,
      minZoom: ACTIVITY_SWITCH_ZOOM_LEVEL,
      maxZoom: 12,
      // loadOptions: {
      //   fetch: {
      //     headers: {
      //       Authorization: `Bearer ${API_TOKEN}`,
      //     },
      //   },
      // },
      renderSubLayers: (props) => {
        return new FourwingsPositionsLayer(this.getSubLayerProps(props))
      },
    })
  }

  getPositionsData() {
    const layer = this.getSubLayers().find((l) => l.id === POSITIONS_ID) as MVTLayer
    if (layer) {
      return layer.getSubLayers().flatMap((l: FourwingsPositionsLayer) => l.getTileData())
    }
  }

  getData() {
    const data = this.getPositionsData()
    return data
  }

  getTimeseries() {
    return []
  }
}
