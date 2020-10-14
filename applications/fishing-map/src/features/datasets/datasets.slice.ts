import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { RootState } from 'store'
import memoize from 'lodash/memoize'
import { AsyncReducer, createAsyncSlice } from 'utils/async-slice'
import { Dataset } from '@globalfishingwatch/dataviews-client'
import GFWAPI from '@globalfishingwatch/api-client'
import datasets from './datasets.mock'

export const fetchDatasetsByIdsThunk = createAsyncThunk(
  'datasets/fetch',
  async (ids: string[], { rejectWithValue }) => {
    try {
      // const datasets = await GFWAPI.fetch<Dataset[]>(`/v1/datasets/${ids.join(',')}`)
      return datasets
    } catch (e) {
      return rejectWithValue(ids.join(','))
    }
  }
)
export const fetchDatasetsByIdThunk = createAsyncThunk(
  'datasets/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const dataset = await GFWAPI.fetch<Dataset>(`/v1/datasets/${id}`)
      return dataset
    } catch (e) {
      return rejectWithValue(id)
    }
  }
)

export type ResourcesState = AsyncReducer<Dataset>

const { slice: datasetSlice, entityAdapter } = createAsyncSlice<ResourcesState, Dataset>({
  name: 'datasets',
  thunks: {
    fetchThunk: fetchDatasetsByIdsThunk,
    fetchByIdThunk: fetchDatasetsByIdThunk,
  },
})

export const { selectAll: selectDatasets, selectById } = entityAdapter.getSelectors<RootState>(
  (state) => state.datasets
)

export const selectDatasetById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export default datasetSlice.reducer
