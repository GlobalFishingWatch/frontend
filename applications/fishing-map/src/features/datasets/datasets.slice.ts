import { createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit'
import memoize from 'lodash/memoize'
import uniqBy from 'lodash/uniqBy'
import without from 'lodash/without'
import kebabCase from 'lodash/kebabCase'
import { Dataset, UploadResponse } from '@globalfishingwatch/api-types'
import GFWAPI from '@globalfishingwatch/api-client'
import { asyncInitialState, AsyncReducer, createAsyncSlice } from 'utils/async-slice'
import { RootState } from 'store'

export const DATASETS_USER_SOURCE_ID = 'user'
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
export type CreateDataset = { dataset: Partial<Dataset>; file: File }
export const createDatasetThunk = createAsyncThunk(
  'datasets/create',
  async ({ dataset, file }: CreateDataset) => {
    const { url, path } = await GFWAPI.fetch<UploadResponse>('/v1/upload', {
      method: 'POST',
      body: { contentType: file.type } as any,
    })
    await fetch(url, { method: 'PUT', body: file })
    const datasetWithFilePath = {
      ...dataset,
      id: kebabCase(dataset.name),
      source: DATASETS_USER_SOURCE_ID,
      configuration: {
        ...dataset.configuration,
        filePath: path,
      },
    }
    const createdDataset = await GFWAPI.fetch<Dataset>('/v1/datasets', {
      method: 'POST',
      body: datasetWithFilePath as any,
    })
    return createdDataset
  }
)

export const deleteDatasetThunk = createAsyncThunk(
  'datasets/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const dataset = await GFWAPI.fetch<Dataset>(`/v1/datasets/${id}`, {
        method: 'DELETE',
      })
      return { ...dataset, id }
    } catch (e) {
      return rejectWithValue(id)
    }
  }
)

export interface DatasetsState extends AsyncReducer<Dataset> {
  newDatasetModal: boolean
}
const initialState: DatasetsState = {
  ...asyncInitialState,
  newDatasetModal: false,
}

const { slice: datasetSlice, entityAdapter } = createAsyncSlice<DatasetsState, Dataset>({
  name: 'datasets',
  initialState,
  reducers: {
    setNewDatasetModal: (state, action: PayloadAction<boolean>) => {
      state.newDatasetModal = action.payload
    },
  },
  thunks: {
    fetchThunk: fetchDatasetsByIdsThunk,
    fetchByIdThunk: fetchDatasetByIdThunk,
    createThunk: createDatasetThunk,
    deleteThunk: deleteDatasetThunk,
  },
})

export const { resetNewDataset, setNewDatasetData, setNewDatasetModal } = datasetSlice.actions

export const {
  selectAll: selectDatasets,
  selectById,
  selectIds,
} = entityAdapter.getSelectors<RootState>((state) => state.datasets)

export const selectDatasetById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export const selectDatasetsStatus = (state: RootState) => state.datasets.status
export const selectNewDatasetModal = (state: RootState) => state.datasets.newDatasetModal

export default datasetSlice.reducer
