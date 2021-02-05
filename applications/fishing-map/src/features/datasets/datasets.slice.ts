import { createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit'
import memoize from 'lodash/memoize'
import uniqBy from 'lodash/uniqBy'
import without from 'lodash/without'
import kebabCase from 'lodash/kebabCase'
import { stringify } from 'qs'
import { Dataset, UploadResponse } from '@globalfishingwatch/api-types'
import GFWAPI from '@globalfishingwatch/api-client'
import { asyncInitialState, AsyncReducer, createAsyncSlice } from 'utils/async-slice'
import { RootState } from 'store'

export const DATASETS_USER_SOURCE_ID = 'user'

export const fetchDatasetByIdThunk = createAsyncThunk(
  'datasets/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const dataset = await GFWAPI.fetch<Dataset>(
        `/v1/datasets/${id}?include=endpoints&cache=false`
      )
      return dataset
    } catch (e) {
      return rejectWithValue({ status: e.status || e.code, message: `${id} - ${e.message}` })
    }
  }
)

export const fetchDatasetsByIdsThunk = createAsyncThunk(
  'datasets/fetch',
  async (ids: string[] = [], { rejectWithValue, getState }) => {
    const existingIds = selectIds(getState() as RootState) as string[]
    const uniqIds = ids?.length ? Array.from(new Set([...ids, ...existingIds])) : []
    try {
      const workspacesParams = {
        ...(uniqIds?.length && { ids: uniqIds }),
        include: 'endpoints',
        cache: process.env.NODE_ENV !== 'development',
      }
      const initialDatasets = await GFWAPI.fetch<Dataset[]>(
        `/v1/datasets?${stringify(workspacesParams, { arrayFormat: 'comma' })}`
      )
      const relatedDatasetsIds = initialDatasets.flatMap(
        (dataset) => dataset.relatedDatasets?.flatMap(({ id }) => id || []) || []
      )
      const uniqRelatedDatasetsIds = without(relatedDatasetsIds, ...ids).join(',')
      const relatedWorkspaceParams = { ...workspacesParams, ids: uniqRelatedDatasetsIds }
      const relatedDatasets = await GFWAPI.fetch<Dataset[]>(
        `/v1/datasets?${stringify(relatedWorkspaceParams, { arrayFormat: 'comma' })}`
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

export const fetchAllDatasetsThunk = createAsyncThunk('datasets/all', async (_, { dispatch }) => {
  return dispatch(fetchDatasetsByIdsThunk([]))
})

export type CreateDataset = { dataset: Partial<Dataset>; file: File }
export const createDatasetThunk = createAsyncThunk(
  'datasets/create',
  async ({ dataset, file }: CreateDataset, { rejectWithValue }) => {
    try {
      const { url, path } = await GFWAPI.fetch<UploadResponse>('/v1/upload', {
        method: 'POST',
        body: {
          contentType: dataset.configuration?.format === 'geojson' ? 'application/json' : file.type,
        } as any,
      })
      await fetch(url, { method: 'PUT', body: file })
      const datasetWithFilePath = {
        ...dataset,
        id: `${kebabCase(dataset.name)}-${Date.now()}`,
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
    } catch (e) {
      return rejectWithValue({ status: e.status || e.code, message: e.message })
    }
  }
)

export const updateDatasetThunk = createAsyncThunk(
  'datasets/update',
  async (partialDataset: Partial<Dataset>, { rejectWithValue }) => {
    try {
      const updatedDataset = await GFWAPI.fetch<Dataset>(`/v1/datasets/${partialDataset.id}`, {
        method: 'PATCH',
        body: partialDataset as any,
      })
      return updatedDataset
    } catch (e) {
      return rejectWithValue({ status: e.status || e.code, message: e.message })
    }
  },
  {
    condition: (partialDataset) => {
      if (!partialDataset || !partialDataset.id) {
        console.warn('To update the dataset you need the id')
        return false
      }
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
      return rejectWithValue({ status: e.status || e.code, message: e.message })
    }
  }
)

export type DatasetModals = 'new' | 'edit' | undefined
export interface DatasetsState extends AsyncReducer<Dataset> {
  datasetModal: DatasetModals
  editingDatasetId: string | undefined
  allDatasetsRequested: boolean
}
const initialState: DatasetsState = {
  ...asyncInitialState,
  datasetModal: undefined,
  editingDatasetId: undefined,
  allDatasetsRequested: false,
}

const { slice: datasetSlice, entityAdapter } = createAsyncSlice<DatasetsState, Dataset>({
  name: 'datasets',
  initialState,
  reducers: {
    setDatasetModal: (state, action: PayloadAction<DatasetModals>) => {
      if (state.datasetModal === 'edit' && action.payload === undefined) {
        state.editingDatasetId = undefined
      }
      state.datasetModal = action.payload
    },
    setEditingDatasetId: (state, action: PayloadAction<string>) => {
      state.editingDatasetId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllDatasetsThunk.fulfilled, (state) => {
      state.allDatasetsRequested = true
    })
  },
  thunks: {
    fetchThunk: fetchDatasetsByIdsThunk,
    fetchByIdThunk: fetchDatasetByIdThunk,
    updateThunk: updateDatasetThunk,
    createThunk: createDatasetThunk,
    deleteThunk: deleteDatasetThunk,
  },
})

export const { setDatasetModal, setEditingDatasetId } = datasetSlice.actions

export const {
  selectAll: selectDatasets,
  selectById,
  selectIds,
} = entityAdapter.getSelectors<RootState>((state) => state.datasets)

export const selectDatasetById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export const selectDatasetsStatus = (state: RootState) => state.datasets.status
export const selectDatasetsStatusId = (state: RootState) => state.datasets.statusId
export const selectDatasetsError = (state: RootState) => state.datasets.error
export const selectEditingDatasetId = (state: RootState) => state.datasets.editingDatasetId
export const selectAllDatasetsRequested = (state: RootState) => state.datasets.allDatasetsRequested
export const selectDatasetModal = (state: RootState) => state.datasets.datasetModal

export default datasetSlice.reducer
