import { CompositeLayer, LayerContext } from '@deck.gl/core/typed'
import { VesselLayer, VesselLayerProps } from 'layers/vessel/VesselLayer'

export type VesselsLayerProps = { ids: string[] } & VesselLayerProps

export class VesselsLayer extends CompositeLayer<VesselsLayerProps> {
  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      ids: this.props.ids,
      startTime: this.props.startTime,
      endTime: this.props.endTime,
      highlightStartTime: this.props.highlightStartTime,
      highlightEndTime: this.props.highlightEndTime,
    }
  }

  renderLayers(): VesselLayer[] {
    return this.state.ids.map(
      (id) =>
        new VesselLayer({
          id,
          startTime: this.state.startTime,
          endTime: this.state.endTime,
          highlightStartTime: this.state.highlightStartTime,
          highlightEndTime: this.state.highlightEndTime,
          onDataLoad: this.props.onDataLoad,
        })
    )
  }
  getVesselsLayers() {
    return this.getSubLayers()
  }
  getVesselLayer(id: string) {
    return this.getSubLayers().find((l) => l.id === id)
  }
}
