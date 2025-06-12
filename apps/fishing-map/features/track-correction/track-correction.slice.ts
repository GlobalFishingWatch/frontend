import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { RootState } from 'reducers'

import { parseAPIError } from '@globalfishingwatch/api-client'

import { PATH_BASENAME } from 'data/config'

export type IssueType = 'falsePositive' | 'falseNegative' | 'other'

type TrackCorrectionComment = {
  comment: string
  user: string
  date: string
  datasetVersion: number
  resolved: boolean
}

export type TrackCorrection = {
  issueId: string
  vesselId: string
  startDate: string
  endDate: string
  type: IssueType
  lastUpdated: string
  resolved: boolean
  comments?: TrackCorrectionComment[]
  latitude: number
  longitude: number
}

type TrackCorrectionState = {
  newIssue: {
    vesselDataviewId: string
    timerange: {
      start: string
      end: string
    }
    type: IssueType
  }
  issues: TrackCorrection[]
}

const initialState: TrackCorrectionState = {
  newIssue: {
    vesselDataviewId: '',
    timerange: {
      start: '',
      end: '',
    },
    type: 'falsePositive',
  },
  issues: [],
}

type FetchTrackCorrectionsThunkParam = {
  workspaceId: string
}

export const fetchTrackIssuesThunk = createAsyncThunk(
  'trackCorrection/fetch',
  async (
    { workspaceId }: FetchTrackCorrectionsThunkParam = {} as FetchTrackCorrectionsThunkParam,
    { signal, getState, rejectWithValue, dispatch }
  ) => {
    try {
      // TODO: should we securize this endpoint?
      const response = await fetch(`${PATH_BASENAME}/api/track-corrections`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch track corrections')
      }
      const data = await response.json()
      return data
    } catch (e: any) {
      return rejectWithValue(parseAPIError(e))
    }
  }
)

type FetchTrackCorrectionDetailsThunkParam = {
  workspaceId: string
  trackCorrectionId: string
}
export const fetchTrackCorrectionDetailsThunk = createAsyncThunk(
  'trackCorrection/fetchDetails',
  async (
    {
      workspaceId,
      trackCorrectionId,
    }: FetchTrackCorrectionDetailsThunkParam = {} as FetchTrackCorrectionDetailsThunkParam,
    { signal, getState, rejectWithValue, dispatch }
  ) => {
    try {
      console.log(
        `TODO: fetch track correction details for ${trackCorrectionId} in workspace ${workspaceId}`
      )
      return []
    } catch (e: any) {
      return rejectWithValue(parseAPIError(e))
    }
  }
)

const trackCorrection = createSlice({
  name: 'trackCorrection',
  initialState,
  reducers: {
    setTrackCorrectionDataviewId: (state, action: PayloadAction<string>) => {
      state.newIssue.vesselDataviewId = action.payload
    },
    setTrackCorrectionTimerange: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.newIssue.timerange = action.payload
    },
    resetTrackCorrection: (state) => {
      state.newIssue.vesselDataviewId = ''
      state.newIssue.timerange = {
        start: '',
        end: '',
      }
    },
  },
})

export const { setTrackCorrectionDataviewId, setTrackCorrectionTimerange, resetTrackCorrection } =
  trackCorrection.actions

export const selectTrackCorrectionVesselDataviewId = (state: RootState) =>
  state.trackCorrection.newIssue.vesselDataviewId

export const selectTrackCorrectionTimerange = (state: RootState) =>
  state.trackCorrection.newIssue.timerange

export default trackCorrection.reducer
