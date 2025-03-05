import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { GFWApiClient } from 'http-client/http-client'
import { memoize, uniq,uniqBy, without } from 'lodash'
import { stringify } from 'qs'
import type { RootState } from 'store'

import {
  parseAPIError,
  parseAPIErrorMessage,
  parseAPIErrorStatus,
} from '@globalfishingwatch/api-client'
import type { APIPagination, Dataset} from '@globalfishingwatch/api-types';
import { DatasetTypes, RelatedDataset } from '@globalfishingwatch/api-types'

import { DEFAULT_PAGINATION_PARAMS, IS_STANDALONE_APP } from 'data/config'
import type {
  AsyncError,  AsyncReducer} from 'utils/async-slice';
import {
  asyncInitialState,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'

export const fetchDatasetByIdThunk = createAsyncThunk<
  Dataset,
  string,
  {
    rejectValue: AsyncError
  }
>('datasets/fetchById', async (id: string, { rejectWithValue }) => {
  try {
    const dataset = await GFWApiClient.fetch<Dataset>(
      `/datasets/${id}?include=endpoints&cache=false`
    )
    return dataset
  } catch (e: any) {
    return rejectWithValue({
      status: parseAPIErrorStatus(e),
      message: `${id} - ${parseAPIErrorMessage(e)}`,
    })
  }
})

const fetchDatasetsFromApi = async (
  ids: string[] = [],
  existingIds: string[] = [],
  signal: AbortSignal,
  maxDepth: number = 5
) => {
  const uniqIds = ids?.length ? ids.filter((id) => !existingIds.includes(id)) : []
  const datasetsParams = {
    ...(uniqIds?.length ? { ids: uniqIds } : { 'logged-user': true }),
    include: 'endpoints',
    cache: process.env.NODE_ENV !== 'development',
    ...DEFAULT_PAGINATION_PARAMS,
  }
  const initialDatasets = await GFWApiClient.fetch<APIPagination<Dataset>>(
    `/datasets?${stringify(datasetsParams, { arrayFormat: 'comma' })}`,
    { signal }
  )

  const mockedDatasets =
    process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_USE_LOCAL_DATASETS === 'true'
      ? await import('./datasets.mock')
      : { default: [] }
  let datasets = uniqBy([...mockedDatasets.default, ...initialDatasets.entries], 'id')

  const relatedDatasetsIds = uniq(
    datasets.flatMap((dataset) => dataset.relatedDatasets?.flatMap(({ id }) => id || []) || [])
  )
  const currentIds = uniq([...existingIds, ...datasets.map((d) => d.id)])
  const uniqRelatedDatasetsIds = without(relatedDatasetsIds, ...currentIds)
  if (uniqRelatedDatasetsIds.length > 1 && maxDepth > 0) {
    const relatedDatasets = await fetchDatasetsFromApi(
      uniqRelatedDatasetsIds,
      currentIds,
      signal,
      maxDepth - 1
    )
    datasets = uniqBy([...datasets, ...relatedDatasets], 'id')
  }

  return datasets
}

export const fetchDatasetsByIdsThunk = createAsyncThunk(
  'datasets/fetch',
  async (ids: string[] = [], { signal, rejectWithValue, getState }) => {
    const existingIds = selectIds(getState() as RootState) as string[]
    try {
      const datasets = await fetchDatasetsFromApi(ids, existingIds, signal)
      return datasets
    } catch (e: any) {
      return rejectWithValue(parseAPIError(e))
    }
  },
  {
    // IMPORTANT to prevent re fetching records that are already in our store
    condition: (ids: string[], { getState }) => {
      const { datasets } = getState() as RootState
      const fetchStatus = datasets.status
      const allRecordsLoaded = ids.every((id) => datasets.ids.includes(id))
      if (
        (fetchStatus === AsyncReducerStatus.Finished && allRecordsLoaded) ||
        fetchStatus === AsyncReducerStatus.Loading
      ) {
        // Already fetched or in progress, don't need to re-fetch
        return false
      }
      return true
    },
  }
)

export const fetchAllDatasetsThunk = createAsyncThunk('datasets/all', (_, { dispatch }) => {
  return dispatch(fetchDatasetsByIdsThunk([]))
})

export interface DatasetsState extends AsyncReducer<Dataset> {
  allDatasetsRequested: boolean
}
const initialState: DatasetsState = {
  ...asyncInitialState,
  allDatasetsRequested: false,
}

const { slice: datasetSlice, entityAdapter } = createAsyncSlice<DatasetsState, Dataset>({
  name: 'datasets',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchAllDatasetsThunk.fulfilled, (state) => {
      state.allDatasetsRequested = true
    })
  },
  thunks: {
    fetchThunk: fetchDatasetsByIdsThunk,
    fetchByIdThunk: fetchDatasetByIdThunk,
  },
})

export const { setDatasetModal } = datasetSlice.actions

export const {
  selectAll: baseSelectAll,
  selectById,
  selectIds,
} = entityAdapter.getSelectors<RootState>((state) => state.datasets)

export const selectAll = createSelector([baseSelectAll], (datasets) => {
  return datasets
})

export function selectDatasets(state: RootState) {
  return selectAll(state)
}

export const selectDatasetById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export const selectDatasetsStatus = (state: RootState) => state.datasets.status
export const selectDatasetsStatusId = (state: RootState) => state.datasets.statusId
export const selectDatasetsError = (state: RootState) => state.datasets.error
export const selectAllDatasetsRequested = (state: RootState) => state.datasets.allDatasetsRequested

export default datasetSlice.reducer
