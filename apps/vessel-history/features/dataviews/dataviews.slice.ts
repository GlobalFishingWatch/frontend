import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { GFWApiClient } from 'http-client/http-client'
import { memoize, uniqBy } from 'lodash'
import { stringify } from 'qs'
import type { RootState } from 'store'

import { parseAPIError } from '@globalfishingwatch/api-client'
import type { APIPagination, Dataview } from '@globalfishingwatch/api-types'

import { DEFAULT_PAGINATION_PARAMS } from 'data/config'
import type { AsyncReducer} from 'utils/async-slice';
import { AsyncReducerStatus, createAsyncSlice } from 'utils/async-slice'

export const fetchDataviewsByIdsThunk = createAsyncThunk(
  'dataviews/fetch',
  async (ids: (Dataview['id'] | Dataview['slug'])[], { signal, rejectWithValue, getState }) => {
    const existingIds = selectIds(getState() as RootState) as any[]
    const uniqIds = Array.from(new Set([...(ids as string[]), ...existingIds]))
    try {
      const dataviewsParams = {
        ids: uniqIds,
        cache: false,
        ...DEFAULT_PAGINATION_PARAMS,
      }
      const dataviews = await GFWApiClient.fetch<APIPagination<Dataview>>(
        `/dataviews?${stringify(dataviewsParams, { arrayFormat: 'comma' })}`,
        {
          signal,
        }
      ).then((response) => response.entries)
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
    condition: (ids: Dataview['slug'][], { getState }) => {
      const { dataviews } = getState() as RootState
      const fetchStatus = dataviews.status
      const slugs = Object.entries(dataviews.entities).map(([_, dataview]) => dataview?.slug)
      const allRecordsLoaded = (ids as string[]).every(
        (id) => dataviews.ids.includes(id) || slugs.includes(id)
      )
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
