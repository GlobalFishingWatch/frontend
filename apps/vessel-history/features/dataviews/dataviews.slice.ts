import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { memoize, uniqBy } from 'lodash'
import { APIPagination, Dataview } from '@globalfishingwatch/api-types'
import { GFWAPI, parseAPIError } from '@globalfishingwatch/api-client'
import { AsyncReducer, AsyncReducerStatus, createAsyncSlice } from 'utils/async-slice'
import { RootState } from 'store'
import { API_VERSION } from 'data/config'

export const fetchDataviewsByIdsThunk = createAsyncThunk(
  'dataviews/fetch',
  async (ids: number[], { signal, rejectWithValue, getState }) => {
    const existingIds = selectIds(getState() as RootState) as string[]
    const uniqIds = Array.from(new Set([...ids, ...existingIds]))
    try {
      const dataviews = await GFWAPI.fetch<APIPagination<Dataview>>(
        `/${API_VERSION}/dataviews?ids=${uniqIds.join(',')}`,
        {
          signal,
        }
      ).then((d) => d.entries)
      if (
        process.env.NODE_ENV === 'development' ||
        process.env.NEXT_PUBLIC_USE_LOCAL_DATAVIEWS === 'true'
      ) {
        const mockedDataviews = await import('./dataviews.mock')
        return uniqBy([...mockedDataviews.default, ...dataviews], 'id')
      }
      return dataviews
    } catch (e: any) {
      return rejectWithValue(parseAPIError(e))
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

export const { selectAll, selectById, selectIds } = entityAdapter.getSelectors<RootState>(
  (state) => state.dataviews
)

export const selectDataviewById = memoize((id: number) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export function selectAllDataviews(state: RootState) {
  return selectAll(state)
}

export const selectDataviewsStatus = (state: RootState) => state.dataviews.status

export default dataviewsSlice.reducer
