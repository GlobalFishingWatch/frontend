import {
  ClickEvent,
  DrawPointMode,
  DrawPolygonMode,
  FeatureCollection,
  ModeProps,
  ModifyMode,
  ViewMode,
} from '@deck.gl-community/editable-layers'

export type DrawLayerMode =
  | CustomDrawPolygonMode
  | CustomDrawPointMode
  | CustomViewMode
  | CustomModifyMode

export class CustomDrawPolygonMode extends DrawPolygonMode {
  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    event.sourceEvent.preventDefault()
    return super.handleClick(event, props)
  }
}
export class CustomDrawPointMode extends DrawPointMode {
  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    event.sourceEvent.preventDefault()
    return super.handleClick(event, props)
  }
}

export class CustomViewMode extends ViewMode {
  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    event.sourceEvent.preventDefault()
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
    event.sourceEvent.preventDefault()
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
