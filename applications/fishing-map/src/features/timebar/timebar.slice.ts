import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'

export type Range = {
  start: string
  end: string
}

type TimebarSlice = {
  highlightedTime: Range | undefined
  staticTime: Range | undefined
  hasChangedSettingsOnce: boolean
}

const initialState: TimebarSlice = {
  highlightedTime: undefined,
  staticTime: undefined,
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
