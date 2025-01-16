import { createSlice } from '@reduxjs/toolkit'

import type { RelatedVesselSearchMerged} from '@globalfishingwatch/api-types';
import { VesselSearch } from '@globalfishingwatch/api-types'

import { AsyncReducerStatus } from 'utils/async-slice'

import { fetchVesselSearchThunk, getSerializedQuery } from './search.thunk'
import { mergeSearchVessels } from './search.utils'

export type CachedVesselSearch = {
  offset: number
  searching: boolean
  total: number | null
  vessels: RelatedVesselSearchMerged[]
}
export type HttpError = {
  message: string,
  status: number
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
  error?: HttpError
  queries: CachedQuerySearch
  sources: string[]
}

const initialState: SearchSlice = {
  status: AsyncReducerStatus.Idle,
  queries: {},
  error: null,
  sources: []
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
      state.error = null
      state.sources = []
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
        state.sources = action.payload.sources
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
      state.error = action.payload as HttpError
      if (state.queries[serializedQuery]) {
        state.queries[serializedQuery].searching = false
      }
    })
  },
})
export default slice.reducer
