import { EditableGeoJsonLayer } from '@nebula.gl/layers'
import { DrawPolygonMode, ModifyMode } from '@nebula.gl/edit-modes'

export class RulerLayer extends EditableGeoJsonLayer {
  static layerName = 'ruler-layer'
  renderLayers() {
    const { mode, data, selectedFeatureIndexes, onEdit, onClick } = this.props
    return [
      new EditableGeoJsonLayer({
        id: 'ruler',
        data,
        onEdit,
        onClick,
        selectedFeatureIndexes,
        mode: mode === 'edit' ? ModifyMode : DrawPolygonMode,
      }),
    ]
  }
}
