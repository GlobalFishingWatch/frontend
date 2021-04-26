import { createSelector, createSlice } from '@reduxjs/toolkit'
import { VesselSearch } from '@globalfishingwatch/api-types'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectQueryParam } from 'routes/routes.selectors'
import { fetchVesselSearchThunk } from './search.thunk'

export type CachedVesselSearch = {
  offset: number
  searching: boolean
  total: number | null
  vessels: VesselSearch[] | null
}

const searchInitialState = {
  vessels: null,
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
        state.queries[action.meta.arg.query] = action.payload
      } else {
        state.queries[action.meta.arg.query].searching = false
      }
    })
    builder.addCase(fetchVesselSearchThunk.rejected, (state, action) => {
      state.queries[action.meta.arg.query].searching = false
    })
  },
})
export default slice.reducer

export const getVesselsFound = (state: RootState) => state.search.queries

export const getSearchMetadata = createSelector(
  [getVesselsFound, selectQueryParam('q')],
  (search, query: string) => {
    return search && search[query] !== undefined ? search[query] : null
  }
)

export const getSearchResults = createSelector([getSearchMetadata], (metadata) => {
  return (metadata && metadata.vessels) || []
})

export const getOffset = createSelector([getSearchMetadata], (metadata) => {
  return (metadata && metadata.offset) || 0
})

export const getTotalResults = createSelector([getSearchMetadata], (metadata) => {
  return (metadata && metadata.total) || 0
})

export const isSearching = createSelector([getSearchMetadata], (metadata) => {
  return (metadata && metadata.searching) || false
})
