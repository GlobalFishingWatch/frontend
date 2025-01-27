import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { RootState } from 'reducers'

import type { RulerData } from '@globalfishingwatch/deck-layers'

import type { MapAnnotation } from '../overlays/annotations/annotations.types'

export const MAP_CONTROL_ANNOTATIONS = 'annotations'
export const MAP_CONTROL_RULERS = 'rulers'
export const MAP_CONTROL_ERROR_NOTIFICATIONS = 'errorNotification'
export type MapControl =
  | typeof MAP_CONTROL_ANNOTATIONS
  | typeof MAP_CONTROL_RULERS
  | typeof MAP_CONTROL_ERROR_NOTIFICATIONS
export type MapControlValue = Partial<MapAnnotation> | RulerData | null

type MapControlsSlice = Record<
  MapControl,
  {
    isEditing: boolean
    value: MapControlValue
  }
>

const initialState: MapControlsSlice = {
  annotations: {
    isEditing: false,
    value: null,
  },
  rulers: {
    isEditing: false,
    value: null,
  },
  errorNotification: {
    isEditing: false,
    value: null,
  },
}

const slice = createSlice({
  name: 'mapControls',
  initialState,
  reducers: {
    setMapControlValue: (
      state,
      action: PayloadAction<{ control: MapControl; value: MapControlValue }>
    ) => {
      const { control, value } = action.payload
      state[control].value = { ...state[control].value, ...value }
    },
    setMapControlEditing: (
      state,
      action: PayloadAction<{ control: MapControl; editing: boolean }>
    ) => {
      const { control, editing } = action.payload
      state[control].isEditing = editing
      if (editing) {
        // Disable editing of any other control
        const controls = Object.keys(initialState) as MapControl[]
        controls.forEach((c) => {
          if (c !== control) {
            state[c].isEditing = false
          }
        })
      }
    },
    resetMapControlValue: (state, action: PayloadAction<MapControl>) => {
      if (action.payload) {
        state[action.payload].value = null
      }
    },
  },
})

export const { setMapControlValue, setMapControlEditing, resetMapControlValue } = slice.actions

const selectMapControls = (state: RootState) => state.mapControls
export const selectMapControlEditing = (control: MapControl) =>
  createSelector([selectMapControls], (mapControls) => {
    return mapControls[control].isEditing
  })

export function selectMapControlValue<P = MapControlValue>(control: MapControl) {
  return createSelector([selectMapControls], (mapControls) => {
    return mapControls[control].value as P
  })
}

export default slice.reducer
