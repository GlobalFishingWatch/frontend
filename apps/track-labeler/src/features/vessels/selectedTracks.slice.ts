import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit'
import undoable from 'redux-undo'

import type { RootState } from '../../store'
import type { ActionType } from '../../types'

export type SelectedTrackType = {
  start?: number | null
  startLatitude?: number | null
  startLongitude?: number | null
  end?: number | null
  endLatitude?: number | null
  endLongitude?: number | null
  action?: ActionType | string
}

export type SelectedTrackSlice = {
  segments: SelectedTrackType[]
}

const initialState: SelectedTrackSlice = {
  segments: [],
}

const slice = createSlice({
  name: 'selectedtracks',
  initialState,
  reducers: {
    addSelectedTrack: (state, action: PayloadAction<SelectedTrackType>) => {
      state.segments.push(action.payload)
    },
    updateSelectedTrack: (
      state,
      action: PayloadAction<{ index: number; segment: SelectedTrackType }>
    ) => {
      state.segments[action.payload.index] = action.payload.segment
    },
    deleteSelectedTrack: (state, action: PayloadAction<{ index: number }>) => {
      state.segments.splice(action.payload.index, 1)
    },
    clearSelected: (state) => {
      state.segments = []
    },
    updateActionSelectedTrack: (
      state,
      action: PayloadAction<{ index: number; action: ActionType | string }>
    ) => {
      state.segments[action.payload.index].action = action.payload.action
    },
    setSelectedTrack: (state, action: PayloadAction<SelectedTrackType[]>) => {
      state.segments = action.payload
    },
  },
})
export const {
  addSelectedTrack,
  setSelectedTrack,
  updateSelectedTrack,
  updateActionSelectedTrack,
  deleteSelectedTrack,
  clearSelected,
} = slice.actions
export default undoable(slice.reducer, {
  limit: 10,
})

export const selectedtracks = (state: RootState) => state.selectedtracks.present.segments
export const pastSelectedtracks = (state: RootState) => state.selectedtracks.past
export const futureSelectedtracks = (state: RootState) => state.selectedtracks.future
