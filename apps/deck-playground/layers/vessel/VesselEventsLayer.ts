import { CompositeLayer, DefaultProps, Layer, LayerProps, LayersList } from '@deck.gl/core/typed'
import { ScatterplotLayer } from '@deck.gl/layers/typed'
import {DataFilterExtension} from '@deck.gl/extensions'

export type VesselEventsLayerProps<DataT = any> = LayerProps & {
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

  getPickingInfo({info}) {
    return info
  }

  parseData(data) {
    return data.entries.map(vessel => {
      const { position, start, end, ...attributes } = vessel
      return {
        ...attributes,
        coordinates: [vessel.position.lon, vessel.position.lat],
        startTime: new Date(start).getTime(),
        endTime: new Date(end).getTime()
      }
    })
  }

  renderLayers(): Layer<{}> | LayersList {
    return new ScatterplotLayer({
      id: `dots-${this.props.id}`,
      data: this.parseData(this.props.data),
      pickable: true,
      opacity: 0.8,
      stroked: false,
      filled: true,
      radiusScale: 6,
      radiusMinPixels: 3,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: d => d.coordinates,
      getFilterValue: d => d.startTime,
      getFillColor: d => [255, 140, 0],
      getLineColor: d => [0, 0, 0],
      getPickingInfo: this.getPickingInfo,
      filterRange: [this.props.startTime, this.props.endTime],
      extensions: [new DataFilterExtension({filterSize: 1 })],
    })
  }

  getTileData() {
    return this.parseData(this.props.data)
  }
}
