import type { PickingInfo } from '@deck.gl/core';
import { CompositeLayer } from '@deck.gl/core'
import type { MVTLayerProps, TileLayerProps } from '@deck.gl/geo-layers'

import { ContextLayer } from './ContextLayer'

export type ContextsLayerProps = TileLayerProps &
  MVTLayerProps & { ids: string[]; hoveredFeatures: PickingInfo[]; clickedFeatures: PickingInfo[] }

export class ContextsLayer extends CompositeLayer<ContextsLayerProps> {
  static layerName = 'ContextsLayer'

  layers = this.props?.ids?.map((id: string) => new ContextLayer({ id }))

  renderLayers() {
    return this.layers
  }
}
