import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from 'reducers'

export type IssueType = 'falsePositive' | 'falseNegative' | 'other'

type TrackCorrectionState = {
  vesselDataviewId: string
  timerange: {
    start: string
    end: string
  }
  issueType: IssueType
  comment: string
  issueCreatedAt?: string
  issueCreatedBy?: string
}

const initialState: TrackCorrectionState = {
  vesselDataviewId: '',
  timerange: {
    start: '',
    end: '',
  },
  issueType: 'falsePositive',
  comment: '',
}

const trackCorrection = createSlice({
  name: 'trackCorrection',
  initialState,
  reducers: {
    setTrackCorrectionDataviewId: (state, action: PayloadAction<string>) => {
      state.vesselDataviewId = action.payload
    },
    setTrackCorrectionTimerange: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.timerange = action.payload
    },
    setTrackIssueType: (state, action: PayloadAction<IssueType>) => {
      state.issueType = action.payload
    },
    setTrackIssueComment: (state, action: PayloadAction<string>) => {
      state.comment = action.payload
    },
    setTrackIssueCreatedInfo: (
      state,
      action: PayloadAction<{ createdAt: string; createdBy: string }>
    ) => {
      state.issueCreatedAt = action.payload.createdAt
      state.issueCreatedBy = action.payload.createdBy
    },
    resetTrackCorrection: (state) => {
      state.vesselDataviewId = ''
      state.timerange = {
        start: '',
        end: '',
      }
      state.issueType = 'falsePositive'
      state.comment = ''
      state.issueCreatedAt = undefined
      state.issueCreatedBy = undefined
    },
  },
})

export const {
  setTrackCorrectionDataviewId,
  setTrackCorrectionTimerange,
  setTrackIssueType,
  setTrackIssueComment,
  setTrackIssueCreatedInfo,
  resetTrackCorrection,
} = trackCorrection.actions

export const selectTrackCorrectionVesselDataviewId = (state: RootState) =>
  state.trackCorrection.vesselDataviewId

export const selectTrackCorrectionTimerange = (state: RootState) => state.trackCorrection.timerange

export const selectTrackIssueType = (state: RootState) => state.trackCorrection.issueType

export default trackCorrection.reducer
