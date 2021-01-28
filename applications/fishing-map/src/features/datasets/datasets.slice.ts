import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import memoize from 'lodash/memoize'
import uniqBy from 'lodash/uniqBy'
import without from 'lodash/without'
import { Dataset } from '@globalfishingwatch/api-types'
import GFWAPI from '@globalfishingwatch/api-client'
import { AsyncReducer, createAsyncSlice } from 'utils/async-slice'
import { RootState } from 'store'

const DATASETS_CACHE = true

export const fetchDatasetByIdThunk = createAsyncThunk(
  'datasets/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const dataset = await GFWAPI.fetch<Dataset>(
        `/v1/datasets/${id}?include=endpoints&cahe=${DATASETS_CACHE}`
      )
      return dataset
    } catch (e) {
      return rejectWithValue({ status: e.status || e.code, message: `${id} - ${e.message}` })
    }
  }
)

export const fetchDatasetsByIdsThunk = createAsyncThunk(
  'datasets/fetch',
  async (ids: string[], { dispatch, rejectWithValue, getState }) => {
    const existingIds = selectIds(getState() as RootState) as string[]
    const uniqIds = Array.from(new Set([...ids, ...existingIds]))
    try {
      const initialDatasets = await GFWAPI.fetch<Dataset[]>(
        `/v1/datasets?ids=${uniqIds.join(',')}&include=endpoints&cache=${DATASETS_CACHE}`
      )
      const relatedDatasetsIds = initialDatasets.flatMap(
        (dataset) => dataset.relatedDatasets?.flatMap(({ id }) => id || []) || []
      )
      const uniqRelatedDatasetsIds = without(relatedDatasetsIds, ...ids).join(',')
      const relatedDatasets = await GFWAPI.fetch<Dataset[]>(
        `/v1/datasets?ids=${uniqRelatedDatasetsIds}&include=endpoints&cache=${DATASETS_CACHE}`
      )
      let datasets = uniqBy([...initialDatasets, ...relatedDatasets], 'id')
      if (process.env.REACT_APP_USE_DATASETS_MOCK === 'true') {
        const mockedDatasets = await import('./datasets.mock')
        datasets = [...datasets, ...mockedDatasets.default]
      }
      return datasets
    } catch (e) {
      return rejectWithValue({ status: e.status || e.code, message: e.message })
    }
  }
)

export type ResourcesState = AsyncReducer<Dataset>

const { slice: datasetSlice, entityAdapter } = createAsyncSlice<ResourcesState, Dataset>({
  name: 'datasets',
  thunks: {
    fetchThunk: fetchDatasetsByIdsThunk,
    fetchByIdThunk: fetchDatasetByIdThunk,
  },
})

export const {
  selectAll: selectDatasets,
  selectById,
  selectIds,
} = entityAdapter.getSelectors<RootState>((state) => state.datasets)

export const selectDatasetById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export const selectDatasetsStatus = (state: RootState) => state.datasets.status

export default datasetSlice.reducer
