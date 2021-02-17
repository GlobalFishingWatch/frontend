import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'

type Range = {
  start: string
  end: string
}

type TimebarSlice = {
  highlightedTime: Range | null
  staticTime: Range | null
  hasChangedSettingsOnce: boolean
}

const initialState: TimebarSlice = {
  highlightedTime: null,
  staticTime: null,
  hasChangedSettingsOnce: false,
}

const slice = createSlice({
  name: 'timebar',
  initialState,
  reducers: {
    setHighlightedTime: (state, action: PayloadAction<Range>) => {
      state.highlightedTime = action.payload
    },
    disableHighlightedTime: (state) => {
      state.highlightedTime = null
    },
    setStaticTime: (state, action: PayloadAction<Range>) => {
      state.staticTime = action.payload
    },
    changeSettings: (state) => {
      state.hasChangedSettingsOnce = true
    },
  },
})

export const {
  setHighlightedTime,
  disableHighlightedTime,
  setStaticTime,
  changeSettings,
} = slice.actions
export default slice.reducer

export const selectHighlightedTime = (state: RootState) => state.timebar.highlightedTime
export const selectStaticTime = (state: RootState) => state.timebar.staticTime
export const selectHasChangedSettingsOnce = (state: RootState) =>
  state.timebar.hasChangedSettingsOnce
