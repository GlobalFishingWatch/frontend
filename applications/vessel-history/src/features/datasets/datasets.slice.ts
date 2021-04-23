import { createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit'
import memoize from 'lodash/memoize'
import uniqBy from 'lodash/uniqBy'
import without from 'lodash/without'
import { stringify } from 'qs'
import { Dataset, DatasetCategory } from '@globalfishingwatch/api-types'
import GFWAPI from '@globalfishingwatch/api-client'
import {
  asyncInitialState,
  AsyncReducer,
  createAsyncSlice,
  AsyncError,
  AsyncReducerStatus,
} from 'utils/async-slice'
import { RootState } from 'store'

export const fetchDatasetByIdThunk = createAsyncThunk<
  Dataset,
  string,
  {
    rejectValue: AsyncError
  }
>('datasets/fetchById', async (id: string, { rejectWithValue }) => {
  try {
    const dataset = await GFWAPI.fetch<Dataset>(`/v1/datasets/${id}?include=endpoints&cache=false`)
    return dataset
  } catch (e) {
    return rejectWithValue({
      status: e.status || e.code,
      message: `${id} - ${e.message}`,
    })
  }
})

export const fetchDatasetsByIdsThunk = createAsyncThunk(
  'datasets/fetch',
  async (ids: string[] = [], { signal, rejectWithValue, getState }) => {
    const existingIds = selectIds(getState() as RootState) as string[]
    const uniqIds = ids?.length ? Array.from(new Set([...ids, ...existingIds])) : []
    try {
      const workspacesParams = {
        ...(uniqIds?.length && { ids: uniqIds }),
        include: 'endpoints',
        cache: process.env.NODE_ENV !== 'development',
      }
      const initialDatasets = await GFWAPI.fetch<Dataset[]>(
        `/v1/datasets?${stringify(workspacesParams, { arrayFormat: 'comma' })}`,
        { signal }
      )
      const relatedDatasetsIds = initialDatasets.flatMap(
        (dataset) => dataset.relatedDatasets?.flatMap(({ id }) => id || []) || []
      )
      const uniqRelatedDatasetsIds = without(relatedDatasetsIds, ...ids).join(',')
      const relatedWorkspaceParams = { ...workspacesParams, ids: uniqRelatedDatasetsIds }
      // if no ids are specified, then do not get all the datasets
      const relatedDatasets = relatedWorkspaceParams.ids
        ? await GFWAPI.fetch<Dataset[]>(
            `/v1/datasets?${stringify(relatedWorkspaceParams, { arrayFormat: 'comma' })}`,
            { signal }
          )
        : []
      let datasets = uniqBy([...initialDatasets, ...relatedDatasets], 'id')

      if (
        process.env.NODE_ENV === 'development' ||
        process.env.REACT_APP_USE_DATASETS_MOCK === 'true'
      ) {
        const mockedDatasets = await import('./datasets.mock')
        datasets = uniqBy([...mockedDatasets.default, ...datasets], 'id')
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

const LATEST_CARRIER_DATASET_ID =
  process.env.NODE_ENV === 'development' ? 'carriers:dev' : 'carriers:latest'
export const fetchLastestCarrierDatasetThunk = createAsyncThunk<
  Dataset,
  undefined,
  {
    rejectValue: AsyncError
  }
>('datasets/fetchLatestCarrier', async (_, { rejectWithValue }) => {
  try {
    const dataset = await GFWAPI.fetch<Dataset>(`/datasets/${LATEST_CARRIER_DATASET_ID}`)
    return dataset
  } catch (e) {
    return rejectWithValue({
      status: e.status || e.code,
      message: `${LATEST_CARRIER_DATASET_ID} - ${e.message}`,
    })
  }
})

export interface DatasetsState extends AsyncReducer<Dataset> {
  datasetCategory: DatasetCategory
  editingDatasetId: string | undefined
  allDatasetsRequested: boolean
  carrierLatest: {
    status: AsyncReducerStatus
    dataset: Dataset | undefined
  }
}
const initialState: DatasetsState = {
  ...asyncInitialState,
  datasetCategory: DatasetCategory.Context,
  allDatasetsRequested: false,
  editingDatasetId: undefined,
  carrierLatest: {
    status: AsyncReducerStatus.Idle,
    dataset: undefined,
  },
}

const { slice: datasetSlice, entityAdapter } = createAsyncSlice<DatasetsState, Dataset>({
  name: 'datasets',
  initialState,
  reducers: {
    setDatasetCategory: (state, action: PayloadAction<DatasetCategory>) => {
      state.datasetCategory = action.payload
    },
    setEditingDatasetId: (state, action: PayloadAction<string>) => {
      state.editingDatasetId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllDatasetsThunk.fulfilled, (state) => {
      state.allDatasetsRequested = true
    })
    builder.addCase(fetchLastestCarrierDatasetThunk.pending, (state) => {
      state.carrierLatest.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchLastestCarrierDatasetThunk.fulfilled, (state, action) => {
      state.carrierLatest.status = AsyncReducerStatus.Finished
      if (action.payload) {
        state.carrierLatest.dataset = action.payload
      }
    })
    builder.addCase(fetchLastestCarrierDatasetThunk.rejected, (state) => {
      state.carrierLatest.status = AsyncReducerStatus.Error
    })
  },
  thunks: {
    fetchThunk: fetchDatasetsByIdsThunk,
    fetchByIdThunk: fetchDatasetByIdThunk,
  },
})

export const { setDatasetModal, setDatasetCategory, setEditingDatasetId } = datasetSlice.actions

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
export const selectCarrierLatestDataset = (state: RootState) => state.datasets.carrierLatest.dataset
export const selectCarrierLatestDatasetStatus = (state: RootState) =>
  state.datasets.carrierLatest.status
export const selectDatasetCategory = (state: RootState) => state.datasets.datasetCategory

export default datasetSlice.reducer
