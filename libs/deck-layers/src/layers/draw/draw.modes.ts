import type {
  ClickEvent,
  FeatureCollection,
  ModeProps,
  Pick} from '@deck.gl-community/editable-layers';
import {
  DrawPointMode,
  DrawPolygonMode,
  ModifyMode,
  ViewMode
} from '@deck.gl-community/editable-layers'
import uniqBy from 'lodash/uniqBy'

import type { EditHandleFeature } from './draw.types'

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
export function getPickedEditHandles(picks: Pick[] | null | undefined): EditHandleFeature[] {
  const handles =
    (picks &&
      picks
        .filter((pick) => pick.isGuide && pick.object.properties.guideType === 'editHandle')
        .map((pick) => pick.object)) ||
    []

  return handles
}

export function getPickedExistingEditHandle(
  picks: Pick[] | null | undefined
): EditHandleFeature | null | undefined {
  const handles = getPickedEditHandles(picks)
  return handles.find(
    ({ properties }) => properties.featureIndex >= 0 && properties.editHandleType === 'existing'
  )
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
    const geometryPicks = uniqBy(
      event.picks.filter((p) => !p.isGuide),
      'index'
    )
    const hasDifferentSelectedIndex =
      props.selectedIndexes?.length !== geometryPicks.length ||
      geometryPicks.some((pick) => {
        return !props.selectedIndexes.includes(pick.index)
      })
    const pickedExistingHandle = getPickedExistingEditHandle(event.picks)
    const positionIndexes = pickedExistingHandle?.properties?.positionIndexes
    if (event.picks.length) {
      if (hasDifferentSelectedIndex) {
        props.onEdit({
          updatedData: props.data,
          editType: 'customUpdateSelectedFeaturesIndexes',
          editContext: {
            featureIndexes: event.picks.map((pick) => pick.index),
          },
        })
      } else if (positionIndexes?.length) {
        props.onEdit({
          updatedData: props.data,
          editType: 'customUpdateSelectedPositionIndexes',
          editContext: {
            ...(positionIndexes && { positionIndexes }),
          },
        })
      }
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
