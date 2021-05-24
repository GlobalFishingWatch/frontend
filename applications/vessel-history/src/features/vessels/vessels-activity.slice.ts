import { createSlice } from '@reduxjs/toolkit'
import { VesselSearch } from '@globalfishingwatch/api-types'
import { AsyncReducerStatus } from 'utils/async-slice'
import { fetchVesselActivityThunk } from './vessels-activity.thunk'

export type SearchSlice = {
  status: AsyncReducerStatus
  events: any[]
}

const initialState: SearchSlice = {
  status: AsyncReducerStatus.Idle,
  events: [],
}

const slice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchVesselActivityThunk.pending, (state, action) => {
      state.status = AsyncReducerStatus.Loading

    })
    builder.addCase(fetchVesselActivityThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished

    })
    builder.addCase(fetchVesselActivityThunk.rejected, (state, action) => {

    })
  },
})
export default slice.reducer
