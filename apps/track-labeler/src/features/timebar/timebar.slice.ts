import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from '../../store'

type TimebarSlice = {
  highlightedTime:
    | {
        start: string
        end: string
      }
    | undefined
  highlightedEvent:
    | {
        start: string
        end: string
      }
    | undefined
  tooltip: string | null
}

const initialState: TimebarSlice = {
  highlightedTime: undefined,
  highlightedEvent: undefined,
  tooltip: null,
}

const slice = createSlice({
  name: 'timebar',
  initialState,
  reducers: {
    setHighlightedTime: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.highlightedTime = action.payload
    },
    setHighlightedEvent: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.highlightedEvent = action.payload
    },
    setTooltip: (state, action: PayloadAction<{ tooltip: string | null }>) => {
      state.tooltip = action.payload.tooltip
    },
    disableHighlightedTime: (state) => {
      state.highlightedTime = undefined
    },
    disableHighlightedEvent: (state) => {
      state.highlightedEvent = undefined
    },
  },
})

export const {
  setHighlightedTime,
  setHighlightedEvent,
  disableHighlightedEvent,
  disableHighlightedTime,
  setTooltip,
} = slice.actions
export default slice.reducer

export const selectHighlightedTime = (state: RootState) => state.timebar.highlightedTime
export const selectHighlightedEvent = (state: RootState) => state.timebar.highlightedEvent
export const selectTooltip = (state: RootState) => state.timebar.tooltip
