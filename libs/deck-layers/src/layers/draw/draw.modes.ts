import {
  ClickEvent,
  DrawPolygonMode,
  FeatureCollection,
  ModeProps,
  ModifyMode,
  ViewMode,
} from '@deck.gl-community/editable-layers'

export type DrawLayerMode = DrawPolygonMode | CustomViewMode | CustomModifyMode

export class CustomViewMode extends ViewMode {
  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    if (event.picks.length) {
      props.onEdit({
        updatedData: props.data,
        editType: 'customClickInFeature',
        editContext: {
          featureIndexes: event.picks.map((pick) => pick.index),
        },
      })
    }
  }
}

export class CustomModifyMode extends ModifyMode {
  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    if (event.picks.length) {
      super.handleClick(event, props)
    } else {
      props.onEdit({
        updatedData: props.data,
        editType: 'customClickOutside',
        editContext: {
          featureIndexes: [],
        },
      })
    }
  }
}
