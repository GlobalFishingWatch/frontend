import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from 'reducers'

type TrackCorrectionState = {
  vesselDataviewId: string
}

const initialState: TrackCorrectionState = {
  vesselDataviewId: '',
}

const trackCorrection = createSlice({
  name: 'trackCorrection',
  initialState,
  reducers: {
    setTrackCorrectionDataviewId: (state, action: PayloadAction<string>) => {
      state.vesselDataviewId = action.payload
    },
  },
})

export const { setTrackCorrectionDataviewId } = trackCorrection.actions

export const selectTrackCorrectionVesselDataviewId = (state: RootState) =>
  state.trackCorrection.vesselDataviewId

export default trackCorrection.reducer
