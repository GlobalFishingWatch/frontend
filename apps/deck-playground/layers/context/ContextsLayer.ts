import { CompositeLayer, PickingInfo } from '@deck.gl/core/typed'
import { MVTLayerProps, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { ContextLayer } from './ContextLayer'

export type ContextsLayerProps = TileLayerProps &
  MVTLayerProps & { ids: string[]; hoveredFeatures: PickingInfo[]; clickedFeatures: PickingInfo[] }

export class ContextsLayer extends CompositeLayer<ContextsLayerProps> {
  static layerName = 'ContextsLayer'

  layers = this.props?.ids?.map(
    (id: string) =>
      new ContextLayer({
        id,
        hoveredFeatures: this.props.hoveredFeatures,
        clickedFeatures: this.props.clickedFeatures,
      })
  )

  renderLayers() {
    return this.layers
  }
}