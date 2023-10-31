import { createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { memoize, uniqBy, without, kebabCase, uniq } from 'lodash'
import { stringify } from 'qs'
import {
  AnyDatasetConfiguration,
  APIPagination,
  Dataset,
  DatasetCategory,
  EndpointId,
  EndpointParam,
  UploadResponse,
} from '@globalfishingwatch/api-types'
import {
  GFWAPI,
  parseAPIError,
  parseAPIErrorMessage,
  parseAPIErrorStatus,
} from '@globalfishingwatch/api-client'
import {
  asyncInitialState,
  AsyncReducer,
  createAsyncSlice,
  AsyncError,
  AsyncReducerStatus,
} from 'utils/async-slice'
import {
  CARRIER_PORTAL_API_URL,
  DEFAULT_PAGINATION_PARAMS,
  IS_DEVELOPMENT_ENV,
  LATEST_CARRIER_DATASET_ID,
  PUBLIC_SUFIX,
} from 'data/config'
import { debugRelatedDatasets } from 'features/datasets/datasets.debug'

export const DATASETS_USER_SOURCE_ID = 'user'

type POCDatasetTemplate = Record<
  string,
  Partial<Record<EndpointId, { pathTemplate?: string; query?: Partial<EndpointParam>[] }>>
>
const POC_DATASETS_ENDPOINT_PATH_TEMPLATES: POCDatasetTemplate = {
  // [DEFAULT_VESSEL_IDENTITY_ID]: {
  //   [EndpointId.Vessel]: {
  //     // pathTemplate:
  //     //   'https://gateway.api.staging.globalfishingwatch.org/prototypes/vessels/{{vesselId}}',
  //     query: [{ id: 'datasets', array: true }],
  //   },
  // },
}

const parsePOCsDatasets = (dataset: Dataset) => {
  if (Object.keys(POC_DATASETS_ENDPOINT_PATH_TEMPLATES).some((id) => dataset.id === id)) {
    const pocDataset = {
      ...dataset,
      endpoints: dataset.endpoints?.map((endpoint) => {
        const endpointConfig = POC_DATASETS_ENDPOINT_PATH_TEMPLATES[dataset.id]?.[endpoint.id]
        if (endpointConfig) {
          return {
            ...endpoint,
            ...endpointConfig,
            query: endpoint.query.map((q) => {
              const queryConfig = endpointConfig.query?.find((qc) => qc.id === q.id)
              if (queryConfig) {
                return {
                  ...q,
                  ...queryConfig,
                }
              }
              return q
            }),
          }
        }
        return endpoint
      }),
    }
    return pocDataset
  }
  return dataset
}

export const fetchDatasetByIdThunk = createAsyncThunk<
  Dataset,
  string,
  {
    rejectValue: AsyncError
  }
>('datasets/fetchById', async (id: string, { rejectWithValue }) => {
  try {
    const dataset = await GFWAPI.fetch<Dataset>(`/datasets/${id}?include=endpoints&cache=false`)
    return parsePOCsDatasets(dataset)
  } catch (e: any) {
    console.warn(e)
    return rejectWithValue({
      status: parseAPIErrorStatus(e),
      message: `${id} - ${parseAPIErrorMessage(e)}`,
    })
  }
})

type FetchDatasetsFromApiParams = {
  ids: string[]
  existingIds: string[]
  signal: AbortSignal
  maxDepth?: number
  onlyUserDatasets?: boolean
}
const fetchDatasetsFromApi = async (
  {
    ids,
    existingIds,
    signal,
    maxDepth = 5,
    onlyUserDatasets = true,
  } = {} as FetchDatasetsFromApiParams
) => {
  const uniqIds = ids?.length ? ids.filter((id) => !existingIds.includes(id)) : []
  const datasetsParams = {
    ...(uniqIds?.length ? { ids: uniqIds } : { 'logged-user': onlyUserDatasets }),
    include: 'endpoints',
    cache: false,
    ...DEFAULT_PAGINATION_PARAMS,
  }
  const initialDatasets = await GFWAPI.fetch<APIPagination<Dataset>>(
    `/datasets?${stringify(datasetsParams, { arrayFormat: 'comma' })}`,
    { signal }
  )

  const mockedDatasets =
    IS_DEVELOPMENT_ENV || process.env.NEXT_PUBLIC_USE_LOCAL_DATASETS === 'true'
      ? await import('./datasets.mock')
      : { default: [] }
  let datasets = uniqBy([...mockedDatasets.default, ...initialDatasets.entries], 'id')

  const relatedDatasetsIds = uniq(
    datasets.flatMap((dataset) => dataset.relatedDatasets?.flatMap(({ id }) => id || []) || [])
  )
  debugRelatedDatasets(datasets, relatedDatasetsIds)
  const currentIds = uniq([...existingIds, ...datasets.map((d) => d.id)])
  const uniqRelatedDatasetsIds = without(relatedDatasetsIds, ...currentIds)
  if (uniqRelatedDatasetsIds.length > 1 && maxDepth > 0) {
    const relatedDatasets = await fetchDatasetsFromApi({
      ids: uniqRelatedDatasetsIds,
      existingIds: currentIds,
      signal,
      maxDepth: maxDepth - 1,
    })
    datasets = uniqBy([...datasets, ...relatedDatasets], 'id')
  }

  return datasets
}

export const fetchDatasetsByIdsThunk = createAsyncThunk<
  Dataset[],
  { ids: string[]; onlyUserDatasets?: boolean },
  {
    rejectValue: AsyncError
  }
>(
  'datasets/fetch',
  async ({ ids, onlyUserDatasets = true }, { signal, rejectWithValue, getState }) => {
    const state = getState() as DatasetsSliceState
    const existingIds = selectIds(state) as string[]

    try {
      const datasets = await fetchDatasetsFromApi({ ids, existingIds, signal, onlyUserDatasets })
      return datasets.map(parsePOCsDatasets)
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue(parseAPIError(e))
    }
  }
)

export const fetchAllDatasetsThunk = createAsyncThunk<
  any,
  { onlyUserDatasets?: boolean } | undefined,
  {
    rejectValue: AsyncError
  }
>('datasets/all', ({ onlyUserDatasets } = {}, { dispatch }) => {
  return dispatch(fetchDatasetsByIdsThunk({ ids: [], onlyUserDatasets }))
})

export type CreateDataset = { dataset: Partial<Dataset>; file: File; createAsPublic: boolean }
export const createDatasetThunk = createAsyncThunk<
  Dataset,
  CreateDataset,
  {
    rejectValue: AsyncError
  }
>('datasets/create', async ({ dataset, file, createAsPublic }, { rejectWithValue }) => {
  try {
    const { url, path } = await GFWAPI.fetch<UploadResponse>(`/uploads`, {
      method: 'POST',
      body: {
        contentType: dataset.configuration?.format === 'geojson' ? 'application/json' : file.type,
      } as any,
    })
    await fetch(url, { method: 'PUT', body: file })

    // API needs to have the value in lowercase
    const propertyToInclude = (dataset.configuration?.propertyToInclude as string)?.toLowerCase()
    const id = `${kebabCase(dataset.name)}-${Date.now()}`
    const datasetWithFilePath = {
      ...dataset,
      description: dataset.description || dataset.name,
      id: createAsPublic ? `${PUBLIC_SUFIX}-${id}` : id,
      source: DATASETS_USER_SOURCE_ID,
      configuration: {
        ...dataset.configuration,
        ...(propertyToInclude && { propertyToInclude }),
        filePath: path,
      },
    }

    delete (datasetWithFilePath as any).public

    const createdDataset = await GFWAPI.fetch<Dataset>(`/datasets`, {
      method: 'POST',
      body: datasetWithFilePath as any,
    })

    return createdDataset
  } catch (e: any) {
    console.warn(e)
    return rejectWithValue(parseAPIError(e))
  }
})

export const updateDatasetThunk = createAsyncThunk<
  Dataset,
  Partial<Dataset>,
  {
    rejectValue: AsyncError
  }
>(
  'datasets/update',
  async (partialDataset, { rejectWithValue }) => {
    try {
      const { id, configuration, ...rest } = partialDataset
      const { tableName, ...restConfiguration } = configuration as AnyDatasetConfiguration
      const updatedDataset = await GFWAPI.fetch<Dataset>(`/datasets/${id}`, {
        method: 'PATCH',
        body: { ...rest, configuration: restConfiguration } as any,
      })
      return updatedDataset
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue(parseAPIError(e))
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

export const deleteDatasetThunk = createAsyncThunk<
  Dataset,
  string,
  {
    rejectValue: AsyncError
  }
>('datasets/delete', async (id: string, { rejectWithValue }) => {
  try {
    const dataset = await GFWAPI.fetch<Dataset>(`/datasets/${id}`, {
      method: 'DELETE',
    })
    return { ...dataset, id }
  } catch (e: any) {
    console.warn(e)
    return rejectWithValue(parseAPIError(e))
  }
})

export const fetchLastestCarrierDatasetThunk = createAsyncThunk<
  Dataset,
  undefined,
  {
    rejectValue: AsyncError
  }
>('datasets/fetchLatestCarrier', async (_, { rejectWithValue }) => {
  try {
    const dataset = await GFWAPI.fetch<Dataset>(
      `${CARRIER_PORTAL_API_URL}/datasets/${LATEST_CARRIER_DATASET_ID}`,
      {
        version: '',
      }
    )
    return dataset
  } catch (e: any) {
    console.warn(e)
    return rejectWithValue({
      status: parseAPIErrorStatus(e),
      message: `${LATEST_CARRIER_DATASET_ID} - ${parseAPIErrorMessage(e)}`,
    })
  }
})

export type DatasetModals = 'new' | 'edit' | undefined
export interface DatasetsState extends AsyncReducer<Dataset> {
  datasetModal: DatasetModals
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
  datasetModal: undefined,
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
    setDatasetModal: (state, action: PayloadAction<DatasetModals>) => {
      if (state.datasetModal === 'edit' && action.payload === undefined) {
        state.editingDatasetId = undefined
      }
      state.datasetModal = action.payload
    },
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
    updateThunk: updateDatasetThunk,
    createThunk: createDatasetThunk,
    deleteThunk: deleteDatasetThunk,
  },
})

export const { setDatasetModal, setDatasetCategory, setEditingDatasetId } = datasetSlice.actions

export type DatasetsSliceState = { datasets: DatasetsState }
export const { selectAll, selectById, selectIds } = entityAdapter.getSelectors<DatasetsSliceState>(
  (state) => state.datasets
)

export function selectAllDatasets(state: DatasetsSliceState) {
  return selectAll(state)
}

export const selectDatasetById = memoize((id: string) =>
  createSelector([(state: DatasetsSliceState) => state], (state) => selectById(state, id))
)

export const selectDatasetsStatus = (state: DatasetsSliceState) => state.datasets.status
export const selectDatasetsStatusId = (state: DatasetsSliceState) => state.datasets.statusId
export const selectDatasetsError = (state: DatasetsSliceState) => state.datasets.error
export const selectEditingDatasetId = (state: DatasetsSliceState) => state.datasets.editingDatasetId
export const selectAllDatasetsRequested = (state: DatasetsSliceState) =>
  state.datasets.allDatasetsRequested
export const selectDatasetModal = (state: DatasetsSliceState) => state.datasets.datasetModal
export const selectCarrierLatestDataset = (state: DatasetsSliceState) =>
  state.datasets.carrierLatest.dataset
export const selectCarrierLatestDatasetStatus = (state: DatasetsSliceState) =>
  state.datasets.carrierLatest.status
export const selectDatasetCategory = (state: DatasetsSliceState) => state.datasets.datasetCategory

export default datasetSlice.reducer
