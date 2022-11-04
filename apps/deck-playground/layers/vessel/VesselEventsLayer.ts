import { CompositeLayer, DefaultProps, Layer, LayerProps, LayersList } from '@deck.gl/core/typed'
import { DataFilterExtension } from '@deck.gl/extensions'
import VesselPortVisitsLayer from './VesselPortVisitsLayer'

export type VesselEventsLayerProps<DataT = any> = LayerProps & {
  startTime: string
  endTime: string
  highlightedVesselId?: string
  onVesselHighlight?: (vesselId: string) => void
  onVesselClick?: (vesselId: string) => void
}

const defaultProps: DefaultProps<VesselEventsLayerProps> = {
  onVesselHighlight: { type: 'accessor', value: (d) => d },
}

export class VesselEventsLayer<ExtraProps = {}> extends CompositeLayer<
  VesselEventsLayerProps & ExtraProps
> {
  static layerName = 'VesselEventsLayer'
  static defaultProps = defaultProps

  getPickingInfo({ info }) {
    return info
  }

  renderLayers(): Layer<{}> | LayersList {
    return new VesselPortVisitsLayer({
      id: `dots-${this.props.id}`,
      data: this.props.data,
      pickable: true,
      opacity: 0.8,
      stroked: false,
      filled: true,
      radiusScale: 30,
      radiusMinPixels: 5,
      radiusMaxPixels: 10,
      lineWidthMinPixels: 1,
      getShape: (d) => d.shapeIndex,
      getPosition: (d) => d.coordinates,
      getFilterValue: (d) => d.start,
      getFillColor: (d) => [255, 140, 0],
      getLineColor: (d) => [0, 0, 0],
      getPickingInfo: this.getPickingInfo,
      filterRange: [this.props.startTime, this.props.endTime],
      extensions: [new DataFilterExtension({ filterSize: 1 })],
    })
  }
}
