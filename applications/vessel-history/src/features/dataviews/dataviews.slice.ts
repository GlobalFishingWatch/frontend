import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { memoize, uniqBy } from 'lodash'
import { Dataview } from '@globalfishingwatch/api-types'
import GFWAPI from '@globalfishingwatch/api-client'
import { AsyncReducer, AsyncReducerStatus, createAsyncSlice } from 'utils/async-slice'
import { RootState } from 'store'

export const fetchDataviewsByIdsThunk = createAsyncThunk(
  'dataviews/fetch',
  async (ids: number[], { signal, rejectWithValue, getState }) => {
    const existingIds = selectIds(getState() as RootState) as string[]
    const uniqIds = Array.from(new Set([...ids, ...existingIds]))
    try {
      let dataviews = await GFWAPI.fetch<Dataview[]>(`/v1/dataviews?ids=${uniqIds.join(',')}`, {
        signal,
      })
      if (
        process.env.NODE_ENV === 'development' ||
        process.env.REACT_APP_USE_LOCAL_DATAVIEWS === 'true'
      ) {
        const mockedDataviews = await import('./dataviews.mock')
        dataviews = uniqBy([...mockedDataviews.default, ...dataviews], 'id')
      }
      return dataviews
    } catch (e: any) {
      return rejectWithValue({ status: e.status || e.code, message: e.message })
    }
  },
  {
    // IMPORTANT to prevent re fetching records that are already in our store
    condition: (ids: number[], { getState }) => {
      const { dataviews } = getState() as RootState
      const fetchStatus = dataviews.status
      const allRecordsLoaded = ids.every((id) => dataviews.ids.includes(id))
      if (
        (fetchStatus === AsyncReducerStatus.Finished && allRecordsLoaded) ||
        fetchStatus === AsyncReducerStatus.Loading
      ) {
        // Already fetched or in progress, don't need to re-fetch
        return false
      }
      return true
    },
  }
)
export type ResourcesState = AsyncReducer<Dataview>

const { slice: dataviewsSlice, entityAdapter } = createAsyncSlice<ResourcesState, Dataview>({
  name: 'dataview',
  thunks: {
    fetchThunk: fetchDataviewsByIdsThunk,
  },
})

export const {
  selectAll: selectAllDataviews,
  selectById,
  selectIds,
} = entityAdapter.getSelectors<RootState>((state) => state.dataviews)

export const selectDataviewById = memoize((id: number) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export const selectDataviewsStatus = (state: RootState) => state.dataviews.status

export default dataviewsSlice.reducer
