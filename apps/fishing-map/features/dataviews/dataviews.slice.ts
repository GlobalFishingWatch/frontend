import { createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { uniqBy, kebabCase } from 'lodash'
import { stringify } from 'qs'
import {
  Dataview,
  APIPagination,
  DataviewDatasetConfig,
  DataviewInstance,
  DatasetTypes,
} from '@globalfishingwatch/api-types'
import {
  GFWAPI,
  parseAPIError,
  parseAPIErrorMessage,
  parseAPIErrorStatus,
} from '@globalfishingwatch/api-client'
import {
  mergeWorkspaceUrlDataviewInstances,
  resolveDataviews,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import {
  selectWorkspaceDataviewInstances,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import {
  selectIsAnyVesselLocation,
  selectIsMarineManagerLocation,
  selectIsVesselLocation,
  selectIsWorkspaceLocation,
  selectUrlDataviewInstances,
  selectUrlDataviewInstancesOrder,
  selectVesselId,
} from 'routes/routes.selectors'
import { AsyncReducerStatus, AsyncError, AsyncReducer, createAsyncSlice } from 'utils/async-slice'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { DEFAULT_PAGINATION_PARAMS, IS_DEVELOPMENT_ENV } from 'data/config'
import { MARINE_MANAGER_DATAVIEWS } from 'data/default-workspaces/marine-manager'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import {
  getVesselDataviewInstanceDatasetConfig,
  VESSEL_DATAVIEW_INSTANCE_PREFIX,
} from 'features/dataviews/dataviews.utils'
import { selectIsUserLogged } from 'features/user/selectors/user.selectors'
import { getRelatedDatasetByType } from 'features/datasets/datasets.utils'
import { getRelatedIdentityVesselIds } from 'features/vessel/vessel.utils'
import { VESSEL_PROFILE_DATAVIEWS_INSTANCES } from 'data/default-workspaces/context-layers'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'

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
  IS_DEVELOPMENT_ENV || process.env.NEXT_PUBLIC_USE_LOCAL_DATAVIEWS === 'true'
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
      const dataviews = USE_MOCKED_DATAVIEWS
        ? [...mockedDataviews, ...dataviewsResponse.entries]
        : dataviewsResponse.entries
      return uniqBy(
        dataviews.map((d) => ({
          ...d,
          slug: d.slug || kebabCase(d.name),
        })),
        'slug'
      )
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
  selectId: (dataview) => dataview.slug || dataview.id,
})

export const { addDataviewEntity } = dataviewsSlice.actions
export const {
  selectAll: selectAllDataviews,
  selectById,
  selectIds,
} = entityAdapter.getSelectors((state: DataviewsSliceState) => state.dataviews)

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
    selectIsAnyVesselLocation,
    selectIsVesselLocation,
    selectVesselId,
    selectVesselInfoData,
  ],
  (
    isWorkspaceLocation,
    workspaceStatus,
    workspaceDataviewInstances,
    urlDataviewInstances = [],
    isAnyVesselLocation,
    isVesselLocation,
    urlVesselId,
    vessel
  ): UrlDataviewInstance[] | undefined => {
    if (isWorkspaceLocation && workspaceStatus !== AsyncReducerStatus.Finished) {
      return
    }
    const mergedDataviewInstances =
      mergeWorkspaceUrlDataviewInstances(
        workspaceDataviewInstances as DataviewInstance<any>[],
        urlDataviewInstances
      ) || []
    if (isAnyVesselLocation) {
      const existingDataviewInstance = mergedDataviewInstances?.find(
        ({ id }) => urlVesselId && id.includes(urlVesselId)
      )
      if (!existingDataviewInstance && vessel?.identities) {
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
        mergedDataviewInstances.push({ ...dataviewInstance, datasetsConfig })
      }
      if (isVesselLocation) {
        VESSEL_PROFILE_DATAVIEWS_INSTANCES.forEach((dataviewInstance) => {
          if (!mergedDataviewInstances.find(({ id }) => id === dataviewInstance.id)) {
            mergedDataviewInstances.push({ ...dataviewInstance })
          }
        })
      }
    }
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
  [selectDataviewInstancesMergedOrdered, selectAllDataviews, selectAllDatasets, selectIsUserLogged],
  (dataviewInstances, dataviews, datasets, loggedUser): UrlDataviewInstance[] | undefined => {
    if (!dataviews?.length || !datasets?.length || !dataviewInstances?.length) {
      return []
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
        const config = { ...dataviewInstance.config }
        // Vessel pined from not logged user but is logged now and the related dataset is available
        if (loggedUser && !config.track) {
          const dataset = datasets.find((d) => d.id === config.info)
          const trackDatasetId = getRelatedDatasetByType(dataset, DatasetTypes.Tracks)?.id
          if (trackDatasetId) {
            config.track = trackDatasetId
          }
        }

        const datasetsConfig: DataviewDatasetConfig[] = getVesselDataviewInstanceDatasetConfig(
          vesselId,
          config
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
  [selectIsMarineManagerLocation, selectAllDataviews, selectAllDatasets],
  (isMarineManagerLocation, dataviews, datasets): UrlDataviewInstance[] | undefined => {
    if (!isMarineManagerLocation || !dataviews.length || !datasets.length) return []
    const dataviewInstancesResolved = resolveDataviews(
      MARINE_MANAGER_DATAVIEWS,
      dataviews,
      datasets
    )
    return dataviewInstancesResolved
  }
)

export default dataviewsSlice.reducer
