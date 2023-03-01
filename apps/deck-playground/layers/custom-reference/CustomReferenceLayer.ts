import { EditableGeoJsonLayer } from '@nebula.gl/layers'
import { DrawPolygonMode, ModifyMode } from '@nebula.gl/edit-modes'
import { DefaultProps } from '@deck.gl/core/typed'
import { EditableGeojsonLayerProps } from '@nebula.gl/layers/dist-types/layers/editable-geojson-layer'
import { Group, GROUP_ORDER } from '@globalfishingwatch/layer-composer'

type _CustomReferenceLayerProps = {
  zIndex?: number
}

export type CustomReferenceLayerProps<DataT = any> = EditableGeojsonLayerProps<DataT> &
  _CustomReferenceLayerProps

const defaultProps: DefaultProps<CustomReferenceLayerProps> = {
  zIndex: { type: 'number', value: GROUP_ORDER.indexOf(Group.CustomLayer) },
}
export class CustomReferenceLayer extends EditableGeoJsonLayer {
  static layerName = 'custom-reference-layer'
  static defaultProps = defaultProps
  renderLayers() {
    const { mode, data, selectedFeatureIndexes, onEdit, onClick } = this.props
    return [
      new EditableGeoJsonLayer({
        id: 'custom-reference',
        data,
        onEdit,
        onClick,
        pickable: true,
        autoHighlight: true,
        selectedFeatureIndexes,
        mode: mode === 'edit' ? ModifyMode : DrawPolygonMode,
      }),
    ]
  }
}
