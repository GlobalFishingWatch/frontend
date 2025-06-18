import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { RootState } from 'reducers'

import { parseAPIError } from '@globalfishingwatch/api-client'

import { PATH_BASENAME } from 'data/config'
import { AsyncReducerStatus } from 'utils/async-slice'

export type IssueType = 'falsePositive' | 'falseNegative' | 'other'

export type TrackCorrectionComment = {
  issueId: string
  comment: string
  userName: string
  userEmail: string
  workspaceLink: string
  date: string
  datasetVersion: number
  marksAsResolved: boolean
}

export type TrackCorrection = {
  issueId: string
  vesselId: string
  vesselName?: string
  startDate: string
  endDate: string
  type: IssueType
  lastUpdated: string
  resolved: boolean
  comments?: TrackCorrectionComment[]
  lat: number
  lon: number
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
  comment: string
  issues: {
    status: AsyncReducerStatus
    data: TrackCorrection[]
  }
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
  comment: '',
  issues: {
    status: AsyncReducerStatus.Idle,
    data: [],
  },
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
      const response = await fetch(`${PATH_BASENAME}/api/track-corrections/${workspaceId}`, {
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

      const data = await response.json()

      return data
    } catch (e: any) {
      return rejectWithValue(e.message || 'An unknown error occurred')
    }
  }
)

type CreateCommentThunkParam = {
  issueId: string
  commentBody: TrackCorrectionComment
  workspaceId: string
}
export const createCommentThunk = createAsyncThunk(
  'trackCorrection/comment',
  async (
    { issueId, commentBody, workspaceId }: CreateCommentThunkParam,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await fetch(
        `${PATH_BASENAME}/api/track-corrections/${workspaceId}/${issueId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            issueId,
            commentBody,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to submit track correction')
      }

      const data = await response.json()

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
    { rejectWithValue }
  ) => {
    try {
      // TODO: should we securize this endpoint?
      const response = await fetch(`${PATH_BASENAME}/api/track-corrections/${workspaceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const data = await response.json()
      return data
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
      state.comment = action.payload
    },

    resetTrackCorrection: (state) => {
      state.newIssue.vesselDataviewId = ''
      state.newIssue.timerange = {
        start: '',
        end: '',
      }
      state.newIssue.type = 'falsePositive'
      state.issues.data = []
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTrackIssuesThunk.pending, (state) => {
      state.issues.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchTrackIssuesThunk.fulfilled, (state, action) => {
      state.issues.status = AsyncReducerStatus.Finished
      state.issues.data = action.payload
    })
    builder.addCase(fetchTrackIssuesThunk.rejected, (state) => {
      state.issues.status = AsyncReducerStatus.Error
    })
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

export const selectTrackIssueComment = (state: RootState) => state.trackCorrection.comment

export const selectTrackCorrectionState = (state: RootState) => state.trackCorrection

export const selectAllTrackCorrectionIssues = (state: RootState) =>
  state.trackCorrection.issues.data

export const selectTrackIssueComments = (issueId: string) => (state: RootState) =>
  state.trackCorrection.issues.data.find((issue) => issue.issueId === issueId)?.comments || []

export default trackCorrection.reducer
