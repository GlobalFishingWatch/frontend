import type { GetPickingInfoParams } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { ScatterplotLayer } from '@deck.gl/layers'

import { getLayerGroupOffset,LayerGroup } from '../../utils'

import type { WorkspacesFeature, WorkspacesLayerProps } from './workspaces.types'

export class WorkspacesLayer extends CompositeLayer<WorkspacesLayerProps> {
  static layerName = 'ContextLayer'
  static defaultProps = {}

  getPickingInfo({ info }: GetPickingInfoParams<any, object>) {
    return { ...info, object: { ...info.object, category: this.props.category } }
  }

  renderLayers() {
    return new ScatterplotLayer<WorkspacesFeature>({
      id: `${this.props.id}-points`,
      data: this.props.data as WorkspacesFeature[],
      getPosition: (d) => new Float64Array(d.geometry.coordinates),
      radiusUnits: 'pixels',
      radiusMinPixels: 10,
      getFillColor: [255, 255, 255, 255],
      lineWidthUnits: 'pixels',
      lineWidthMinPixels: 5,
      getLineColor: [255, 255, 255, 50],
      pickable: true,
      stroked: true,
      getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.Overlay, params),
    })
  }
}
