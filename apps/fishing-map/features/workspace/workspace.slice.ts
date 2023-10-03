import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { uniq } from 'lodash'
import {
  Workspace,
  Dataview,
  WorkspaceUpsert,
  DataviewInstance,
  DataviewCategory,
  EndpointId,
  Dataset,
  DatasetTypes,
  DatasetCategory,
} from '@globalfishingwatch/api-types'
import { GFWAPI, FetchOptions, parseAPIError } from '@globalfishingwatch/api-client'
import {
  parseLegacyDataviewInstanceEndpoint,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { DEFAULT_TIME_RANGE } from 'data/config'
import { WorkspaceState } from 'types'
import { fetchDatasetsByIdsThunk } from 'features/datasets/datasets.slice'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import {
  selectLocationCategory,
  selectLocationType,
  selectReportId,
  selectUrlDataviewInstances,
} from 'routes/routes.selectors'
import { HOME, REPORT, ROUTE_TYPES, WORKSPACE } from 'routes/routes'
import { cleanQueryLocation, updateLocation, updateQueryParam } from 'routes/routes.actions'
import { selectDaysFromLatest } from 'features/app/app.selectors'
import {
  DEFAULT_DATAVIEW_SLUGS,
  ONLY_GFW_STAFF_DATAVIEW_SLUGS,
  getWorkspaceEnv,
  VESSEL_PRESENCE_DATAVIEW_SLUG,
  WorkspaceCategory,
  DEFAULT_WORKSPACE_ID,
} from 'data/workspaces'
import { AsyncReducerStatus, AsyncError } from 'utils/async-slice'
import {
  getDatasetsInDataviews,
  getLatestEndDateFromDatasets,
} from 'features/datasets/datasets.utils'
import { isGFWUser, isGuestUser } from 'features/user/user.slice'
import { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import { getVesselDataviewInstanceDatasetConfig } from 'features/dataviews/dataviews.utils'
import { mergeDataviewIntancesToUpsert } from 'features/workspace/workspace.hook'
import { getUTCDateTime } from 'utils/dates'
import { fetchReportsThunk } from 'features/reports/reports.slice'
import { AppDispatch } from 'store'
import { selectWorkspaceStatus } from './workspace.selectors'

type LastWorkspaceVisited = { type: ROUTE_TYPES; payload: any; query: any; replaceQuery?: boolean }

interface WorkspaceSliceState {
  status: AsyncReducerStatus
  // used to identify when someone saves its own version of the workspace
  customStatus: AsyncReducerStatus
  error: AsyncError
  data: Workspace<WorkspaceState> | null
  lastVisited: LastWorkspaceVisited | undefined
}

const initialState: WorkspaceSliceState = {
  status: AsyncReducerStatus.Idle,
  customStatus: AsyncReducerStatus.Idle,
  error: {},
  data: null,
  lastVisited: undefined,
}

type RejectedActionPayload = {
  workspace: Workspace<WorkspaceState>
  error: AsyncError
}

export const getDefaultWorkspace = () => {
  const workspaceEnv = getWorkspaceEnv()
  const workspace = import(`../../data/default-workspaces/workspace.${workspaceEnv}`).then(
    (m) => m.default
  )
  return workspace as Promise<AppWorkspace>
}

export const fetchWorkspaceThunk = createAsyncThunk(
  'workspace/fetch',
  async (workspaceId: string, { signal, dispatch, getState, rejectWithValue }: any) => {
    const state = getState() as any
    const locationType = selectLocationType(state)
    const urlDataviewInstances = selectUrlDataviewInstances(state)
    const guestUser = isGuestUser(state)
    const gfwUser = isGFWUser(state)
    const reportId = selectReportId(state)
    try {
      let workspace: Workspace<any> | null = null
      if (locationType === REPORT) {
        const action = dispatch(fetchReportsThunk([reportId]))
        const resolvedAction = await action
        if (fetchReportsThunk.fulfilled.match(resolvedAction)) {
          workspace = resolvedAction.payload?.[0]?.workspace
          if (!workspace) {
            return rejectWithValue({
              error: {
                status: 404,
                message: 'Report workspace not found',
              },
            })
          }
        }
        // TODO fetch report and use the workspace within it
      } else if (workspaceId && workspaceId !== DEFAULT_WORKSPACE_ID) {
        workspace = await GFWAPI.fetch<Workspace<WorkspaceState>>(`/workspaces/${workspaceId}`, {
          signal,
        })
      }
      if ((!workspace && locationType === HOME) || workspaceId === DEFAULT_WORKSPACE_ID) {
        workspace = await getDefaultWorkspace()
      }
      if (gfwUser && ONLY_GFW_STAFF_DATAVIEW_SLUGS.length) {
        // Inject dataviews for gfw staff only
        ONLY_GFW_STAFF_DATAVIEW_SLUGS.forEach((id) => {
          workspace?.dataviewInstances.push({
            id: `${id}-instance`,
            config: {
              visible: false,
            },
            dataviewId: id,
          })
        })
      }

      if (workspace) {
        workspace = {
          ...workspace,
          dataviewInstances: (workspace?.dataviewInstances || []).map(
            (dv) => parseLegacyDataviewInstanceEndpoint(dv) as DataviewInstance
          ),
        }
      }

      const defaultWorkspaceDataviews = gfwUser
        ? [...DEFAULT_DATAVIEW_SLUGS, VESSEL_PRESENCE_DATAVIEW_SLUG] // Only for gfw users as includes the private-global-presence-tracks dataset
        : DEFAULT_DATAVIEW_SLUGS

      const dataviewIds = [
        ...defaultWorkspaceDataviews,
        ...(workspace?.dataviewInstances || []).map(({ dataviewId }) => dataviewId),
        ...(urlDataviewInstances || []).map(({ dataviewId }) => dataviewId),
      ].filter(Boolean)

      const uniqDataviewIds = uniq(dataviewIds) as string[]

      let dataviews: Dataview[] = []
      if (uniqDataviewIds?.length) {
        const fetchDataviewsAction: any = dispatch(fetchDataviewsByIdsThunk(uniqDataviewIds))
        signal.addEventListener('abort', fetchDataviewsAction.abort)
        const { payload } = await fetchDataviewsAction
        if (payload?.length) {
          dataviews = payload
        }
      }
      let datasets: Dataset[] = []
      if (!signal.aborted) {
        const dataviewInstances: UrlDataviewInstance[] = [
          ...(workspace?.dataviewInstances || []),
          ...(urlDataviewInstances || []),
        ]
        const datasetsIds = getDatasetsInDataviews(dataviews, dataviewInstances, guestUser)
        const fetchDatasetsAction: any = dispatch(fetchDatasetsByIdsThunk(datasetsIds))
        signal.addEventListener('abort', fetchDatasetsAction.abort)
        const { error, payload } = await fetchDatasetsAction
        datasets = payload as Dataset[]

        // Try to add track for for VMS vessels in case it is logged using the full- datasets
        const vesselDataviewsWithoutTrack = dataviewInstances.filter((dataviewInstance) => {
          const dataview = dataviews.find(({ slug }) => dataviewInstance.dataviewId === slug)
          const isVesselDataview = dataview?.category === DataviewCategory.Vessels
          const hasTrackDatasetConfig = dataviewInstance.datasetsConfig?.some(
            (datasetConfig) => datasetConfig.endpoint === EndpointId.Tracks
          )
          return isVesselDataview && !hasTrackDatasetConfig
        })
        const vesselDataviewsWithTrack = vesselDataviewsWithoutTrack.flatMap((dataviewInstance) => {
          const infoDatasetConfig = dataviewInstance?.datasetsConfig?.find(
            (dsc) => dsc.endpoint === EndpointId.Vessel
          )
          const infoDataset = datasets.find((d) => d.id === infoDatasetConfig?.datasetId) as Dataset
          const trackDatasetId = infoDataset?.relatedDatasets?.find(
            (rld) => rld.type === DatasetTypes.Tracks
          )?.id
          if (trackDatasetId) {
            const vesselId = infoDatasetConfig?.params.find((p) => p.id === 'vesselId')
              ?.value as string
            const trackDatasetConfig = getVesselDataviewInstanceDatasetConfig(vesselId, {
              track: trackDatasetId,
            })
            return {
              id: dataviewInstance.id,
              datasetsConfig: [...(dataviewInstance.datasetsConfig || []), ...trackDatasetConfig],
            } as UrlDataviewInstance
          }
          return []
        })
        // Update the dataviewInstances with the track config in case it was found
        if (vesselDataviewsWithTrack?.length) {
          const dataviewInstancesToUpsert = mergeDataviewIntancesToUpsert(
            vesselDataviewsWithTrack,
            urlDataviewInstances
          )
          dispatch(updateQueryParam({ dataviewInstances: dataviewInstancesToUpsert }))
        }

        if (error) {
          console.warn(error)
          return rejectWithValue({ workspace, error: datasets })
        }
      }

      const daysFromLatest =
        selectDaysFromLatest(state) || workspace?.state?.daysFromLatest || undefined
      const latestDatasetEndDate = getLatestEndDateFromDatasets(datasets, DatasetCategory.Activity)
      const endAt =
        daysFromLatest !== undefined
          ? getUTCDateTime(latestDatasetEndDate)
          : getUTCDateTime(workspace?.endAt || DEFAULT_TIME_RANGE.end)
      const startAt =
        daysFromLatest !== undefined
          ? endAt.minus({ days: daysFromLatest })
          : getUTCDateTime(workspace?.startAt || DEFAULT_TIME_RANGE.start)

      return { ...workspace, startAt: startAt.toISO(), endAt: endAt.toISO() }
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue({ error: parseAPIError(e) })
    }
  },
  {
    condition: (workspaceId, { getState }) => {
      const workspaceStatus = selectWorkspaceStatus(getState() as any)
      // Fetched already in progress, don't need to re-fetch
      return workspaceStatus !== AsyncReducerStatus.Loading
    },
  }
)

const parseUpsertWorkspace = (workspace: AppWorkspace): WorkspaceUpsert<WorkspaceState> => {
  const { id, ownerId, createdAt, ownerType, ...restWorkspace } = workspace
  return restWorkspace
}

export const saveWorkspaceThunk = createAsyncThunk(
  'workspace/saveCurrent',
  async (
    {
      name: defaultName,
      createAsPublic,
      workspace,
    }: {
      name: string
      createAsPublic: boolean
      workspace: AppWorkspace
    },
    { dispatch, getState }
  ) => {
    const state = getState() as any
    const workspaceUpsert = parseUpsertWorkspace(workspace)

    const saveWorkspace = async (tries = 0): Promise<Workspace<WorkspaceState> | undefined> => {
      let workspaceUpdated
      if (tries < 2) {
        try {
          const name = tries > 0 ? defaultName + `_${tries}` : defaultName
          workspaceUpdated = await GFWAPI.fetch<Workspace<WorkspaceState>>(`/workspaces`, {
            method: 'POST',
            body: {
              ...workspaceUpsert,
              name,
              public: createAsPublic,
            },
          } as FetchOptions<WorkspaceUpsert<WorkspaceState>>)
        } catch (e: any) {
          // Means we already have a workspace with this name
          if (e.status === 400) {
            return await saveWorkspace(tries + 1)
          }
          console.warn('Error creating workspace', e)
          throw e
        }
        return workspaceUpdated
      }
    }

    const workspaceUpdated = await saveWorkspace()
    const locationType = selectLocationType(state)
    const locationCategory = selectLocationCategory(state) || WorkspaceCategory.FishingActivity
    if (workspaceUpdated) {
      dispatch(
        updateLocation(locationType === HOME ? WORKSPACE : locationType, {
          payload: {
            category: locationCategory,
            workspaceId: workspaceUpdated.id,
          },
          replaceQuery: true,
        })
      )
    }
    return workspaceUpdated
  }
)

export const updatedCurrentWorkspaceThunk = createAsyncThunk<
  AppWorkspace,
  AppWorkspace,
  {
    dispatch: AppDispatch
  }
>('workspace/updatedCurrent', async (workspace: AppWorkspace, { dispatch }) => {
  const workspaceUpsert = parseUpsertWorkspace(workspace)
  const workspaceUpdated = await GFWAPI.fetch<AppWorkspace>(`/workspaces/${workspace.id}`, {
    method: 'PATCH',
    body: workspaceUpsert,
  } as FetchOptions<WorkspaceUpsert<WorkspaceState>>)
  if (workspaceUpdated) {
    dispatch(cleanQueryLocation())
  }
  return workspaceUpdated
})

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    resetWorkspaceSlice: (state) => {
      state.status = AsyncReducerStatus.Idle
      state.customStatus = AsyncReducerStatus.Idle
      state.data = null
      state.error = {}
    },
    cleanCurrentWorkspaceData: (state) => {
      state.data = null
    },
    setLastWorkspaceVisited: (state, action: PayloadAction<LastWorkspaceVisited | undefined>) => {
      state.lastVisited = action.payload
    },
    removeGFWStaffOnlyDataviews: (state) => {
      if (ONLY_GFW_STAFF_DATAVIEW_SLUGS.length && state.data?.dataviewInstances) {
        state.data.dataviewInstances = state.data.dataviewInstances.filter((d) =>
          ONLY_GFW_STAFF_DATAVIEW_SLUGS.includes(d.dataviewId as string)
        )
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWorkspaceThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchWorkspaceThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      const payload = action.payload as any
      if (payload) {
        state.data = payload
      }
    })
    builder.addCase(fetchWorkspaceThunk.rejected, (state, action) => {
      if (action.payload) {
        const { workspace, error } = action.payload as RejectedActionPayload
        state.status = AsyncReducerStatus.Error
        if (workspace) {
          state.data = workspace
        }
        if (error) {
          state.error = error
        }
      } else {
        // This means action was cancelled
        state.status = AsyncReducerStatus.Idle
      }
    })
    builder.addCase(saveWorkspaceThunk.pending, (state) => {
      state.customStatus = AsyncReducerStatus.Loading
    })
    builder.addCase(saveWorkspaceThunk.fulfilled, (state, action) => {
      state.customStatus = AsyncReducerStatus.Finished
      if (action.payload) {
        state.data = action.payload
      }
    })
    builder.addCase(saveWorkspaceThunk.rejected, (state) => {
      state.customStatus = AsyncReducerStatus.Error
    })
    builder.addCase(updatedCurrentWorkspaceThunk.pending, (state) => {
      state.customStatus = AsyncReducerStatus.Loading
    })
    builder.addCase(updatedCurrentWorkspaceThunk.fulfilled, (state, action) => {
      state.customStatus = AsyncReducerStatus.Finished
      if (action.payload) {
        state.data = action.payload
      }
    })
    builder.addCase(updatedCurrentWorkspaceThunk.rejected, (state) => {
      state.customStatus = AsyncReducerStatus.Error
    })
  },
})

export const {
  resetWorkspaceSlice,
  setLastWorkspaceVisited,
  cleanCurrentWorkspaceData,
  removeGFWStaffOnlyDataviews,
} = workspaceSlice.actions

export default workspaceSlice.reducer
