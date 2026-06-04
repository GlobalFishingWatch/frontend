import type { Pick } from '@deck.gl-community/editable-layers'
import {
  DrawPointMode,
  DrawPolygonMode,
  ModifyMode,
  TranslateMode,
  ViewMode,
} from '@deck.gl-community/editable-layers'
import uniqBy from 'lodash/uniqBy'

import type { EditHandleFeature } from './draw.types'

export type DrawLayerMode =
  | CustomDrawPolygonMode
  | CustomDrawPointMode
  | CustomViewMode
  | CustomModifyMode
  | CustomTranslateMode

export class CustomDrawPolygonMode extends DrawPolygonMode {
  handleClick(
    event: Parameters<DrawPolygonMode['handleClick']>[0],
    props: Parameters<DrawPolygonMode['handleClick']>[1]
  ) {
    event.sourceEvent.preventDefault()
    return super.handleClick(event, props)
  }

  finishDrawing(props: Parameters<DrawPolygonMode['finishDrawing']>[0]) {
    if (this.getClickSequence().length < 3) {
      return
    }
    return super.finishDrawing(props)
  }

  getGuides(
    props: Parameters<DrawPolygonMode['getGuides']>[0]
  ): ReturnType<DrawPolygonMode['getGuides']> {
    const guides = super.getGuides(props)
    return {
      ...guides,
      features: guides.features.filter((f: any) => {
        const coords = f?.geometry?.coordinates
        if (!Array.isArray(coords)) return true
        if (f.geometry.type === 'LineString') return coords.length >= 2
        return true
      }),
    }
  }
}
export class CustomDrawPointMode extends DrawPointMode {
  handleClick(
    event: Parameters<DrawPointMode['handleClick']>[0],
    props: Parameters<DrawPointMode['handleClick']>[1]
  ) {
    event.sourceEvent.preventDefault()
    return super.handleClick(event, props)
  }
}
export function getPickedEditHandles(picks: Pick[] | null | undefined): EditHandleFeature[] {
  const handles =
    (picks &&
      picks
        .filter((pick) => pick.isGuide && pick.object?.properties?.guideType === 'editHandle')
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
  handleClick(
    event: Parameters<ViewMode['handleClick']>[0],
    props: Parameters<ViewMode['handleClick']>[1]
  ) {
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

function hasValidSelection(props: { selectedIndexes?: number[]; data: { features: any[] } }) {
  return (
    (props.selectedIndexes?.length ?? 0) > 0 &&
    props.selectedIndexes!.every((i) => Boolean(props.data.features[i]?.geometry))
  )
}

export class CustomTranslateMode extends TranslateMode {
  handleStartDragging(
    event: Parameters<TranslateMode['handleStartDragging']>[0],
    props: Parameters<TranslateMode['handleStartDragging']>[1]
  ) {
    if (!hasValidSelection(props)) return
    try {
      return super.handleStartDragging(event, props)
    } catch {
      // ignore
    }
  }

  handleDragging(
    event: Parameters<TranslateMode['handleDragging']>[0],
    props: Parameters<TranslateMode['handleDragging']>[1]
  ) {
    if (!hasValidSelection(props)) return
    try {
      return super.handleDragging(event, props)
    } catch {
      // ignore
    }
  }

  handleStopDragging(
    event: Parameters<TranslateMode['handleStopDragging']>[0],
    props: Parameters<TranslateMode['handleStopDragging']>[1]
  ) {
    if (!hasValidSelection(props)) return
    try {
      return super.handleStopDragging(event, props)
    } catch {
      // ignore
    }
  }
}

export class CustomModifyMode extends ModifyMode {
  getGuides(props: Parameters<ModifyMode['getGuides']>[0]) {
    const sanitized = props.lastPointerMoveEvent
      ? {
          ...props,
          lastPointerMoveEvent: {
            ...props.lastPointerMoveEvent,
            picks: (props.lastPointerMoveEvent.picks || []).filter(
              (pick: any) => !pick.isGuide || pick.object?.properties
            ),
          },
        }
      : props
    try {
      return super.getGuides(sanitized)
    } catch {
      return { type: 'FeatureCollection' as const, features: [] }
    }
  }

  handleClick(
    event: Parameters<ModifyMode['handleClick']>[0],
    props: Parameters<ModifyMode['handleClick']>[1]
  ) {
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
