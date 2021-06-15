import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { VesselSearch } from '@globalfishingwatch/api-types'
import { AsyncReducerStatus } from 'utils/async-slice'
import { RootState } from 'store'
import { ActivityEvent, ActivityEventGroup } from 'types/activity'
import { fetchVesselActivityThunk } from './vessels-activity.thunk'

export type ActivitySlice = {
  status: AsyncReducerStatus
  events: ActivityEventGroup[]
}

const initialState: ActivitySlice = {
  status: AsyncReducerStatus.Idle,
  events: [],
}

const slice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    toggleGroup: (state, action: PayloadAction<{ index: number }>) => {
      const index = action.payload.index
      state.events[index].open = !state.events[index].open
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchVesselActivityThunk.pending, (state, action) => {
      state.status = AsyncReducerStatus.Loading

    })
    builder.addCase(fetchVesselActivityThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      console.log(action.payload)
      if (action.payload) {
        state.events = action.payload
      }
    })
    builder.addCase(fetchVesselActivityThunk.rejected, (state, action) => {

    })
  },
})

export const {
  toggleGroup,
} = slice.actions

export default slice.reducer

export const selectVesselActivity = (state: RootState) => state.activity.events
