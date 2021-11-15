import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { uniqBy, memoize, without } from 'lodash'
import { stringify } from 'qs'
import { Dataset } from '@globalfishingwatch/api-types'
import { GFWAPI } from '@globalfishingwatch/api-client'
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
  } catch (e: any) {
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
        process.env.NEXT_PUBLIC_USE_LOCAL_DATASETS === 'true'
      ) {
        const mockedDatasets = await import('./datasets.mock')
        datasets = uniqBy([...mockedDatasets.default, ...datasets], 'id')
      }
      return datasets
    } catch (e: any) {
      return rejectWithValue({ status: e.status || e.code, message: e.message })
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

export const { selectAll, selectById, selectIds } = entityAdapter.getSelectors<RootState>(
  (state) => state.datasets
)

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
