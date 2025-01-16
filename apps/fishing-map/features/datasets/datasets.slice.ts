import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { uniq,uniqBy, without } from 'es-toolkit'
import kebabCase from 'lodash/kebabCase'
import memoize from 'lodash/memoize'
import { stringify } from 'qs'

import {
  GFWAPI,
  parseAPIError,
  parseAPIErrorMessage,
  parseAPIErrorStatus,
} from '@globalfishingwatch/api-client'
import type {
  AnyDatasetConfiguration,
  APIPagination,
  Dataset,
  DatasetsMigration,
  EndpointId,
  EndpointParam,
  UploadResponse,
} from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'

import {
  CARRIER_PORTAL_API_URL,
  DEFAULT_PAGINATION_PARAMS,
  IS_DEVELOPMENT_ENV,
  LATEST_CARRIER_DATASET_ID,
  PUBLIC_SUFIX,
} from 'data/config'
import type { AsyncError,AsyncReducer } from 'utils/async-slice'
import { asyncInitialState, AsyncReducerStatus,createAsyncSlice } from 'utils/async-slice'

export const DATASETS_USER_SOURCE_ID = 'user'
export const DEPRECATED_DATASETS_HEADER = 'X-Deprecated-Dataset'

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

export const getDatasetByIdsThunk = createAsyncThunk(
  'datasets/getByIds',
  async (
    { ids, includeRelated = true }: { ids: string[]; includeRelated?: boolean },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const state = getState() as any
      const datasetsToRequest: string[] = []
      let datasets = ids.flatMap((datasetId) => {
        const dataset = selectDatasetById(datasetId)(state)
        if (!dataset) {
          datasetsToRequest.push(datasetId)
        }
        return (dataset as Dataset) || []
      })

      if (datasetsToRequest.length) {
        const action = await dispatch(
          fetchDatasetsByIdsThunk({ ids: datasetsToRequest, includeRelated })
        )
        if (fetchDatasetsByIdsThunk.fulfilled.match(action) && action.payload?.length) {
          datasets = datasets.concat(
            action.payload.filter((v) => v.type === DatasetTypes.Vessels) as Dataset[]
          )
        }
      }
      return datasets
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue({
        status: parseAPIErrorStatus(e),
        message: `${id} - ${parseAPIErrorMessage(e)}`,
      })
    }
  }
)

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
  includeRelated?: boolean
}
const fetchDatasetsFromApi = async (
  {
    ids,
    existingIds,
    signal,
    maxDepth = 5,
    onlyUserDatasets = true,
    includeRelated = true,
  } = {} as FetchDatasetsFromApiParams
) => {
  const uniqIds = ids?.length ? ids.filter((id) => !existingIds.includes(id)) : []
  const datasetsParams = {
    ...(uniqIds?.length ? { ids: uniqIds } : { 'logged-user': onlyUserDatasets }),
    include: 'endpoints',
    cache: false,
    ...DEFAULT_PAGINATION_PARAMS,
  }
  const initialDatasetsResponse = await GFWAPI.fetch<Response>(
    `/datasets?${stringify(datasetsParams, { arrayFormat: 'comma' })}`,
    { signal, responseType: 'default' }
  )

  const initialDatasets = (await initialDatasetsResponse.json()) as APIPagination<Dataset>
  let datasetsDeprecatedDict = {}
  const deprecatedDatasetsHeader = initialDatasetsResponse.headers.get(DEPRECATED_DATASETS_HEADER)
  if (deprecatedDatasetsHeader) {
    datasetsDeprecatedDict = deprecatedDatasetsHeader.split(',').reduce((acc, id) => {
      const [newId, oldId] = id.split('=')
      acc[newId] = oldId
      return acc
    }, {} as DatasetsMigration)
  }

  const mockedDatasets =
    IS_DEVELOPMENT_ENV || process.env.NEXT_PUBLIC_USE_LOCAL_DATASETS === 'true'
      ? await import('./datasets.mock')
      : { default: [] }
  let datasets = uniqBy([...mockedDatasets.default, ...initialDatasets.entries], (d) => d.id)

  const relatedDatasetsIds = includeRelated
    ? uniq(
        datasets.flatMap((dataset) => dataset.relatedDatasets?.flatMap(({ id }) => id || []) || [])
      )
    : []
  const currentIds = uniq([...existingIds, ...datasets.map((d) => d.id)])
  const uniqRelatedDatasetsIds = without(relatedDatasetsIds, ...currentIds)
  if (uniqRelatedDatasetsIds.length > 1 && maxDepth > 0) {
    const { datasetsDeprecated, datasets: relatedDatasets } = await fetchDatasetsFromApi({
      ids: uniqRelatedDatasetsIds,
      existingIds: currentIds,
      signal,
      maxDepth: maxDepth - 1,
    })
    datasets = uniqBy([...datasets, ...relatedDatasets], (d) => d.id)
    datasetsDeprecatedDict = { ...datasetsDeprecatedDict, ...datasetsDeprecated }
  }

  return { datasetsDeprecated: datasetsDeprecatedDict, datasets }
}

export const fetchDatasetsByIdsThunk = createAsyncThunk<
  Dataset[],
  { ids: string[]; onlyUserDatasets?: boolean; includeRelated?: boolean },
  {
    rejectValue: AsyncError
  }
>(
  'datasets/fetch',
  async (
    { ids, onlyUserDatasets = true, includeRelated = true },
    { signal, rejectWithValue, getState, dispatch }
  ) => {
    const state = getState() as DatasetsSliceState
    const existingIds = selectIds(state) as string[]

    try {
      const { datasetsDeprecated, datasets } = await fetchDatasetsFromApi({
        ids,
        existingIds,
        signal,
        onlyUserDatasets,
        includeRelated,
      })
      if (Object.keys(datasetsDeprecated).length) {
        dispatch(setDeprecatedDatasets(datasetsDeprecated))
      }
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

export type UpsertDataset = { dataset: Partial<Dataset>; file?: File; createAsPublic?: boolean }
export const upsertDatasetThunk = createAsyncThunk<
  Dataset,
  UpsertDataset,
  {
    rejectValue: AsyncError
  }
>('datasets/create', async ({ dataset, file, createAsPublic }, { rejectWithValue }) => {
  try {
    let filePath
    if (file) {
      const { url, path } = await GFWAPI.fetch<UploadResponse>(`/uploads`, {
        method: 'POST',
        body: {
          contentType: dataset.configuration?.format === 'geojson' ? 'application/json' : file.type,
        } as any,
      })
      filePath = path
      await fetch(url, { method: 'PUT', body: file })
    }

    // Properties that are to be used as SQL params on the server
    // need to be lowercase
    const propertyToInclude = (dataset.configuration?.propertyToInclude as string)?.toLowerCase()
    const generatedId = dataset.id || `${kebabCase(dataset.name)}-${Date.now()}`
    const id = createAsPublic ? `${PUBLIC_SUFIX}-${generatedId}` : generatedId
    const { id: originalId, ...rest } = dataset
    const isPatchDataset = originalId !== undefined

    const datasetWithFilePath = {
      ...rest,
      description: dataset.description || dataset.name,
      source: dataset.source || DATASETS_USER_SOURCE_ID,
      // Needed to start polling the dataset in useAutoRefreshImportingDataset
      ...(isPatchDataset && file && { status: 'importing' }),
      configuration: {
        ...dataset.configuration,
        ...(propertyToInclude && { propertyToInclude }),
        filePath: filePath || dataset.configuration?.filePath,
      },
    }
    delete (datasetWithFilePath as any).public

    const upsertUrl = isPatchDataset ? `/datasets/${dataset.id}` : `/datasets`
    const createdDataset = await GFWAPI.fetch<Dataset>(upsertUrl, {
      method: isPatchDataset ? 'PATCH' : 'POST',
      body: isPatchDataset ? (datasetWithFilePath as any) : { ...datasetWithFilePath, id },
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

export interface DatasetsState extends AsyncReducer<Dataset> {
  deprecatedDatasets: DatasetsMigration
  carrierLatest: {
    status: AsyncReducerStatus
    dataset: Dataset | undefined
  }
}

const initialState: DatasetsState = {
  ...asyncInitialState,
  deprecatedDatasets: {},
  carrierLatest: {
    status: AsyncReducerStatus.Idle,
    dataset: undefined,
  },
}

const { slice: datasetSlice, entityAdapter } = createAsyncSlice<DatasetsState, Dataset>({
  name: 'datasets',
  initialState,
  reducers: {
    setDeprecatedDatasets: (state, action: PayloadAction<DatasetsMigration>) => {
      state.deprecatedDatasets = { ...state.deprecatedDatasets, ...(action.payload || {}) }
    },
  },
  extraReducers: (builder) => {
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
    createThunk: upsertDatasetThunk,
    deleteThunk: deleteDatasetThunk,
  },
})

export const { setDeprecatedDatasets } = datasetSlice.actions

export type DatasetsSliceState = { datasets: DatasetsState }
export const {
  selectAll: selectAllDatasets,
  selectById,
  selectIds,
} = entityAdapter.getSelectors((state: DatasetsSliceState) => state.datasets)

export const selectDatasetById = memoize((id: string) =>
  createSelector([(state: DatasetsSliceState) => state], (state) => selectById(state, id))
)

export const selectDatasetsStatus = (state: DatasetsSliceState) => state.datasets.status
export const selectDatasetsStatusId = (state: DatasetsSliceState) => state.datasets.statusId
export const selectDatasetsError = (state: DatasetsSliceState) => state.datasets.error
export const selectCarrierLatestDataset = (state: DatasetsSliceState) =>
  state.datasets.carrierLatest.dataset
export const selectCarrierLatestDatasetStatus = (state: DatasetsSliceState) =>
  state.datasets.carrierLatest.status
export const selectDeprecatedDatasets = (state: DatasetsSliceState) =>
  state.datasets.deprecatedDatasets

export default datasetSlice.reducer
