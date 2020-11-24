import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import memoize from 'lodash/memoize'
import uniqBy from 'lodash/uniqBy'
import uniq from 'lodash/uniq'
import { Dataset } from '@globalfishingwatch/api-types'
import GFWAPI from '@globalfishingwatch/api-client'
import { AsyncReducer, createAsyncSlice } from 'utils/async-slice'
import { RootState } from 'store'

const DATASETS_CACHE = true

export const fetchDatasetsByIdsThunk = createAsyncThunk(
  'datasets/fetch',
  async (ids: string[], { rejectWithValue }) => {
    // TODO fetch only not already existing ids
    try {
      const initialDatasets = await GFWAPI.fetch<Dataset[]>(
        `/v1/datasets?ids=${ids.join(',')}&include=endpoints&cache=${DATASETS_CACHE}`
      )

      const relatedDatasetsIds = initialDatasets.flatMap(
        (dataset) => dataset.relatedDatasets?.flatMap(({ id }) => id || []) || []
      )
      const uniqRelatedDatasetsIds = uniq([...relatedDatasetsIds, ids]).join(',')
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
      return rejectWithValue(ids.join(','))
    }
  }
)

export const fetchDatasetsByIdThunk = createAsyncThunk(
  'datasets/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const dataset = await GFWAPI.fetch<Dataset>(
        `/v1/datasets/${id}?include=endpoints&cahe=${DATASETS_CACHE}`
      )
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
