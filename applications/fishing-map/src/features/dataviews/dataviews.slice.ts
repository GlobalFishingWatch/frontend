import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { RootState } from 'store'
import memoize from 'lodash/memoize'
import { AsyncReducer, createAsyncSlice } from 'utils/async-slice'
import { Dataview } from '@globalfishingwatch/api-types'
import GFWAPI from '@globalfishingwatch/api-client'
import dataviews from './dataviews.mock'

export const fetchDataviewsByIdsThunk = createAsyncThunk(
  'dataviews/fetch',
  async (ids: number[], { rejectWithValue }) => {
    try {
      // const dataviews = await GFWAPI.fetch<Dataview[]>(`/v1/dataviews/${ids.join(',')}`)
      return dataviews
    } catch (e) {
      return rejectWithValue(ids.join(','))
    }
  }
)
export const fetchDataviewByIdThunk = createAsyncThunk(
  'dataviews/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const dataview = await GFWAPI.fetch<Dataview>(`/v1/dataviews/${id}`)
      return dataview
    } catch (e) {
      return rejectWithValue(id)
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

export const { selectAll: selectDataviews, selectById } = entityAdapter.getSelectors<RootState>(
  (state) => state.dataviews
)

export const selectDataviewById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export default dataviewsSlice.reducer
