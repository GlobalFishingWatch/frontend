import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice, isRejected } from '@reduxjs/toolkit'
import { uniq } from 'es-toolkit'
import { castDraft } from 'immer'

import type { FetchOptions } from '@globalfishingwatch/api-client'
import { GFWAPI, parseAPIError } from '@globalfishingwatch/api-client'
import type {
  Dataset,
  Dataview,
  DataviewInstance,
  Workspace,
  WorkspaceEditAccessType,
  WorkspaceUpsert,
  WorkspaceViewAccessType,
} from '@globalfishingwatch/api-types'
import {
  DatasetCategory,
  DatasetTypes,
  DataviewCategory,
  EndpointId,
} from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { parseLegacyDataviewInstanceConfig } from '@globalfishingwatch/dataviews-client'

import type { VALID_PASSWORD } from 'data/config'
import { DEFAULT_TIME_RANGE, IS_RANDOM_FOREST_ENABLED, PRIVATE_SUFIX } from 'data/config'
import { LIBRARY_LAYERS } from 'data/layer-library'
import {
  DEFAULT_DATAVIEW_SLUGS,
  DEFAULT_WORKSPACE_ID,
  getWorkspaceEnv,
  ONLY_GFW_STAFF_DATAVIEW_SLUGS,
} from 'data/workspaces'
import { VMS_VESSEL_DATAVIEW_SLUGS } from 'data/workspaces-vms'
import { fetchDatasetsByIdsThunk } from 'features/datasets/datasets.slice'
import {
  getDatasetsInDataviews,
  getLatestEndDateFromDatasets,
  getVesselGroupsInDataviews,
} from 'features/datasets/datasets.utils'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import { getVesselDataviewInstanceDatasetConfig } from 'features/dataviews/dataviews.utils'
import { fetchReportsThunk } from 'features/reports/reports.slice'
import { selectPrivateUserGroups } from 'features/user/selectors/user.groups.selectors'
import { selectIsGFWUser, selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { PRIVATE_SEARCH_DATASET_BY_GROUP } from 'features/user/user.config'
import { RF_VESSEL_IDENTITY_ID } from 'features/vessel/vessel.config'
import { fetchVesselGroupsThunk } from 'features/vessel-groups/vessel-groups.slice'
import { mergeDataviewIntancesToUpsert } from 'features/workspace/workspace.hook'
import type { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import { HOME, REPORT } from 'router/routes'
import {
  selectLocationType,
  selectReportId,
  selectUrlDataviewInstances,
} from 'router/routes.selectors'
import type { LinkTo } from 'router/routes.types'
import type { AppDispatch } from 'store'
import type { AnyWorkspaceState, WorkspaceState } from 'types'
import type { AsyncError } from 'utils/async-slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { getUTCDateTime } from 'utils/dates'

import {
  selectCurrentWorkspaceId,
  selectDaysFromLatest,
  selectWorkspace,
  selectWorkspaceRefreshStatus,
  selectWorkspaceStatus,
} from './workspace.selectors'
import { cleanReportQuery, parseUpsertWorkspace } from './workspace.utils'

/**
 * History navigation entry stored in TanStack Router format.
 * No conversion needed when navigating back - use directly with Link or useRouter().navigate().
 */
export type LastWorkspaceVisited = LinkTo & {
  pathname?: string
}

const MAX_HISTORY_NAVIGATION = 20

interface WorkspaceSliceState {
  status: AsyncReducerStatus
  refreshStatus: AsyncReducerStatus
  suggestSave: boolean
  // used to identify when someone saves its own version of the workspace
  customStatus: AsyncReducerStatus
  error: AsyncError
  data: Workspace<AnyWorkspaceState> | null
  reportId: string | null
  password: string | typeof VALID_PASSWORD
  historyNavigation: LastWorkspaceVisited[]
}

const initialState: WorkspaceSliceState = {
  status: AsyncReducerStatus.Idle,
  refreshStatus: AsyncReducerStatus.Idle,
  suggestSave: false,
  customStatus: AsyncReducerStatus.Idle,
  error: {} as AsyncError,
  data: null,
  reportId: null,
  password: '',
  historyNavigation: [],
}

type RejectedActionPayload = {
  workspace: Workspace<WorkspaceState>
  error: AsyncError
}

const workspaceModules = import.meta.glob<{ default: AppWorkspace }>(
  '../../data/default-workspaces/workspace.*.ts'
)

export const getDefaultWorkspace = async (): Promise<AppWorkspace> => {
  const workspaceEnv = getWorkspaceEnv()
  const loader =
    workspaceModules[`../../data/default-workspaces/workspace.${workspaceEnv}.ts`] ??
    workspaceModules['../../data/default-workspaces/workspace.production.ts']!
  const mod = await loader()
  return mod.default
}

export type FetchWorkspacesThunkParams = {
  workspaceId: string
  password?: string
  reportId?: string
  isRefresh?: boolean
}

export const fetchWorkspaceThunk = createAsyncThunk(
  'workspace/fetch',
  async (
    {
      workspaceId,
      password,
      reportId: reportIdParam,
      isRefresh = false,
    }: FetchWorkspacesThunkParams,
    { signal, dispatch, getState, rejectWithValue }: any
  ) => {
    const state = getState() as any
    const locationType = selectLocationType(state)
    const urlDataviewInstances = selectUrlDataviewInstances(state)
    const guestUser = selectIsGuestUser(state)
    const gfwUser = selectIsGFWUser(state)
    const currentWorkspace = selectWorkspace(state)
    const privateUserGroups = selectPrivateUserGroups(state)
    const reportId = reportIdParam || selectReportId(state)
    let workspaceReportId = null
    let dataviewInstancesToUpsert: UrlDataviewInstance[] | undefined

    try {
      let workspace: Workspace<any> | null = isRefresh ? currentWorkspace : null
      if (!workspace) {
        if (locationType === REPORT) {
          const action = dispatch(fetchReportsThunk([reportId as string]))
          const resolvedAction = await action
          if (fetchReportsThunk.fulfilled.match(resolvedAction)) {
            workspace = resolvedAction.payload?.[0]?.workspace as Workspace
            workspaceReportId = resolvedAction.payload?.[0]?.id
            if (!workspace) {
              return rejectWithValue({
                error: {
                  status: 404,
                  message: 'Report workspace not found',
                },
              })
            }
          } else {
            if (resolvedAction.payload?.status === 401) {
              return rejectWithValue({ error: { status: 401, message: 'Private report' } })
            }
            if (!isRejected(resolvedAction)) {
              throw new Error('Error fetching report')
            }
          }
          // TODO fetch report and use the workspace within it
        } else if (workspaceId && workspaceId !== DEFAULT_WORKSPACE_ID) {
          workspace = await GFWAPI.fetch<Workspace<WorkspaceState>>(`/workspaces/${workspaceId}`, {
            signal,
            ...(password && {
              headers: {
                'x-workspace-password': password,
              },
            }),
          })
        }
        if ((!workspace && locationType === HOME) || workspaceId === DEFAULT_WORKSPACE_ID) {
          workspace = await getDefaultWorkspace()
          if (workspace.id.includes(PRIVATE_SUFIX) && guestUser) {
            return rejectWithValue({ error: { status: 401, message: 'Private workspace' } })
          }
        }

        if (workspace) {
          workspace = {
            ...workspace,
            dataviewInstances: (workspace?.dataviewInstances || []).map(
              (dv) => parseLegacyDataviewInstanceConfig(dv) as DataviewInstance
            ),
          }
        }
      }

      const dataviewIds = [
        // Load extra dataviews here when needed for gfwUsers
        ...DEFAULT_DATAVIEW_SLUGS,
        ...(workspace?.dataviewInstances || []).map(({ dataviewId }) => dataviewId as string),
        ...(urlDataviewInstances || []).flatMap(({ dataviewId }) => (dataviewId as string) || []),
      ].filter(Boolean)

      if (gfwUser && ONLY_GFW_STAFF_DATAVIEW_SLUGS.length) {
        // Inject dataviews for gfw staff only
        dataviewIds.push(...ONLY_GFW_STAFF_DATAVIEW_SLUGS)
      } else if (privateUserGroups.length) {
        const vmsDataviewSlugs = privateUserGroups
          .map((group) => VMS_VESSEL_DATAVIEW_SLUGS[group])
          .filter(Boolean) as string[]
        if (vmsDataviewSlugs.length) {
          dataviewIds.push(...vmsDataviewSlugs)
        }
      }

      const uniqDataviewIds = uniq(dataviewIds)

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
          // Load dataviews from layer library
          ...LIBRARY_LAYERS,
        ]
        const datasetsIds = getDatasetsInDataviews(dataviews, dataviewInstances, guestUser)
        if (IS_RANDOM_FOREST_ENABLED) {
          datasetsIds.push(RF_VESSEL_IDENTITY_ID)
        }
        const vesselGroupsIds = getVesselGroupsInDataviews(
          [...dataviews, ...dataviewInstances],
          guestUser
        )

        if (vesselGroupsIds?.length) {
          dispatch(fetchVesselGroupsThunk({ ids: vesselGroupsIds }))
        }
        const fetchDatasetsAction: any = dispatch(fetchDatasetsByIdsThunk({ ids: datasetsIds }))
        // Don't abort datasets as they are needed in the search
        // signal.addEventListener('abort', fetchDatasetsAction.abort)
        const { error, payload } = await fetchDatasetsAction
        if (error) {
          console.warn(error)
          return rejectWithValue({ workspace, error: payload })
        } else {
          datasets = payload as Dataset[]
        }

        if (privateUserGroups.length) {
          try {
            const privateDatasets = privateUserGroups.flatMap((group) => {
              return PRIVATE_SEARCH_DATASET_BY_GROUP[group] || []
            })

            await dispatch(fetchDatasetsByIdsThunk({ ids: privateDatasets }))
          } catch (e) {
            console.warn('Error fetching private datasets for search within user groups', e)
          }
        }

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
        // Compute the dataviewInstances with the track config to be upserted by the caller
        if (vesselDataviewsWithTrack?.length) {
          dataviewInstancesToUpsert = mergeDataviewIntancesToUpsert(
            vesselDataviewsWithTrack,
            urlDataviewInstances
          )
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
      const migratedWorkspace = {
        ...workspace,
        dataviewInstances: workspace?.dataviewInstances.map(parseLegacyDataviewInstanceConfig),
      }

      return {
        ...migratedWorkspace,
        startAt: startAt.toISO(),
        endAt: endAt.toISO(),
        workspaceReportId,
        dataviewInstancesToUpsert,
      }
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue({ error: parseAPIError(e) })
    }
  },
  {
    condition: ({ workspaceId, isRefresh }, { getState }) => {
      const rootState = getState() as any
      const workspaceRefreshStatus = selectWorkspaceRefreshStatus(rootState)
      if (isRefresh) {
        return workspaceRefreshStatus !== AsyncReducerStatus.Loading
      }
      const workspaceStatus = selectWorkspaceStatus(rootState)
      const isLoading = workspaceStatus === AsyncReducerStatus.Loading
      if (!workspaceId || workspaceId === DEFAULT_WORKSPACE_ID) {
        const currentWorkspaceId = selectCurrentWorkspaceId(rootState)
        return DEFAULT_WORKSPACE_ID !== currentWorkspaceId && !isLoading
      }
      // Fetched already in progress, don't need to re-fetch
      return !isLoading
    },
  }
)

type SaveWorkspaceThunkProperties = {
  name: string
  description?: string
  password?: string
  createAsPublic: boolean
  daysFromLatest?: number
  viewAccess: WorkspaceViewAccessType
  editAccess: WorkspaceEditAccessType
}

export const saveWorkspaceThunk = createAsyncThunk(
  'workspace/saveCurrent',
  async (
    {
      properties,
      workspace,
    }: {
      properties: SaveWorkspaceThunkProperties
      workspace: AppWorkspace
    },
    { getState }
  ) => {
    const state = getState() as any
    const workspaceUpsert = parseUpsertWorkspace(workspace)
    const {
      name: defaultName,
      description = '',
      daysFromLatest,
      createAsPublic,
      viewAccess,
      editAccess,
      password,
    } = properties

    const saveWorkspace = async (tries = 0): Promise<Workspace<WorkspaceState> | undefined> => {
      let workspaceUpdated
      if (tries < 4) {
        try {
          const name = tries > 0 ? defaultName + `_${tries}` : defaultName
          workspaceUpdated = await GFWAPI.fetch<Workspace<WorkspaceState>>(`/workspaces`, {
            method: 'POST',
            body: {
              ...workspaceUpsert,
              name,
              description,
              viewAccess,
              editAccess,
              password,
              public: createAsPublic,
              state: {
                ...workspaceUpsert.state,
                daysFromLatest,
              },
            },
          } as FetchOptions<WorkspaceUpsert<WorkspaceState>>)
        } catch (e: any) {
          // Means we already have a workspace with this name
          if (e.status === 422 && e.message.includes('duplicated')) {
            return await saveWorkspace(tries + 1)
          }
          console.warn('Error creating workspace', e)
          throw e
        }
        return workspaceUpdated
      }
    }

    const workspaceUpdated = await saveWorkspace()
    return workspaceUpdated
  }
)

export type UpdateWorkspaceThunkRejectError = AsyncError & {
  isWorkspaceWrongPassword: boolean
}

export type UpdateCurrentWorkspaceThunkParams = Omit<AppWorkspace, 'editAccess'> & {
  editPassword?: string
  newPassword?: string
  editAccess?: WorkspaceEditAccessType | undefined
}

export const updateCurrentWorkspaceThunk = createAsyncThunk<
  AppWorkspace,
  UpdateCurrentWorkspaceThunkParams,
  {
    dispatch: AppDispatch
    rejectValue: UpdateWorkspaceThunkRejectError
  }
>('workspace/updatedCurrent', async (workspaceWithPassword, { rejectWithValue }) => {
  try {
    const { editPassword, newPassword, ...workspace } = workspaceWithPassword
    const password = newPassword || editPassword || 'default'
    const body = {
      ...parseUpsertWorkspace(workspace),
      ...(newPassword && { password: newPassword }),
    }
    const workspaceUpdated = await GFWAPI.fetch<AppWorkspace>(`/workspaces/${workspace.id}`, {
      method: 'PATCH',
      body,
      ...(password && {
        headers: {
          'x-workspace-password': password,
        },
      }),
    } as FetchOptions<WorkspaceUpsert<WorkspaceState>>)
    if (!workspaceUpdated) {
      return rejectWithValue({
        status: 500,
        message: 'Workspace update failed',
        isWorkspaceWrongPassword: false,
      })
    }
    return workspaceUpdated
  } catch (e: any) {
    const error = parseAPIError(e)
    return rejectWithValue({ ...error, isWorkspaceWrongPassword: error.status === 401 })
  }
})

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setWorkspace: (state, action: PayloadAction<Workspace<AnyWorkspaceState>>) => {
      if (action.payload && Object.keys(action.payload).length) {
        state.data = castDraft(action.payload)
      }
    },
    setWorkspaceProperty: (
      state,
      action: PayloadAction<{ key: keyof Workspace<WorkspaceState, string>; value: string }>
    ) => {
      const { key, value } = action.payload
      if (state.data && state.data[key]) {
        ;(state.data as any)[key] = value
      }
    },
    setWorkspacePassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload
    },
    setWorkspaceSuggestSave: (state, action: PayloadAction<boolean>) => {
      state.suggestSave = action.payload
    },
    resetWorkspaceSlice: (state) => {
      state.status = initialState.status
      state.customStatus = initialState.customStatus
      state.password = initialState.password
      state.data = castDraft(initialState.data)
      state.error = initialState.error
    },
    cleanCurrentWorkspaceData: (state) => {
      state.data = null
    },
    cleanCurrentWorkspaceReportState: (state) => {
      if (state.data?.state) {
        state.data.state = castDraft(cleanReportQuery(state.data.state))
      }
    },
    cleanCurrentWorkspaceStateBufferParams: (state) => {
      if (state.data?.state) {
        state.data.state.reportBufferUnit = undefined
        state.data.state.reportBufferValue = undefined
        state.data.state.reportBufferOperation = undefined
      }
    },
    setWorkspaceHistoryNavigation: (state, action: PayloadAction<LastWorkspaceVisited[]>) => {
      const next = action.payload
      state.historyNavigation = castDraft(
        next.length > MAX_HISTORY_NAVIGATION ? next.slice(-MAX_HISTORY_NAVIGATION) : next
      )
    },
    resetWorkspaceHistoryNavigation: (state) => {
      state.historyNavigation = castDraft(initialState.historyNavigation)
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
    builder.addCase(fetchWorkspaceThunk.pending, (state, action) => {
      const { isRefresh } = action.meta.arg
      state.status = isRefresh ? state.status : AsyncReducerStatus.Loading
      state.refreshStatus = isRefresh ? AsyncReducerStatus.Loading : state.refreshStatus
    })
    builder.addCase(fetchWorkspaceThunk.fulfilled, (state, action) => {
      const { isRefresh } = action.meta.arg
      state.status = AsyncReducerStatus.Finished
      state.refreshStatus = isRefresh ? AsyncReducerStatus.Finished : state.refreshStatus
      const { workspaceReportId, dataviewInstancesToUpsert: _, ...data } = action.payload
      if (data) {
        state.data = data
      }
      state.reportId = workspaceReportId
    })
    builder.addCase(fetchWorkspaceThunk.rejected, (state, action) => {
      const { isRefresh } = action.meta.arg
      if (action.payload) {
        const { workspace, error } = action.payload as RejectedActionPayload
        state.status = AsyncReducerStatus.Error
        state.refreshStatus = isRefresh ? AsyncReducerStatus.Error : state.refreshStatus
        if (workspace) {
          state.data = castDraft(workspace)
        }
        if (error) {
          state.error = error
        }
      } else {
        const cancelledStatus = state.data ? AsyncReducerStatus.Finished : AsyncReducerStatus.Idle
        state.status = cancelledStatus
        state.refreshStatus = isRefresh ? cancelledStatus : state.refreshStatus
      }
    })
    builder.addCase(saveWorkspaceThunk.pending, (state) => {
      state.customStatus = AsyncReducerStatus.Loading
    })
    builder.addCase(saveWorkspaceThunk.fulfilled, (state, action) => {
      state.customStatus = AsyncReducerStatus.Finished
      if (action.payload) {
        state.data = castDraft(action.payload)
      }
    })
    builder.addCase(saveWorkspaceThunk.rejected, (state) => {
      state.customStatus = AsyncReducerStatus.Error
    })
    builder.addCase(updateCurrentWorkspaceThunk.pending, (state) => {
      state.customStatus = AsyncReducerStatus.Loading
    })
    builder.addCase(updateCurrentWorkspaceThunk.fulfilled, (state, action) => {
      state.customStatus = AsyncReducerStatus.Finished
      if (action.payload) {
        state.data = castDraft(action.payload)
      }
    })
    builder.addCase(updateCurrentWorkspaceThunk.rejected, (state) => {
      state.customStatus = AsyncReducerStatus.Error
    })
  },
})

export const {
  setWorkspace,
  setWorkspaceProperty,
  setWorkspacePassword,
  setWorkspaceSuggestSave,
  resetWorkspaceSlice,
  cleanCurrentWorkspaceData,
  removeGFWStaffOnlyDataviews,
  cleanCurrentWorkspaceReportState,
  cleanCurrentWorkspaceStateBufferParams,
  setWorkspaceHistoryNavigation,
  resetWorkspaceHistoryNavigation,
} = workspaceSlice.actions

export default workspaceSlice.reducer
