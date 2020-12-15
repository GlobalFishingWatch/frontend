import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'

type MapState = {
  screenshotMode: boolean
}

const initialState: MapState = {
  screenshotMode: false,
}

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setScreenshotMode: (state, action: PayloadAction<boolean>) => {
      state.screenshotMode = action.payload
    },
  },
})

export const selectScreenshotMode = (state: RootState) => state.app.screenshotMode

export const { setScreenshotMode } = slice.actions
export default slice.reducer
