import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import { uniq } from 'es-toolkit'
import { DateTime } from 'luxon'

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
  realTimeLatestUpdate: string
}

const initialState: TimebarSlice = {
  highlightedTime: undefined,
  highlightedEvents: [],
  highlightedEventSelected: undefined,
  hasChangedSettingsOnce: false,
  realTimeLatestUpdate: DateTime.now().toISO() as string,
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
    setHasChangedSettings: (state) => {
      state.hasChangedSettingsOnce = true
    },
    setRealTimeLatestUpdate: (state, action: PayloadAction<string>) => {
      state.realTimeLatestUpdate = action.payload
    },
  },
})

export const {
  setHighlightedTime,
  setSelectedHighlightedEvent,
  setHighlightedEvents,
  disableHighlightedTime,
  setHasChangedSettings,
  setRealTimeLatestUpdate,
} = slice.actions

export default slice.reducer

export const selectHighlightedTime = (state: RootState) => state.timebar.highlightedTime
export const selectHighlightedEventSelected = (state: RootState) =>
  state.timebar.highlightedEventSelected
export const selectHoveredHighlightedEvents = (state: RootState) => state.timebar.highlightedEvents
export const selectHasChangedSettingsOnce = (state: RootState) =>
  state.timebar.hasChangedSettingsOnce
export const selectRealTimeLatestUpdate = (state: RootState) => state.timebar.realTimeLatestUpdate

export const selectHighlightedEvents = createSelector(
  selectHighlightedEventSelected,
  selectHoveredHighlightedEvents,
  (selectedEvent, hoveredEvents = []) => {
    if (selectedEvent) {
      return uniq([selectedEvent, ...hoveredEvents])
    }
    return hoveredEvents
  }
)
