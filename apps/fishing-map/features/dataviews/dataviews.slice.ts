import { createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { uniqBy } from 'lodash'
import { stringify } from 'qs'
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
  APIPagination,
  DataviewDatasetConfig,
} from '@globalfishingwatch/api-types'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import {
  GFWAPI,
  parseAPIError,
  parseAPIErrorMessage,
  parseAPIErrorStatus,
} from '@globalfishingwatch/api-client'
import {
  selectWorkspaceStateProperty,
  selectWorkspaceDataviewInstances,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import {
  selectIsMarineManagerLocation,
  selectIsVesselLocation,
  selectIsWorkspaceLocation,
  selectUrlDataviewInstances,
  selectUrlDataviewInstancesOrder,
  selectVesselId,
} from 'routes/routes.selectors'
import { AsyncReducerStatus, AsyncError, AsyncReducer, createAsyncSlice } from 'utils/async-slice'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { createDeepEqualSelector } from 'utils/selectors'
import {
  selectTrackThinningConfig,
  selectTrackChunksConfig,
} from 'features/resources/resources.slice'
import { DEFAULT_PAGINATION_PARAMS } from 'data/config'
import { MARINE_MANAGER_DATAVIEWS } from 'data/default-workspaces/marine-manager'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import {
  getVesselDataviewInstanceDatasetConfig,
  VESSEL_DATAVIEW_INSTANCE_PREFIX,
} from 'features/dataviews/dataviews.utils'
import { selectViewOnlyVessel } from 'features/vessel/vessel.config.selectors'
import { getRelatedIdentityVesselIds } from 'features/vessel/vessel.utils'
import {
  eventsDatasetConfigsCallback,
  infoDatasetConfigsCallback,
  trackDatasetConfigsCallback,
} from '../resources/resources.utils'

export const fetchDataviewByIdThunk = createAsyncThunk(
  'dataviews/fetchById',
  async (id: Dataview['id'] | Dataview['slug'], { rejectWithValue }) => {
    try {
      const dataview = await GFWAPI.fetch<Dataview>(`/dataviews/${id}`)
      return dataview
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue({
        status: parseAPIErrorStatus(e),
        message: `${id} - ${parseAPIErrorMessage(e)}`,
      })
    }
  }
)

const USE_MOCKED_DATAVIEWS =
  process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_USE_LOCAL_DATAVIEWS === 'true'
let mockedDataviewsImported = false
export const fetchDataviewsByIdsThunk = createAsyncThunk(
  'dataviews/fetch',
  async (ids: (Dataview['id'] | Dataview['slug'])[], { signal, rejectWithValue, getState }) => {
    const state = getState() as DataviewsSliceState
    const existingIds = selectIds(state) as (number | string)[]
    const uniqIds = ids.filter((id) => !existingIds.includes(id))

    let mockedDataviews = [] as Dataview[]
    if (USE_MOCKED_DATAVIEWS && !mockedDataviewsImported) {
      mockedDataviews = await import('./dataviews.mock').then((d) => d.default)
    }

    if (!uniqIds?.length) {
      return mockedDataviews
    }
    try {
      const dataviewsParams = {
        ids: uniqIds,
        cache: false,
        ...DEFAULT_PAGINATION_PARAMS,
      }
      const dataviewsResponse = await GFWAPI.fetch<APIPagination<Dataview>>(
        `/dataviews?${stringify(dataviewsParams, { arrayFormat: 'comma' })}`,
        { signal }
      )

      return USE_MOCKED_DATAVIEWS
        ? uniqBy([...mockedDataviews, ...dataviewsResponse.entries], 'slug')
        : dataviewsResponse.entries
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue(parseAPIError(e))
    }
  }
)

export const createDataviewThunk = createAsyncThunk<
  Dataview,
  Partial<Dataview>,
  {
    rejectValue: AsyncError
  }
>('dataviews/create', async (dataview, { rejectWithValue }) => {
  try {
    const createdDataview = await GFWAPI.fetch<Dataview>(`/dataviews`, {
      method: 'POST',
      body: dataview as any,
    })

    return createdDataview
  } catch (e: any) {
    console.warn(e)
    return rejectWithValue(parseAPIError(e))
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
  async (partialDataview, { rejectWithValue }) => {
    try {
      const dataview = await GFWAPI.fetch<Dataview>(`/dataviews/${partialDataview.id}`, {
        method: 'PATCH',
        body: partialDataview as any,
      })
      return dataview
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

export type DataviewsState = AsyncReducer<Dataview>
export type DataviewsSliceState = { dataviews: DataviewsState }

const { slice: dataviewsSlice, entityAdapter } = createAsyncSlice<DataviewsState, Dataview>({
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
  selectId: (dataview) => dataview.slug,
})

export const { addDataviewEntity } = dataviewsSlice.actions
export const { selectAll, selectById, selectIds } = entityAdapter.getSelectors(
  (state: DataviewsSliceState) => state.dataviews
)

export function selectAllDataviews(state: DataviewsSliceState) {
  return selectAll(state)
}

export function selectDataviewBySlug(slug: string) {
  return createSelector([selectAllDataviews], (dataviews) => {
    return dataviews?.find((d) => d.slug === slug)
  })
}

export const selectDataviewsStatus = (state: DataviewsSliceState) => state.dataviews.status

export const selectDataviewInstancesMerged = createSelector(
  [
    selectIsWorkspaceLocation,
    selectWorkspaceStatus,
    selectWorkspaceDataviewInstances,
    selectUrlDataviewInstances,
  ],
  (
    isWorkspaceLocation,
    workspaceStatus,
    workspaceDataviewInstances,
    urlDataviewInstances = []
  ): UrlDataviewInstance[] | undefined => {
    if (isWorkspaceLocation && workspaceStatus !== AsyncReducerStatus.Finished) {
      return
    }
    const mergedDataviewInstances = mergeWorkspaceUrlDataviewInstances(
      workspaceDataviewInstances as DataviewInstance<any>[],
      urlDataviewInstances
    )
    return mergedDataviewInstances
  }
)
export const selectDataviewInstancesMergedOrdered = createSelector(
  [selectDataviewInstancesMerged, selectUrlDataviewInstancesOrder],
  (dataviewInstances = [], dataviewInstancesOrder): UrlDataviewInstance[] => {
    if (!dataviewInstancesOrder || !dataviewInstancesOrder.length) {
      return dataviewInstances
    }
    const dataviewInstancesOrdered = dataviewInstances.sort(
      (a, b) => dataviewInstancesOrder.indexOf(a.id) - dataviewInstancesOrder.indexOf(b.id)
    )
    return [...dataviewInstancesOrdered]
  }
)

export const selectAllDataviewInstancesResolved = createSelector(
  [
    selectDataviewInstancesMergedOrdered,
    selectAllDataviews,
    selectAllDatasets,
    selectIsVesselLocation,
    selectVesselInfoData,
    selectVesselId,
  ],
  (
    dataviewInstances,
    dataviews,
    datasets,
    isVesselLocation,
    vessel,
    urlVesselId
  ): UrlDataviewInstance[] | undefined => {
    if (isVesselLocation) {
      if (!vessel || !vessel.identities) {
        return []
      }
      const vesselDatasets = {
        info: vessel.info,
        track: vessel.track,
        ...(vessel?.events?.length && {
          events: vessel?.events,
        }),
        relatedVesselIds: getRelatedIdentityVesselIds(vessel),
      }

      const dataviewInstance = getVesselDataviewInstance({ id: urlVesselId }, vesselDatasets)
      const datasetsConfig: DataviewDatasetConfig[] = getVesselDataviewInstanceDatasetConfig(
        urlVesselId,
        vesselDatasets
      )
      return resolveDataviews([{ ...dataviewInstance, datasetsConfig }], dataviews, datasets)
    }
    const dataviewInstancesWithDatasetConfig = dataviewInstances.map((dataviewInstance) => {
      if (
        dataviewInstance.id.startsWith(VESSEL_DATAVIEW_INSTANCE_PREFIX) &&
        !dataviewInstance.datasetsConfig?.length &&
        dataviewInstance.config?.info
      ) {
        const vesselId = dataviewInstance.id.split(VESSEL_DATAVIEW_INSTANCE_PREFIX)[1]
        // New way to resolve datasetConfig for vessels to avoid storing all
        // the datasetConfig in the instance and save url string characters
        const datasetsConfig: DataviewDatasetConfig[] = getVesselDataviewInstanceDatasetConfig(
          vesselId,
          dataviewInstance.config
        )
        return {
          ...dataviewInstance,
          datasetsConfig,
        }
      }
      return dataviewInstance
    })
    const dataviewInstancesResolved = resolveDataviews(
      dataviewInstancesWithDatasetConfig,
      dataviews,
      datasets
    )
    return dataviewInstancesResolved
  }
)

export const selectMarineManagerDataviewInstanceResolved = createSelector(
  [selectAllDataviews, selectAllDatasets],
  (dataviews, datasets): UrlDataviewInstance[] | undefined => {
    if (!dataviews.length || !datasets.length) return []
    const dataviewInstancesResolved = resolveDataviews(
      MARINE_MANAGER_DATAVIEWS,
      dataviews,
      datasets
    )
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
      track: trackDatasetConfigsCallback(thinningConfig, chunks, timebarGraph),
      events: eventsDatasetConfigsCallback,
      info: infoDatasetConfigsCallback,
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

export const selectActiveDataviewInstancesResolved = createSelector(
  [selectDataviewInstancesResolved],
  (dataviewInstances) => {
    return dataviewInstances.filter((d) => d.config?.visible)
  }
)

export const selectCurrentDataviewInstancesResolved = createSelector(
  [
    selectDataviewInstancesResolved,
    selectIsMarineManagerLocation,
    selectMarineManagerDataviewInstanceResolved,
  ],
  (dataviewsInstances = [], isMarineManagerLocation, marineManagerDataviewInstances = []) => {
    return isMarineManagerLocation ? marineManagerDataviewInstances : dataviewsInstances
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
  [selectTrackDataviews, selectIsVesselLocation, selectViewOnlyVessel, selectVesselId],
  (dataviews, isVesselLocation, viewOnlyVessel, vesselId) => {
    return dataviews?.filter(({ config, id }) => {
      if (isVesselLocation && viewOnlyVessel) {
        return id === `${VESSEL_DATAVIEW_INSTANCE_PREFIX}${vesselId}` && config?.visible
      }
      return config?.visible
    })
  }
)

export default dataviewsSlice.reducer
