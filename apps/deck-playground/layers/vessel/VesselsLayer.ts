import { CompositeLayer } from '@deck.gl/core/typed'
import { VesselLayer, VesselLayerProps } from 'layers/vessel/VesselLayer'

export type VesselsLayerProps = { ids: string[] } & VesselLayerProps

export class VesselsLayer extends CompositeLayer<VesselsLayerProps> {
  layers = this.props.ids.map(
    (id) =>
      new VesselLayer({
        id,
        startTime: this.props.startTime,
        endTime: this.props.endTime,
        highlightStartTime: this.props.highlightStartTime,
        highlightEndTime: this.props.highlightEndTime,
        onDataLoad: this.props.onDataLoad,
      })
  )
  renderLayers(): VesselLayer[] {
    return this.layers
  }
  getVesselsLayers() {
    return this.layers
  }
  getVesselLayer(id: string) {
    return this.layers.find((l) => l.id === id)
  }
}
