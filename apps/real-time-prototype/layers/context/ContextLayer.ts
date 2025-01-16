import { CompositeLayer } from '@deck.gl/core'
import type { MVTLayerProps, TileLayerProps } from '@deck.gl/geo-layers';
import { MVTLayer } from '@deck.gl/geo-layers'

import { API_PATH, CONTEXT_LAYERS_OBJECT } from './context.config'

export type ContextLayerProps = TileLayerProps & MVTLayerProps & { id: string }

export class ContextLayer extends CompositeLayer<ContextLayerProps> {
  static layerName = 'ContextLayer'
  static defaultProps = {}
  layers = []

  _getBaseLayer() {
    return new MVTLayer(
      this.getSubLayerProps({
        id: `base-layer`,
        data: `${API_PATH}/${CONTEXT_LAYERS_OBJECT[this.props.id].dataset}/{z}/{x}/{y}`,
        getLineColor: CONTEXT_LAYERS_OBJECT[this.props.id].lineColor,
        getFillColor: [0, 0, 0, 0],
        lineWidthMinPixels: 1,
        binary: true,
        uniqueIdProperty: 'gfw_id',
      })
    )
  }

  renderLayers() {
    this.layers = [this._getBaseLayer()]
    return this.layers
  }
}
