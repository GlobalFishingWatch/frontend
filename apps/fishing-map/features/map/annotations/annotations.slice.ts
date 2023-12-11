import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'reducers'

type MapAnnotationsSlice = {
  isAnnotating: boolean
  position: [number, number] | null
  content: string
}

const initialState: MapAnnotationsSlice = {
  isAnnotating: false,
  position: null,
  content: '',
}

const slice = createSlice({
  name: 'mapAnnotations',
  initialState,
  reducers: {
    setMapAnnotationPosition: (
      state,
      action: PayloadAction<{ latitude: number; longitude: number }>
    ) => {
      state.position = [action.payload.longitude, action.payload.latitude]
    },
    setMapAnnotationContent: (state, action: PayloadAction<{ content: string }>) => {
      state.content = action.payload.content
    },
    toggleMapAnnotating: (state) => {
      state.isAnnotating = !state.isAnnotating
    },
    resetMapAnnotations: (state) => {
      return initialState
    },
  },
})

export const {
  setMapAnnotationPosition,
  setMapAnnotationContent,
  toggleMapAnnotating,
  resetMapAnnotations,
} = slice.actions

export const selectIsMapAnnotating = (state: RootState) => state.annotations.isAnnotating
export const selectMapAnnotationsPosition = (state: RootState) => state.annotations.position
export const selectMapAnnotationsContent = (state: RootState) => state.annotations.content

export default slice.reducer
