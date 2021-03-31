import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DEFAULT_TIME_RANGE } from 'data/config'
import { RootState } from 'store'

type Range = {
  start: string
  end: string
}

type TimebarSlice = {
  highlightedTime: Range | undefined
  staticTime: Range
  hasChangedSettingsOnce: boolean
}

const initialState: TimebarSlice = {
  highlightedTime: undefined,
  staticTime: DEFAULT_TIME_RANGE,
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
      state.highlightedTime = undefined
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
