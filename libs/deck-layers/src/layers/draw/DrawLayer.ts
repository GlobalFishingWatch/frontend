import {
  EditableGeoJsonLayer,
  DrawPolygonMode,
  ModifyMode,
} from '@deck.gl-community/editable-layers'
import { LayerGroup, getLayerGroupOffset } from '../../utils'

export class DrawLayer extends EditableGeoJsonLayer {
  static layerName = 'draw-layer'
  renderLayers() {
    const { mode, data, selectedFeatureIndexes, onEdit, onClick } = this.props
    return [
      new EditableGeoJsonLayer({
        id: 'draw',
        data,
        onEdit,
        onClick,
        selectedFeatureIndexes,
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Tool, params),
        mode: mode === 'edit' ? ModifyMode : DrawPolygonMode,
      }),
    ]
  }
}
