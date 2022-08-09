import { createSlice } from '@reduxjs/toolkit'
import { RelatedVesselSearchMerged, VesselSearch } from '@globalfishingwatch/api-types'
import { AsyncReducerStatus } from 'utils/async-slice'
import { fetchVesselSearchThunk, getSerializedQuery } from './search.thunk'
import { mergeSearchVessels } from './search.utils'

export type CachedVesselSearch = {
  offset: number
  searching: boolean
  total: number | null
  vessels: RelatedVesselSearchMerged[]
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
      const serializedQuery = getSerializedQuery(
        action.meta.arg.query,
        action.meta.arg.advancedSearch
      )
      if (serializedQuery) {
        if (!state.queries[serializedQuery]) {
          state.queries[serializedQuery] = {
            ...searchInitialState,
            offset: action.meta.arg.offset,
            searching: true,
          }
        } else {
          state.queries[serializedQuery].searching = true
          if (state.queries[serializedQuery].offset !== action.meta.arg.offset) {
          }
          state.queries[serializedQuery].offset = action.meta.arg.offset
        }
      }
    })
    builder.addCase(fetchVesselSearchThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      const serializedQuery = getSerializedQuery(
        action.meta.arg.query,
        action.meta.arg.advancedSearch
      )
      if (action.payload) {
        state.queries[serializedQuery] = {
          ...action.payload,
          vessels:
            action.meta.arg.offset > 0
              ? [...state.queries[serializedQuery].vessels, ...action.payload.vessels]
              : mergeSearchVessels(action.payload.vessels),
        }
      } else {
        state.queries[serializedQuery].searching = false
      }
    })
    builder.addCase(fetchVesselSearchThunk.rejected, (state, action) => {
      const serializedQuery = getSerializedQuery(
        action.meta.arg.query,
        action.meta.arg.advancedSearch
      )
      if (state.queries[serializedQuery]) {
        state.queries[serializedQuery].searching = false
      }
    })
  },
})
export default slice.reducer
