import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import memoize from 'lodash/memoize'
import { Dataview, DataviewCategory } from '@globalfishingwatch/api-types'
import GFWAPI from '@globalfishingwatch/api-client'
import { AsyncReducer, createAsyncSlice } from 'utils/async-slice'
import { RootState } from 'store'
import { DEFAULT_ENVIRONMENT_DATAVIEW_ID } from 'data/workspaces'

export const fetchDataviewByIdThunk = createAsyncThunk(
  'dataviews/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const dataview = await GFWAPI.fetch<Dataview>(`/v1/dataviews/${id}`)
      return dataview
    } catch (e) {
      return rejectWithValue({ status: e.status || e.code, message: `${id} - ${e.message}` })
    }
  }
)

export const fetchDataviewsByIdsThunk = createAsyncThunk(
  'dataviews/fetch',
  async (ids: number[], { rejectWithValue, getState }) => {
    const existingIds = selectIds(getState() as RootState) as string[]
    const uniqIds = Array.from(new Set([...ids, ...existingIds]))
    try {
      let dataviews = await GFWAPI.fetch<Dataview[]>(`/v1/dataviews?ids=${uniqIds.join(',')}`)
      if (process.env.REACT_APP_USE_LOCAL_DATAVIEWS === 'true') {
        const mockedDataviews = await import('./dataviews.mock')
        dataviews = [...dataviews, ...mockedDataviews.default]
      }
      // TODO: remove workaround once the API supports dataview category
      return dataviews.map((d) => {
        if (d.id === 79 || d.id === 80 || d.id === 84 || d.id === DEFAULT_ENVIRONMENT_DATAVIEW_ID) {
          return { ...d, category: DataviewCategory.Environment }
        }
        return d
      })
    } catch (e) {
      return rejectWithValue({ status: e.status || e.code, message: e.message })
    }
  }
)
export type ResourcesState = AsyncReducer<Dataview>

const { slice: dataviewsSlice, entityAdapter } = createAsyncSlice<ResourcesState, Dataview>({
  name: 'dataview',
  thunks: {
    fetchThunk: fetchDataviewsByIdsThunk,
    fetchByIdThunk: fetchDataviewByIdThunk,
  },
})

export const {
  selectAll: selectDataviews,
  selectById,
  selectIds,
} = entityAdapter.getSelectors<RootState>((state) => state.dataviews)

export const selectDataviewById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export const selectDataviewsStatus = (state: RootState) => state.dataviews.status

export default dataviewsSlice.reducer
