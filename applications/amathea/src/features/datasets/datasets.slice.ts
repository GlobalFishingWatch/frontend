import { createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'
import kebabCase from 'lodash/kebabCase'
import GFWAPI, { UploadResponse } from '@globalfishingwatch/api-client'
import { Dataset } from '@globalfishingwatch/dataviews-client'
import { AsyncReducer, createAsyncSlice, asyncInitialState } from 'features/api/api.slice'

export const fetchDatasetsThunk = createAsyncThunk('datasets/fetch', async () => {
  const data = await GFWAPI.fetch<Dataset[]>('/v1/datasets?cache=false')
  return data
})

export const createDatasetThunk = createAsyncThunk(
  'datasets/uploadFile',
  async ({ dataset, file }: { dataset: Partial<Dataset>; file: File }) => {
    const { url, path } = await GFWAPI.fetch<UploadResponse>('/v1/upload', {
      method: 'POST',
      body: { contentType: file.type } as any,
    })
    try {
      await fetch(url, { method: 'PUT', body: file })
      const datasetWithFilePath = {
        ...dataset,
        id: `public-${kebabCase(dataset.name)}`,
        type: 'user-context-layer:v1',
        source: 'gfw',
        configuration: {
          filePath: path,
        },
      }
      const createdDataset = await GFWAPI.fetch<Dataset>('/v1/datasets', {
        method: 'POST',
        body: datasetWithFilePath as any,
      })
      return createdDataset
    } catch (e) {
      console.error(e.message)
    }
  }
)

export const deleteDatasetThunk = createAsyncThunk(
  'datasets/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const workspace = await GFWAPI.fetch<Dataset>(`/v1/datasets/${id}`, {
        method: 'DELETE',
      })
      return { ...workspace, id }
    } catch (e) {
      return rejectWithValue(id)
    }
  }
)

export type DatasetTypes = 'context_areas' | 'track' | '4wings' | undefined
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
    deleteThunk: deleteDatasetThunk,
  },
})

export const { resetDraftDataset, setDraftDatasetStep, setDraftDatasetData } = datasetsSlice.actions

export const {
  selectAll: selectAllDatasets,
  selectById: selectDatasetById,
} = entityAdapter.getSelectors<RootState>((state) => state.datasets)

export const selectDraftDataset = (state: RootState) => state.datasets.draft
export const selectDatasetStatus = (state: RootState) => state.datasets.status

export const selectDraftDatasetStep = createSelector([selectDraftDataset], ({ step }) => step)
export const selectDraftDatasetData = createSelector([selectDraftDataset], ({ data }) => data)

export default datasetsSlice.reducer
