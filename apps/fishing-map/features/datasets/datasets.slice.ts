import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { kebabCase, memoize, uniq, uniqBy, without } from 'es-toolkit'
import { stringify } from 'qs'

import {
  GFWAPI,
  parseAPIError,
  parseAPIErrorMessage,
  parseAPIErrorStatus,
} from '@globalfishingwatch/api-client'
import type {
  APIPagination,
  Dataset,
  DatasetsMigration,
  UploadResponse,
} from '@globalfishingwatch/api-types'
import { DatasetTypes, Locale } from '@globalfishingwatch/api-types'
import {
  ALL_LEGACY_V2_VESSELS_DATASETS_DICT,
  getDatasetConfiguration,
  LEGACY_DATASETS_TO_LATEST_VMS,
} from '@globalfishingwatch/datasets-client'

import { DEFAULT_PAGINATION_PARAMS, IS_DEVELOPMENT_ENV, PUBLIC_SUFIX } from 'data/config'
import i18n from 'features/i18n/i18n'
import type { RootState } from 'store'
import type { AsyncError, AsyncReducer } from 'utils/async-slice'
import { asyncInitialState, createAsyncSlice } from 'utils/async-slice'

export const DATASETS_USER_SOURCE_ID = 'user'
export const DEPRECATED_DATASETS_HEADER = 'X-Deprecated-Dataset'

export const getDatasetByIdsThunk = createAsyncThunk(
  'datasets/getByIds',
  async (
    {
      ids,
      includeRelated = true,
      locale = i18n.language as Locale,
    }: { ids: string[]; includeRelated?: boolean; locale?: Locale },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const state = getState() as RootState
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
          fetchDatasetsByIdsThunk({ ids: datasetsToRequest, includeRelated, locale })
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
        message: `${ids.join(', ')} - ${parseAPIErrorMessage(e)}`,
      })
    }
  }
)

export const fetchDatasetByIdThunk = createAsyncThunk<
  Dataset,
  { id: string; locale?: Locale },
  {
    rejectValue: AsyncError
  }
>('datasets/fetchById', async ({ id, locale = i18n.language as Locale }, { rejectWithValue }) => {
  try {
    const dataset = await GFWAPI.fetch<Dataset>(
      `/datasets/${id}?cache=false&locale=${locale.toUpperCase()}`
    )
    return dataset
  } catch (e: any) {
    console.warn(e)
    return rejectWithValue({
      status: parseAPIErrorStatus(e),
      message: `${id} - ${parseAPIErrorMessage(e)}`,
    })
  }
})

type FetchDatasetsFromApiParams = {
  existingIds: string[]
  fetchUserDatasetsMode?: FetchUserDatasetsMode
  forceRefresh?: boolean
  ids: string[]
  includeRelated?: boolean
  locale: Locale | 'source'
  maxDepth?: number
  signal: AbortSignal
}
const fetchDatasetsFromApi = async (
  {
    ids,
    existingIds,
    signal,
    maxDepth = 5,
    includeRelated = true,
    locale = i18n.language as Locale,
    fetchUserDatasetsMode,
    forceRefresh = false,
  } = {} as FetchDatasetsFromApiParams
) => {
  const uniqIds = ids?.length
    ? ids.filter((id) => {
        const isLegacyV2Dataset = ALL_LEGACY_V2_VESSELS_DATASETS_DICT[id]
        if (isLegacyV2Dataset) {
          console.warn(`Skipping request for deprecated V2 dataset: ${id}`)
          return false
        }
        return forceRefresh || !existingIds.includes(id)
      })
    : []
  if (!uniqIds.length && fetchUserDatasetsMode === undefined) {
    return { datasetsDeprecated: {}, datasets: [] }
  }
  const datasetsParams = {
    ...(uniqIds?.length
      ? { ids: uniqIds }
      : { 'logged-user': fetchUserDatasetsMode === 'user-only' }),
    cache: false,
    locale: locale === 'source' ? Locale.en.toUpperCase() : locale.toUpperCase(),
    ...DEFAULT_PAGINATION_PARAMS,
  }
  const includesParam = stringify(
    {
      includes: ['I18N', 'DESCRIPTION'],
    },
    { arrayFormat: 'indices' }
  )
  const initialDatasetsResponse = await GFWAPI.fetch<Response>(
    `/datasets?${stringify(datasetsParams, { arrayFormat: 'comma' })}&${includesParam}`,
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
    IS_DEVELOPMENT_ENV || import.meta.env.VITE_USE_LOCAL_DATASETS === 'true'
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
      locale,
    })
    datasets = uniqBy([...datasets, ...relatedDatasets], (d) => d.id)
    datasetsDeprecatedDict = { ...datasetsDeprecatedDict, ...datasetsDeprecated }
  }

  return { datasetsDeprecated: datasetsDeprecatedDict, datasets }
}

type FetchUserDatasetsMode = 'all' | 'user-only'
export const fetchDatasetsByIdsThunk = createAsyncThunk<
  Dataset[],
  {
    ids: string[]
    fetchUserDatasetsMode?: FetchUserDatasetsMode
    forceRefresh?: boolean
    includeRelated?: boolean
    locale?: Locale
  },
  {
    rejectValue: AsyncError
  }
>(
  'datasets/fetch',
  async (
    {
      ids,
      fetchUserDatasetsMode = 'user-only',
      forceRefresh = false,
      includeRelated = true,
      locale = i18n.language as Locale,
    },
    { signal, rejectWithValue, getState, dispatch }
  ) => {
    const state = getState() as DatasetsSliceState
    const existingIds = selectIds(state) as string[]
    const existingRequestedDatasets = ids.flatMap((id) => {
      const dataset = selectById(state, id) as Dataset
      return dataset ? [dataset] : []
    })
    if (
      !forceRefresh &&
      ids.length > 0 &&
      ids.length === existingRequestedDatasets.length &&
      fetchUserDatasetsMode === 'user-only'
    ) {
      return uniqBy([...existingRequestedDatasets], (dataset) => dataset.id)
    }
    try {
      const { datasetsDeprecated, datasets } = await fetchDatasetsFromApi({
        ids,
        existingIds,
        signal,
        fetchUserDatasetsMode,
        forceRefresh,
        includeRelated,
        locale,
      })
      if (Object.keys(datasetsDeprecated).length) {
        dispatch(setDeprecatedDatasets(datasetsDeprecated))
      }
      return uniqBy([...datasets, ...existingRequestedDatasets], (dataset) => dataset.id)
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue(parseAPIError(e))
    }
  }
)

export const fetchAllDatasetsThunk = createAsyncThunk<
  any,
  { fetchUserDatasetsMode?: FetchUserDatasetsMode; locale?: Locale } | undefined,
  {
    rejectValue: AsyncError
  }
>(
  'datasets/all',
  ({ fetchUserDatasetsMode, locale = i18n.language as Locale } = {}, { dispatch }) => {
    return dispatch(fetchDatasetsByIdsThunk({ ids: [], fetchUserDatasetsMode, locale }))
  }
)

export type UpsertDataset = {
  dataset: Partial<Dataset>
  file?: File
  createAsPublic?: boolean
  addIdSuffix?: boolean
}
export const upsertDatasetThunk = createAsyncThunk<
  Dataset,
  UpsertDataset,
  {
    rejectValue: AsyncError
  }
>(
  'datasets/create',
  async ({ dataset, file, createAsPublic, addIdSuffix = true }, { rejectWithValue }) => {
    try {
      let filePath
      const configurationByType =
        dataset.type === DatasetTypes.UserTracks ? 'userTracksV1' : 'userContextLayerV1'
      const { idProperty, filePath: datasetFilePath } = getDatasetConfiguration(
        dataset,
        configurationByType
      )
      const { format } = getDatasetConfiguration(dataset, 'userContextLayerV1')
      if (file) {
        const { url, path } = await GFWAPI.fetch<UploadResponse>(`/uploads`, {
          method: 'POST',
          body: {
            contentType:
              format && format.toUpperCase() === 'GEOJSON' ? 'application/json' : file.type,
          } as any,
        })
        filePath = path
        await fetch(url, { method: 'PUT', body: file })
      }

      const suffix = addIdSuffix ? `-${Date.now()}` : ''
      const generatedId = dataset.id || `${kebabCase(dataset.name || '')}${suffix}`
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
          [configurationByType]: {
            ...dataset.configuration?.[configurationByType],
            // Properties that are to be used as SQL params on the server
            // need to be lowercase
            idProperty: idProperty?.toLowerCase() || '',
            filePath: filePath || datasetFilePath,
          },
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
  }
)

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
      const updatedDataset = await GFWAPI.fetch<Dataset>(`/datasets/${id}`, {
        method: 'PATCH',
        body: { ...rest, configuration } as any,
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

export interface DatasetsState extends AsyncReducer<Dataset> {
  deprecatedDatasets: DatasetsMigration
}

export type DatasetsSliceState = { datasets: DatasetsState }

export const refreshDatasetsLocaleThunk = createAsyncThunk<
  void,
  Locale,
  { rejectValue: AsyncError }
>('datasets/refreshLocale', async (locale, { getState, dispatch }) => {
  const state = getState() as DatasetsSliceState
  const ids = (state.datasets.ids as string[]) || []
  if (!ids.length) {
    return
  }
  await dispatch(fetchDatasetsByIdsThunk({ ids, locale, forceRefresh: true }))
})

const initialState: DatasetsState = {
  ...asyncInitialState,
  deprecatedDatasets: {},
}

const { slice: datasetSlice, entityAdapter } = createAsyncSlice<DatasetsState, Dataset>({
  name: 'datasets',
  initialState,
  reducers: {
    setDeprecatedDatasets: (
      state: { deprecatedDatasets: DatasetsMigration },
      action: PayloadAction<DatasetsMigration>
    ) => {
      state.deprecatedDatasets = { ...state.deprecatedDatasets, ...(action.payload || {}) }
    },
  },
  // extraReducers: (builder) => {},
  thunks: {
    fetchThunk: fetchDatasetsByIdsThunk,
    fetchByIdThunk: fetchDatasetByIdThunk,
    updateThunk: updateDatasetThunk,
    createThunk: upsertDatasetThunk,
    deleteThunk: deleteDatasetThunk,
  },
})

export const { setDeprecatedDatasets } = datasetSlice.actions

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
export const selectSliceDeprecatedDatasets = (state: DatasetsSliceState) =>
  state.datasets.deprecatedDatasets

export const selectDeprecatedDatasets = createSelector(
  [selectSliceDeprecatedDatasets],
  (deprecatedDatasets) => {
    return {
      ...deprecatedDatasets,
      ...LEGACY_DATASETS_TO_LATEST_VMS,
    }
  }
)

export default datasetSlice.reducer
