import { EditableGeoJsonLayer } from '@nebula.gl/layers'
import { DrawPolygonMode, ModifyMode } from '@nebula.gl/edit-modes'

export class CustomReferenceLayer extends EditableGeoJsonLayer {
  static layerName = 'custom-reference-layer'
  renderLayers() {
    const { mode, data, selectedFeatureIndexes, onEdit, onClick } = this.props
    return [
      new EditableGeoJsonLayer({
        id: 'custom-reference',
        data,
        onEdit,
        onClick,
        selectedFeatureIndexes,
        mode: mode === 'edit' ? ModifyMode : DrawPolygonMode,
      }),
    ]
  }
}
