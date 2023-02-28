import { EditableGeoJsonLayer } from '@nebula.gl/layers'
import { DrawPolygonMode, ModifyMode } from '@nebula.gl/edit-modes'
import { DefaultProps } from '@deck.gl/core/typed'
import { Group, GROUP_ORDER } from '@globalfishingwatch/layer-composer'

const defaultProps: DefaultProps = {
  zIndex: { type: 'number', value: GROUP_ORDER.indexOf(Group.CustomLayer) },
  pickable: { type: 'boolean', value: true },
}

export class CustomReferenceLayer extends EditableGeoJsonLayer {
  static layerName = 'CustomReferenceLayer'
  static defaultProps = defaultProps

  initializeState() {
    // super.initializeState(context)
    this.state = {
      selectedFeatureIndexes: [0],
    }
  }

  renderLayers() {
    const { mode, data, selectedFeatureIndexes, onEdit, ...otherProps } = this.props

    return [
      new EditableGeoJsonLayer(
        { pickable: true, onClick: () => console.log('CLICKED') },
        this.getSubLayerProps({
          ...otherProps,
          id: 'custom-reference',
          data,
          pickable: true,
          autoHighlight: true,
          getPickingInfo: (info) => {
            console.log('PICKING', info)
            return info
          },
          mode: this.props.editMode === 'edit' ? ModifyMode : DrawPolygonMode,
          onEdit: ({ updatedData, editType, featureIndexes, editContext }) => {
            if (
              editType === 'addFeature' ||
              editType === 'movePosition' ||
              editType === 'addPosition'
            ) {
              this.props.onEdit({ updatedData })
            }
            console.log('EDITTING', editType, featureIndexes, editContext)
            // this.props.onEdit({ updatedData })
          },
          onClick: (info) => {
            console.log('CLICKED', info)
            this.setState({ selectedFeatureIndexes: [info.index] })
          },
          selectedFeatureIndexes: this.state.selectedFeatureIndexes,
          // Styles
          filled: true,
          pointRadiusMinPixels: 2,
          pointRadiusScale: 2000,
          getFillColor: [200, 0, 80, 50],
        })
      ),
    ]
  }
}
