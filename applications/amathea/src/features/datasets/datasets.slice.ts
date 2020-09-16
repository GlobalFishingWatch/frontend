import { createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'
import kebabCase from 'lodash/kebabCase'
import memoize from 'lodash/memoize'
import GFWAPI, { UploadResponse } from '@globalfishingwatch/api-client'
import { Dataset } from '@globalfishingwatch/dataviews-client'
import { AsyncReducer, createAsyncSlice, asyncInitialState } from 'features/api/api.slice'
import { DATASET_SOURCE_IDS } from 'data/data'

export const fetchDatasetsThunk = createAsyncThunk('datasets/fetch', async () => {
  const data = await GFWAPI.fetch<Dataset[]>('/v1/datasets?include=endpoints&cache=false')
  return data
})

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
      source: DATASET_SOURCE_IDS.user,
      configuration: {
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

export const updateDatasetThunk = createAsyncThunk(
  'datasets/update',
  async (partialDataset: Partial<Dataset>) => {
    const updatedDataset = await GFWAPI.fetch<Dataset>(`/v1/datasets/${partialDataset.id}`, {
      method: 'PATCH',
      body: partialDataset as any,
    })
    return updatedDataset
  },
  {
    condition: (partialDataset) => {
      if (!partialDataset || !partialDataset.id) return false
    },
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

export type DatasetTypes = 'user-context-layer:v1' | 'user-tracks:v1' | '4wings:v1' | undefined
export type DatasetDraftSteps = 'info' | 'data' | 'parameters'
export type DatasetDraftData = Partial<Dataset> & { type?: DatasetTypes }

export type DatasetDraft = {
  step: DatasetDraftSteps
  data: DatasetDraftData
}

export interface DatasetsState extends AsyncReducer<Dataset> {
  draft: DatasetDraft
}

const draftInitialState: DatasetDraft = { step: 'info', data: {} }
const initialState: DatasetsState = {
  ...asyncInitialState,
  draft: draftInitialState,
}

const { slice: datasetsSlice, entityAdapter } = createAsyncSlice<DatasetsState, Dataset>({
  name: 'datasets',
  initialState,
  reducers: {
    resetDraftDataset: (state) => {
      state.draft = draftInitialState
    },
    setDraftDatasetStep: (state, action: PayloadAction<DatasetDraftSteps>) => {
      state.draft.step = action.payload
    },
    setDraftDatasetData: (state, action: PayloadAction<DatasetDraftData>) => {
      state.draft.data = { ...state.draft.data, ...action.payload }
    },
  },
  thunks: {
    fetchThunk: fetchDatasetsThunk,
    createThunk: createDatasetThunk,
    updateThunk: updateDatasetThunk,
    deleteThunk: deleteDatasetThunk,
  },
})

export const { resetDraftDataset, setDraftDatasetStep, setDraftDatasetData } = datasetsSlice.actions

export const { selectAll: selectAllDatasets, selectById } = entityAdapter.getSelectors<RootState>(
  (state) => state.datasets
)

export const selectDatasetById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export const selectDraftDataset = (state: RootState) => state.datasets.draft
export const selectDatasetStatus = (state: RootState) => state.datasets.status
export const selectDatasetStatusId = (state: RootState) => state.datasets.statusId
export const selectDraftDatasetStep = createSelector([selectDraftDataset], ({ step }) => step)
export const selectDraftDatasetData = createSelector([selectDraftDataset], ({ data }) => data)

export default datasetsSlice.reducer
