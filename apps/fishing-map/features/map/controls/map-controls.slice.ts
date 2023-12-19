import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'reducers'
import { MapAnnotation, Ruler } from '@globalfishingwatch/layer-composer'

export type MapControl = 'annotations' | 'rulers' | 'errorNotification'
export type MapControlValue = Partial<MapAnnotation> | Ruler | null

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
  name: 'mapAnnotations',
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
    },
    resetMapControlValue: (state, action: PayloadAction<MapControl>) => {
      if (action.payload) {
        state[action.payload].value = null
      }
    },
  },
})

export const { setMapControlValue, setMapControlEditing, resetMapControlValue } = slice.actions

export const selectMapControls = (state: RootState) => state.mapControls
export const selectMapControlRuler = (state: RootState) => state.mapControls.rulers.value as Ruler

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
