import type { PayloadAction, WithSlice } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'

import type { RulerData } from '@globalfishingwatch/deck-layers'

import { rootReducer } from 'reducers'

import type { MapAnnotation } from '../overlays/annotations/annotations.types'

export const MAP_CONTROL_ANNOTATIONS = 'annotations'
export const MAP_CONTROL_RULERS = 'rulers'
export const MAP_CONTROL_ERROR_NOTIFICATIONS = 'errorNotification'
export type MapControl =
  | typeof MAP_CONTROL_ANNOTATIONS
  | typeof MAP_CONTROL_RULERS
  | typeof MAP_CONTROL_ERROR_NOTIFICATIONS
export type MapControlValue = Partial<MapAnnotation> | RulerData | null

type MapControlState = {
  isEditing: boolean
  value: MapControlValue
}

type MapControlsSlice = {
  [K in MapControl]: MapControlState
} & {
  mapSearchOpenRequested: boolean
}

const MAP_CONTROLS: MapControl[] = [
  MAP_CONTROL_ANNOTATIONS,
  MAP_CONTROL_RULERS,
  MAP_CONTROL_ERROR_NOTIFICATIONS,
]

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
  mapSearchOpenRequested: false,
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
        MAP_CONTROLS.forEach((c) => {
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
    setMapSearchOpenRequested: (state, action: PayloadAction<boolean>) => {
      state.mapSearchOpenRequested = action.payload
    },
  },
})

export const {
  setMapControlValue,
  setMapControlEditing,
  resetMapControlValue,
  setMapSearchOpenRequested,
} = slice.actions

const injectedMapControlsSlice = rootReducer.inject(slice)

declare module 'reducers' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface LazyLoadedSlices extends WithSlice<typeof slice> {}
}

const selectMapControls = injectedMapControlsSlice.selector((state) => state.mapControls)
export const selectMapControlEditing = (control: MapControl) =>
  createSelector([selectMapControls], (mapControls) => {
    return mapControls[control].isEditing
  })

export function selectMapControlValue<P = MapControlValue>(control: MapControl) {
  return createSelector([selectMapControls], (mapControls) => {
    return mapControls[control].value as P
  })
}

export const selectMapSearchOpenRequested = createSelector(
  [selectMapControls],
  (mapControls) => mapControls.mapSearchOpenRequested
)

export default slice.reducer
