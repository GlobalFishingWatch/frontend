import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import memoize from 'lodash/memoize'
import { Dataset } from '@globalfishingwatch/api-types'
import GFWAPI from '@globalfishingwatch/api-client'
import { AsyncReducer, createAsyncSlice } from 'utils/async-slice'
import { RootState } from 'store'

export const fetchDatasetsByIdsThunk = createAsyncThunk(
  'datasets/fetch',
  async (ids: string[], { rejectWithValue }) => {
    // TODO fetch only not already existing ids
    try {
      let datasets = await GFWAPI.fetch<Dataset[]>(
        `/v1/datasets?ids=${ids.join(',')}&include=endpoints&cache=false`
      )
      if (process.env.REACT_APP_USE_DATASETS_MOCK === 'true') {
        const mockedDatasets = await import('./datasets.mock')
        datasets = [...datasets, ...mockedDatasets.default]
      }
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
      const dataset = await GFWAPI.fetch<Dataset>(`/v1/datasets/${id}?include=endpoints`)
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
