import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ApiEvent } from '@globalfishingwatch/api-types'
import { RootState } from 'store'

export type Range = {
  start: string
  end: string
}

type TimebarSlice = {
  highlightedTime: Range | undefined
  highlightedEvent: ApiEvent | undefined
  hasChangedSettingsOnce: boolean
}

const initialState: TimebarSlice = {
  highlightedTime: undefined,
  highlightedEvent: undefined,
  hasChangedSettingsOnce: false,
}

const slice = createSlice({
  name: 'timebar',
  initialState,
  reducers: {
    setHighlightedTime: (state, action: PayloadAction<Range>) => {
      state.highlightedTime = action.payload
    },
    setHighlightedEvent: (state, action: PayloadAction<ApiEvent | undefined>) => {
      state.highlightedEvent = action.payload
    },
    disableHighlightedTime: (state) => {
      state.highlightedTime = undefined
    },
    changeSettings: (state) => {
      state.hasChangedSettingsOnce = true
    },
  },
})

export const { setHighlightedTime, setHighlightedEvent, disableHighlightedTime, changeSettings } =
  slice.actions

export default slice.reducer

export const selectHighlightedTime = (state: RootState) => state.timebar.highlightedTime
export const selectHighlightedEvent = (state: RootState) => state.timebar.highlightedEvent
export const selectHasChangedSettingsOnce = (state: RootState) =>
  state.timebar.hasChangedSettingsOnce
