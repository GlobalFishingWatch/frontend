import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { RootState } from 'reducers'

export type TimeRange = {
  start: string
  end: string
}

type TimebarSlice = {
  highlightedTime: TimeRange | undefined
  highlightedEvents: string[] | undefined
  highlightedEventSelected: string | undefined
  hasChangedSettingsOnce: boolean
}

const initialState: TimebarSlice = {
  highlightedTime: undefined,
  highlightedEvents: [],
  highlightedEventSelected: undefined,
  hasChangedSettingsOnce: false,
}

const slice = createSlice({
  name: 'timebar',
  initialState,
  reducers: {
    setHighlightedTime: (state, action: PayloadAction<TimeRange>) => {
      state.highlightedTime = action.payload
    },
    setSelectedHighlightedEvent: (state, action: PayloadAction<string | undefined>) => {
      state.highlightedEventSelected = action.payload
    },
    setHighlightedEvents: (state, action: PayloadAction<string[] | undefined>) => {
      state.highlightedEvents = action.payload
    },
    disableHighlightedTime: (state) => {
      state.highlightedTime = undefined
    },
    changeSettings: (state) => {
      state.hasChangedSettingsOnce = true
    },
  },
})

export const {
  setHighlightedTime,
  setSelectedHighlightedEvent,
  setHighlightedEvents,
  disableHighlightedTime,
  changeSettings,
} = slice.actions

export default slice.reducer

export const selectHighlightedTime = (state: RootState) => state.timebar.highlightedTime
export const selectHighlightedEventSelected = (state: RootState) =>
  state.timebar.highlightedEventSelected
export const selectHoveredHighlightedEvents = (state: RootState) => state.timebar.highlightedEvents
export const selectHasChangedSettingsOnce = (state: RootState) =>
  state.timebar.hasChangedSettingsOnce

export const selectHighlightedEvents = createSelector(
  selectHighlightedEventSelected,
  selectHoveredHighlightedEvents,
  (selectedEvent, hoveredEvents = []) => {
    if (selectedEvent) {
      return [selectedEvent, ...hoveredEvents]
    }
    return hoveredEvents
  }
)
