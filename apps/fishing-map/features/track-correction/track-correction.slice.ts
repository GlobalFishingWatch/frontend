import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { RootState } from 'reducers'

import { parseAPIError } from '@globalfishingwatch/api-client'

import { PATH_BASENAME } from 'data/config'

export type IssueType = 'falsePositive' | 'falseNegative' | 'other'

export type TrackCorrectionComment = {
  issueId: string
  comment: string
  user: string
  date: string
  datasetVersion: number
  marksAsResolved: boolean
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
  source?: string
}

export type NewIssue = {
  vesselDataviewId: string
  timerange: {
    start: string
    end: string
  }
  type: IssueType
  comment: string
}

type TrackCorrectionState = {
  newIssue: NewIssue
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
    comment: '',
  },
  issues: [],
}

type CreateNewIssueThunkParam = {
  issueBody: TrackCorrection
  commentBody: TrackCorrectionComment
  workspaceId: string
}
export const createNewIssueThunk = createAsyncThunk(
  'trackCorrection/newIssue',
  async (
    { issueBody, commentBody, workspaceId }: CreateNewIssueThunkParam,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await fetch(`/api/track-corrections/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issueBody,
          commentBody,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to submit track correction')
      }

      // Handle successful response
      const data = await response.json()
      console.log('Track correction submitted successfully:', data)

      // Reset form
      dispatch(resetTrackCorrection())

      return data
    } catch (e: any) {
      return rejectWithValue(e.message || 'An unknown error occurred')
    }
  }
)

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
    setTrackIssueType: (state, action: PayloadAction<IssueType>) => {
      state.newIssue.type = action.payload
    },
    setTrackIssueComment: (state, action: PayloadAction<string>) => {
      state.newIssue.comment = action.payload
    },

    resetTrackCorrection: (state) => {
      state.newIssue.vesselDataviewId = ''
      state.newIssue.timerange = {
        start: '',
        end: '',
      }
      state.newIssue.type = 'falsePositive'
      state.newIssue.comment = ''
      state.issues = []
    },
  },
})

export const {
  setTrackCorrectionDataviewId,
  setTrackCorrectionTimerange,
  setTrackIssueType,
  setTrackIssueComment,
  resetTrackCorrection,
} = trackCorrection.actions

export const selectTrackCorrectionVesselDataviewId = (state: RootState) =>
  state.trackCorrection.newIssue.vesselDataviewId

export const selectTrackCorrectionTimerange = (state: RootState) =>
  state.trackCorrection.newIssue.timerange

export const selectTrackIssueType = (state: RootState) => state.trackCorrection.newIssue.type

export const selectTrackIssueComment = (state: RootState) => state.trackCorrection.newIssue.comment

export const selectTrackCorrectionState = (state: RootState) => state.trackCorrection

export default trackCorrection.reducer
