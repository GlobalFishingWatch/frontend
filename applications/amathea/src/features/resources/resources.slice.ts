import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { RootState } from 'store'
import memoize from 'lodash/memoize'
import GFWAPI from '@globalfishingwatch/api-client'
import { Resource } from '@globalfishingwatch/api-types'
import { AsyncReducer, createAsyncSlice } from 'features/api/api.slice'
import { MONTHLY_DATES } from 'data/data'

export const fetchResourceByIdThunk = createAsyncThunk(
  'resources/fetchById',
  async ({ id, url }: { id: string; url: string }, { rejectWithValue }) => {
    try {
      const { monthly } = url.includes('storage.googleapis')
        ? await fetch(url).then((r) => r.json())
        : await GFWAPI.fetch<Resource>(url)

      // TODO: remove this and use the above once redirect to .json works
      const data = MONTHLY_DATES.map((date, index) => {
        const value = monthly[index] || 0
        return { date, value }
      })
      return { id, data }
    } catch (e) {
      return rejectWithValue(id)
    }
  }
)

export type ResourcesState = AsyncReducer<Resource<any>>

const { slice: resourcessSlice, entityAdapter } = createAsyncSlice<ResourcesState, Resource<any>>({
  name: 'resources',
  thunks: {
    fetchByIdThunk: fetchResourceByIdThunk,
  },
})

export const { selectAll, selectById } = entityAdapter.getSelectors<RootState>(
  (state) => state.resources
)

export const selectResourceById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export default resourcessSlice.reducer
