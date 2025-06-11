import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from 'reducers'

type TrackCorrectionState = {
  vesselDataviewId: string
  timerange: {
    start: string
    end: string
  }
}

const initialState: TrackCorrectionState = {
  vesselDataviewId: '',
  timerange: {
    start: '',
    end: '',
  },
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
    resetTrackCorrection: (state) => {
      state.vesselDataviewId = ''
      state.timerange = {
        start: '',
        end: '',
      }
    },
  },
})

export const { setTrackCorrectionDataviewId, setTrackCorrectionTimerange, resetTrackCorrection } =
  trackCorrection.actions

export const selectTrackCorrectionVesselDataviewId = (state: RootState) =>
  state.trackCorrection.vesselDataviewId

export const selectTrackCorrectionTimerange = (state: RootState) => state.trackCorrection.timerange

export default trackCorrection.reducer
