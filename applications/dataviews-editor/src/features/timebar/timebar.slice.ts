import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TRACK_START, TRACK_END } from 'config'
import { RootState } from 'store/store'

type TimebarSlice = {
  time: {
    start: string
    end: string
  }
}

const initialState: TimebarSlice = {
  time: {
    start: TRACK_START.toISOString(),
    end: TRACK_END.toISOString(),
  },
}

const slice = createSlice({
  name: 'timebar',
  initialState,
  reducers: {
    setTime: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.time.start = action.payload.start
      state.time.end = action.payload.end
    },
  },
})

export const { setTime } = slice.actions
export default slice.reducer

export const selectTime = (state: RootState) => state.timebar.time
