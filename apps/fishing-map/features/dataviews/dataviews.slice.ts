import { createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { uniqBy, memoize } from 'lodash'
import {
  mergeWorkspaceUrlDataviewInstances,
  resolveDataviews,
  UrlDataviewInstance,
  getResources,
  GetDatasetConfigsCallbacks,
} from '@globalfishingwatch/dataviews-client'
import {
  DatasetTypes,
  DataviewCategory,
  DataviewInstance,
  Dataview,
} from '@globalfishingwatch/api-types'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { GFWAPI } from '@globalfishingwatch/api-client'
import {
  selectWorkspaceStateProperty,
  selectWorkspaceDataviewInstances,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import { selectUrlDataviewInstances, selectVersion } from 'routes/routes.selectors'
import { AsyncReducerStatus, AsyncError, AsyncReducer, createAsyncSlice } from 'utils/async-slice'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { createDeepEqualSelector } from 'utils/selectors'
import {
  selectTrackThinningConfig,
  selectTrackChunksConfig,
} from 'features/resources/resources.slice'
import { RootState } from 'store'
import { trackDatasetConfigsCallback } from '../resources/resources.utils'

export const fetchDataviewByIdThunk = createAsyncThunk(
  'dataviews/fetchById',
  async (id: number, { getState, rejectWithValue }) => {
    const state = getState() as RootState
    const version = selectVersion(state)
    try {
      const dataview = await GFWAPI.fetch<Dataview>(`/${version}/dataviews/${id}`)
      return dataview
    } catch (e: any) {
      return rejectWithValue({ status: e.status || e.code, message: `${id} - ${e.message}` })
    }
  }
)

export const fetchDataviewsByIdsThunk = createAsyncThunk(
  'dataviews/fetch',
  async (ids: number[], { signal, rejectWithValue, getState }) => {
    const state = getState() as RootState
    const existingIds = selectIds(state) as number[]
    const uniqIds = ids.filter((id) => !existingIds.includes(id))
    const version = selectVersion(state)
    if (!uniqIds?.length) {
      return [] as Dataview[]
    }
    try {
      let dataviews = await GFWAPI.fetch<Dataview[]>(
        `/${version}/dataviews?ids=${uniqIds.join(',')}`,
        {
          signal,
        }
      )
      if (
        process.env.NODE_ENV === 'development' ||
        process.env.NEXT_PUBLIC_USE_LOCAL_DATAVIEWS === 'true'
      ) {
        const mockedDataviews = await import('./dataviews.mock')
        dataviews = uniqBy([...mockedDataviews.default, ...dataviews], 'id')
      }
      return dataviews
    } catch (e: any) {
      return rejectWithValue({ status: e.status || e.code, message: e.message })
    }
  }
)

export const createDataviewThunk = createAsyncThunk<
  Dataview,
  Partial<Dataview>,
  {
    rejectValue: AsyncError
  }
>('dataviews/create', async (dataview, { getState, rejectWithValue }) => {
  const state = getState() as RootState
  const version = selectVersion(state)
  try {
    const createdDataview = await GFWAPI.fetch<Dataview>(`/${version}/dataviews`, {
      method: 'POST',
      body: dataview as any,
    })

    return createdDataview
  } catch (e: any) {
    return rejectWithValue({ status: e.status || e.code, message: e.message })
  }
})

export const updateDataviewThunk = createAsyncThunk<
  Dataview,
  Partial<Dataview>,
  {
    rejectValue: AsyncError
  }
>(
  'dataviews/update',
  async (partialDataview, { getState, rejectWithValue }) => {
    const state = getState() as RootState
    const version = selectVersion(state)
    try {
      const dataview = await GFWAPI.fetch<Dataview>(`/${version}/dataviews/${partialDataview.id}`, {
        method: 'PATCH',
        body: partialDataview as any,
      })
      return dataview
    } catch (e: any) {
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

export type ResourcesState = AsyncReducer<Dataview>

const { slice: dataviewsSlice, entityAdapter } = createAsyncSlice<ResourcesState, Dataview>({
  name: 'dataview',
  thunks: {
    fetchThunk: fetchDataviewsByIdsThunk,
    fetchByIdThunk: fetchDataviewByIdThunk,
    createThunk: createDataviewThunk,
    updateThunk: updateDataviewThunk,
  },
  reducers: {
    addDataviewEntity: (state, action: PayloadAction<Dataview>) => {
      entityAdapter.addOne(state, action.payload)
    },
  },
})

export const { addDataviewEntity } = dataviewsSlice.actions
export const { selectAll, selectById, selectIds } = entityAdapter.getSelectors<RootState>(
  (state) => state.dataviews
)

export function selectAllDataviews(state: RootState) {
  return selectAll(state)
}

export const selectDataviewById = memoize((id: number) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export const selectDataviewsStatus = (state: RootState) => state.dataviews.status

export const selectDataviewInstancesMerged = createSelector(
  [selectWorkspaceStatus, selectWorkspaceDataviewInstances, selectUrlDataviewInstances],
  (
    workspaceStatus,
    workspaceDataviewInstances,
    urlDataviewInstances = []
  ): UrlDataviewInstance[] | undefined => {
    if (workspaceStatus !== AsyncReducerStatus.Finished) {
      return
    }
    const mergedDataviewInstances = mergeWorkspaceUrlDataviewInstances(
      workspaceDataviewInstances as DataviewInstance<any>[],
      urlDataviewInstances
    )
    return mergedDataviewInstances
  }
)

export const selectAllDataviewInstancesResolved = createSelector(
  [selectDataviewInstancesMerged, selectAllDataviews, selectAllDatasets],
  (dataviewInstances, dataviews, datasets): UrlDataviewInstance[] | undefined => {
    if (!dataviewInstances) return
    const dataviewInstancesResolved = resolveDataviews(dataviewInstances, dataviews, datasets)
    return dataviewInstancesResolved
  }
)

/**
 * Calls getResources to prepare track dataviews' datasetConfigs.
 * Injects app-specific logic by using getResources's callback
 */
export const selectDataviewsResources = createSelector(
  [
    selectAllDataviewInstancesResolved,
    selectTrackThinningConfig,
    selectTrackChunksConfig,
    selectWorkspaceStateProperty('timebarGraph'),
  ],
  (dataviewInstances, thinningConfig, chunks, timebarGraph) => {
    const callbacks: GetDatasetConfigsCallbacks = {
      tracks: trackDatasetConfigsCallback(thinningConfig, chunks, timebarGraph),
    }
    return getResources(dataviewInstances || [], callbacks)
  }
)

const defaultDataviewResolved = []
export const selectDataviewInstancesResolved = createSelector(
  [selectDataviewsResources],
  (dataviewsResources) => {
    return dataviewsResources.dataviews || defaultDataviewResolved
  }
)
export const selectDataviewInstancesByType = (type: GeneratorType) => {
  return createSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => dataview.config?.type === type)
  })
}

export const selectTrackDataviews = createSelector(
  [selectDataviewInstancesByType(GeneratorType.Track)],
  (dataviews) => dataviews
)

export const selectVesselsDataviews = createSelector([selectTrackDataviews], (dataviews) => {
  return dataviews?.filter(
    (dataview) =>
      !dataview.datasets ||
      (dataview.datasets?.[0]?.type !== DatasetTypes.UserTracks &&
        dataview.category === DataviewCategory.Vessels)
  )
})

export const selectActiveVesselsDataviews = createDeepEqualSelector(
  [selectVesselsDataviews],
  (dataviews) => dataviews?.filter((d) => d.config?.visible)
)

export const selectActiveTrackDataviews = createDeepEqualSelector(
  [selectTrackDataviews],
  (dataviews) => dataviews?.filter((d) => d.config?.visible)
)

export default dataviewsSlice.reducer
