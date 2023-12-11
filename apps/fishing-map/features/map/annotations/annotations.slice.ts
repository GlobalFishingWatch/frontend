import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'reducers'
import { MapAnnotation } from '@globalfishingwatch/layer-composer'

type MapAnnotationsSlice = {
  isAnnotating: boolean
  annotation: MapAnnotation | null
}

const initialState: MapAnnotationsSlice = {
  isAnnotating: false,
  annotation: null,
}

const slice = createSlice({
  name: 'mapAnnotations',
  initialState,
  reducers: {
    setMapAnnotation: (state, action: PayloadAction<Partial<MapAnnotation>>) => {
      state.annotation = { ...state.annotation, ...(action.payload as MapAnnotation) }
    },
    toggleMapAnnotating: (state) => {
      state.isAnnotating = !state.isAnnotating
    },
    resetMapAnnotation: (state) => {
      return initialState
    },
  },
})

export const { setMapAnnotation, toggleMapAnnotating, resetMapAnnotation } = slice.actions

export const selectIsMapAnnotating = (state: RootState) => state.annotations.isAnnotating
export const selectMapAnnotation = (state: RootState) => state.annotations.annotation

export default slice.reducer
