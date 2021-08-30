import { createSlice } from '@reduxjs/toolkit'
import { VesselSearch } from '@globalfishingwatch/api-types'
import { AsyncReducerStatus } from 'utils/async-slice'
import { fetchVesselSearchThunk } from './search.thunk'

export type CachedVesselSearch = {
  offset: number
  searching: boolean
  total: number | null
  vessels: VesselSearch[]
}

const searchInitialState = {
  vessels: [],
  total: 0,
}

export type CachedQuerySearch = {
  [key: string]: CachedVesselSearch
}

export type SearchSlice = {
  status: AsyncReducerStatus
  queries: CachedQuerySearch
}

export type SearchType = 'basic' | 'advanced'

const initialState: SearchSlice = {
  status: AsyncReducerStatus.Idle,
  queries: {},
}

const slice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchVesselSearchThunk.pending, (state, action) => {
      state.status = AsyncReducerStatus.Loading
      if (action.meta.arg.query) {
        if (!state.queries[action.meta.arg.query]) {
          state.queries[action.meta.arg.query] = {
            ...searchInitialState,
            offset: action.meta.arg.offset,
            searching: true,
          }
        } else {
          state.queries[action.meta.arg.query].searching = true
          if (state.queries[action.meta.arg.query].offset !== action.meta.arg.offset) {
          }
          state.queries[action.meta.arg.query].offset = action.meta.arg.offset
        }
      }
    })
    builder.addCase(fetchVesselSearchThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      if (action.payload) {
        state.queries[action.meta.arg.query] = {
          ...action.payload,
          vessels:
            action.meta.arg.offset > 0
              ? [...state.queries[action.meta.arg.query].vessels, ...action.payload.vessels]
              : action.payload.vessels,
        }
      } else {
        state.queries[action.meta.arg.query].searching = false
      }
    })
    builder.addCase(fetchVesselSearchThunk.rejected, (state, action) => {
      if (state.queries[action.meta.arg.query]) {
        state.queries[action.meta.arg.query].searching = false
      }
    })
  },
})
export default slice.reducer
