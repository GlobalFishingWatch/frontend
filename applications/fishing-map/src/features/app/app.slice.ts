import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'

type MapState = {
  screenshotMode: boolean
  screenshotLoading: boolean
  heatmapSublayersAddedIndex?: number
}

const initialState: MapState = {
  screenshotMode: false,
  screenshotLoading: false,
}

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setScreenshotMode: (state, action: PayloadAction<boolean>) => {
      state.screenshotMode = action.payload
    },
    setScreenshotLoading: (state, action: PayloadAction<boolean>) => {
      state.screenshotLoading = action.payload
    },
    setHeatmapSublayersAddedIndex: (state, action: PayloadAction<number>) => {
      state.heatmapSublayersAddedIndex = action.payload
    },
  },
})

export const selectScreenshotMode = (state: RootState) => state.app.screenshotMode
export const selectScreenshotLoading = (state: RootState) => state.app.screenshotLoading
export const selectHeatmapSublayersAddedIndex = (state: RootState) =>
  state.app.heatmapSublayersAddedIndex

export const {
  setScreenshotMode,
  setScreenshotLoading,
  setHeatmapSublayersAddedIndex,
} = slice.actions
export default slice.reducer
