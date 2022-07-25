import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { uniq } from 'lodash'
import { DateTime } from 'luxon'
import {
  Workspace,
  Dataview,
  WorkspaceUpsert,
  DataviewInstance,
} from '@globalfishingwatch/api-types'
import { GFWAPI, FetchOptions, parseAPIError } from '@globalfishingwatch/api-client'
import { parseLegacyDataviewInstanceEndpoint } from '@globalfishingwatch/dataviews-client'
import { DEFAULT_TIME_RANGE } from 'data/config'
import { WorkspaceState } from 'types'
import { RootState } from 'store'
import { fetchDatasetsByIdsThunk } from 'features/datasets/datasets.slice'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import {
  selectLocationCategory,
  selectLocationType,
  selectUrlDataviewInstances,
} from 'routes/routes.selectors'
import { HOME, WORKSPACE } from 'routes/routes'
import { cleanQueryLocation, updateLocation } from 'routes/routes.actions'
import { selectDaysFromLatest } from 'features/app/app.selectors'
import {
  DEFAULT_DATAVIEW_IDS,
  getWorkspaceEnv,
  VESSEL_PRESENCE_DATAVIEW_ID,
  WorkspaceCategories,
} from 'data/workspaces'
import { AsyncReducerStatus, AsyncError } from 'utils/async-slice'
import { getDatasetsInDataviews } from 'features/datasets/datasets.utils'
import { isGFWUser, isGuestUser } from 'features/user/user.slice'
import { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import { selectWorkspaceStatus } from './workspace.selectors'

type LastWorkspaceVisited = { type: string; payload: any; query: any }

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
  async (workspaceId: string, { signal, dispatch, getState, rejectWithValue }) => {
    const state = getState() as RootState
    const locationType = selectLocationType(state)
    const urlDataviewInstances = selectUrlDataviewInstances(state)
    const guestUser = isGuestUser(state)
    const gfwUser = isGFWUser(state)

    try {
      let workspace = workspaceId
        ? await GFWAPI.fetch<Workspace<WorkspaceState>>(
          `/workspaces/${workspaceId}`,
          {
            signal,
          }
        )
        : null
      if (!workspace && locationType === HOME) {
        workspace = await getDefaultWorkspace()
      }

      if (workspace) {
        workspace = {
          ...workspace,
          dataviewInstances: (workspace.dataviewInstances || []).map(
            (dv) => parseLegacyDataviewInstanceEndpoint(dv) as DataviewInstance
          ),
        }
      } else {
        return
      }

      const daysFromLatest =
        selectDaysFromLatest(state) || workspace.state?.daysFromLatest || undefined
      const endAt =
        daysFromLatest !== undefined
          ? DateTime.fromISO(DEFAULT_TIME_RANGE.end).toUTC()
          : DateTime.fromISO(workspace.endAt).toUTC()
      const startAt =
        daysFromLatest !== undefined
          ? endAt.minus({ days: daysFromLatest })
          : DateTime.fromISO(workspace.startAt).toUTC()

      const defaultWorkspaceDataviews = gfwUser
        ? [...DEFAULT_DATAVIEW_IDS, VESSEL_PRESENCE_DATAVIEW_ID] // Only for gfw users as includes the private-global-presence-tracks dataset
        : DEFAULT_DATAVIEW_IDS

      const dataviewIds = [
        ...defaultWorkspaceDataviews,
        ...(workspace.dataviewInstances || []).map(({ dataviewId }) => dataviewId),
        ...(urlDataviewInstances || []).map(({ dataviewId }) => dataviewId as number),
      ].filter(Boolean)

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

      if (!signal.aborted) {
        const dataviewInstances = [
          ...dataviews,
          ...(workspace.dataviewInstances || []),
          ...(urlDataviewInstances || []),
        ]
        const datasets = getDatasetsInDataviews(dataviewInstances, guestUser)
        const fetchDatasetsAction: any = dispatch(fetchDatasetsByIdsThunk(datasets))
        signal.addEventListener('abort', fetchDatasetsAction.abort)
        const { error, payload } = await fetchDatasetsAction
        if (error) {
          console.warn(error)
          return rejectWithValue({ workspace, error: payload })
        }
      }

      return { ...workspace, startAt: startAt.toISO(), endAt: endAt.toISO() }
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue({ error: parseAPIError(e) })
    }
  },
  {
    condition: (workspaceId, { getState }) => {
      const workspaceStatus = selectWorkspaceStatus(getState() as RootState)
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
      workspace?: AppWorkspace
    },
    { dispatch, getState }
  ) => {
    const state = getState() as RootState
    const workspaceUpsert = parseUpsertWorkspace(workspace)

    const saveWorkspace = async (tries = 0): Promise<Workspace<WorkspaceState> | undefined> => {
      let workspaceUpdated
      if (tries < 2) {
        try {
          const name = tries > 0 ? defaultName + `_${tries}` : defaultName
          workspaceUpdated = await GFWAPI.fetch<Workspace<WorkspaceState>>(
            `/workspaces`,
            {
              method: 'POST',
              body: {
                ...workspaceUpsert,
                name,
                public: createAsPublic,
              },
            } as FetchOptions<WorkspaceUpsert<WorkspaceState>>
          )
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
    const locationCategory = selectLocationCategory(state) || WorkspaceCategories.FishingActivity
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

export const updatedCurrentWorkspaceThunk = createAsyncThunk(
  'workspace/updatedCurrent',
  async (workspace: AppWorkspace, { dispatch }) => {
    const workspaceUpsert = parseUpsertWorkspace(workspace)

    const workspaceUpdated = await GFWAPI.fetch<Workspace<WorkspaceState>>(
      `/workspaces/${workspace.id}`,
      {
        method: 'PATCH',
        body: workspaceUpsert,
      } as FetchOptions<WorkspaceUpsert<WorkspaceState>>
    )
    if (workspaceUpdated) {
      dispatch(cleanQueryLocation())
    }
    return workspaceUpdated
  }
)

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    cleanCurrentWorkspaceData: (state) => {
      state.data = null
    },
    setLastWorkspaceVisited: (state, action: PayloadAction<LastWorkspaceVisited | undefined>) => {
      state.lastVisited = action.payload
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

export const { setLastWorkspaceVisited, cleanCurrentWorkspaceData } = workspaceSlice.actions

export default workspaceSlice.reducer
