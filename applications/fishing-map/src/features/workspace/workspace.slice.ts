import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import uniq from 'lodash/uniq'
import {
  Workspace,
  Dataview,
  DataviewInstance,
  WorkspaceUpsert,
} from '@globalfishingwatch/api-types'
import GFWAPI, { FetchOptions } from '@globalfishingwatch/api-client'
import { UrlDataviewInstance, WorkspaceState } from 'types'
import { RootState } from 'store'
import { fetchDatasetsByIdsThunk } from 'features/datasets/datasets.slice'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import {
  selectLocationCategory,
  selectLocationType,
  selectUrlDataviewInstances,
  selectVersion,
} from 'routes/routes.selectors'
import { WORKSPACE, HOME } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import { selectCustomWorkspace } from 'features/app/app.selectors'
import { getWorkspaceEnv, WorkspaceCategories } from 'data/workspaces'
import { AsyncReducerStatus, AsyncError } from 'utils/async-slice'
import { selectWorkspaceStatus } from './workspace.selectors'

interface WorkspaceSliceState {
  status: AsyncReducerStatus
  error: AsyncError
  data: Workspace<WorkspaceState> | null
  // used to identify when someone shared its own version of the workspace
  custom: boolean
}

const initialState: WorkspaceSliceState = {
  status: AsyncReducerStatus.Idle,
  error: {},
  data: null,
  custom: false,
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
  return workspace as Promise<Workspace<WorkspaceState>>
}

export const getDatasetByDataview = (
  dataviews: (Dataview | DataviewInstance | UrlDataviewInstance)[]
) => {
  return uniq(
    dataviews?.flatMap((dataviews) => {
      if (!dataviews.datasetsConfig) return []
      return dataviews.datasetsConfig.map(({ datasetId }) => datasetId)
    })
  )
}

export const fetchWorkspaceThunk = createAsyncThunk(
  'workspace/fetch',
  async (workspaceId: string, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as RootState
    const version = selectVersion(state)
    const locationType = selectLocationType(state)
    const urlDataviewInstances = selectUrlDataviewInstances(state)

    try {
      let workspace = workspaceId
        ? await GFWAPI.fetch<Workspace<WorkspaceState>>(`/${version}/workspaces/${workspaceId}`)
        : null
      if (!workspace && locationType === HOME) {
        workspace = await getDefaultWorkspace()
      }

      if (!workspace) {
        return
      }
      const dataviewIds = [
        ...(workspace.dataviews?.map(({ id }) => id as number) || []),
        ...uniq(workspace.dataviewInstances?.map(({ dataviewId }) => dataviewId)),
      ]

      let dataviews = []
      if (dataviewIds?.length) {
        const { payload }: any = await dispatch(fetchDataviewsByIdsThunk(dataviewIds))
        if (payload?.length) {
          dataviews = payload
        }
      }
      const dataviewIntances = [
        ...dataviews,
        ...(workspace.dataviewInstances || []),
        ...(urlDataviewInstances || []),
      ]

      const datasets = getDatasetByDataview(dataviewIntances)

      const { error, payload }: any = await dispatch(fetchDatasetsByIdsThunk(datasets))
      if (error) {
        return rejectWithValue({ workspace, error: payload })
      }

      const locationCategory = selectLocationCategory(state)
      if (workspace.viewport && locationType !== HOME) {
        dispatch(
          updateLocation(locationType, {
            payload: { category: locationCategory, workspaceId: workspace.id },
            query: { ...workspace.viewport },
            replaceQuery: true,
          })
        )
      }
      return workspace
    } catch (e) {
      return rejectWithValue({ error: e as AsyncError })
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

export const saveCurrentWorkspaceThunk = createAsyncThunk(
  'workspace/saveCurrent',
  async (defaultName: string, { dispatch, getState }) => {
    const state = getState() as RootState
    const mergedWorkspace = selectCustomWorkspace(state)

    const saveWorkspace = async (tries = 0): Promise<Workspace<WorkspaceState> | undefined> => {
      let workspaceUpdated
      try {
        const version = selectVersion(state)
        const name = tries > 0 ? defaultName + `_${tries}` : defaultName
        workspaceUpdated = await GFWAPI.fetch<Workspace<WorkspaceState>>(`/${version}/workspaces`, {
          method: 'POST',
          body: { ...mergedWorkspace, name },
        } as FetchOptions<WorkspaceUpsert<WorkspaceState>>)
      } catch (e) {
        // Means we already have a workspace with this name
        if (e.status === 400) {
          return await saveWorkspace(tries + 1)
        }
        throw e
      }
      return workspaceUpdated
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
          query: {
            latitude: workspaceUpdated.viewport.latitude,
            longitude: workspaceUpdated.viewport.longitude,
            zoom: workspaceUpdated.viewport.zoom,
          },
          replaceQuery: true,
        })
      )
    }
    return workspaceUpdated
  }
)

export const updateWorkspaceNameThunk = createAsyncThunk<
  Workspace,
  Partial<Workspace>,
  {
    rejectValue: AsyncError
  }
>(
  'workspaces/update',
  async (partialWorkspace, { rejectWithValue }) => {
    try {
      const updatedWorkspace = await GFWAPI.fetch<Workspace>(
        `/v1/workspaces/${partialWorkspace.id}`,
        {
          method: 'PATCH',
          body: { name: partialWorkspace.name } as any,
        }
      )
      return updatedWorkspace
    } catch (e) {
      return rejectWithValue({ status: e.status || e.code, message: e.message })
    }
  },
  {
    condition: (partialWorkspace) => {
      if (!partialWorkspace || !partialWorkspace.id) {
        console.warn('To update the workspace you need the id')
        return false
      }
    },
  }
)

export const deleteWorkspaceThunk = createAsyncThunk<
  Workspace,
  string,
  {
    rejectValue: AsyncError
  }
>('workspaces/delete', async (id: string, { rejectWithValue }) => {
  try {
    const workspace = await GFWAPI.fetch<Workspace>(`/v1/workspaces/${id}`, {
      method: 'DELETE',
    })
    return { ...workspace, id }
  } catch (e) {
    return rejectWithValue({ status: e.status || e.code, message: e.message })
  }
})

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    resetWorkspaceSearchQuery(state) {
      if (state.data?.state) {
        state.data.state.query = undefined
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWorkspaceThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchWorkspaceThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      if (action.payload) {
        state.data = action.payload
      }
    })
    builder.addCase(fetchWorkspaceThunk.rejected, (state, action) => {
      const { workspace, error } = action.payload as RejectedActionPayload
      state.status = AsyncReducerStatus.Error
      if (workspace) {
        state.data = workspace
      }
      if (error) {
        state.error = error
      }
    })
    builder.addCase(saveCurrentWorkspaceThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
      state.custom = true
    })
    builder.addCase(saveCurrentWorkspaceThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      if (action.payload) {
        state.data = action.payload
      }
      state.custom = false
    })
    builder.addCase(saveCurrentWorkspaceThunk.rejected, (state) => {
      state.status = AsyncReducerStatus.Finished
      state.custom = false
    })
    builder.addCase(updateWorkspaceNameThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
      state.custom = true
    })
    builder.addCase(updateWorkspaceNameThunk.fulfilled, (state) => {
      state.status = AsyncReducerStatus.Finished
      state.custom = false
    })
    builder.addCase(updateWorkspaceNameThunk.rejected, (state) => {
      state.status = AsyncReducerStatus.Finished
      state.custom = false
    })
  },
})

export const { resetWorkspaceSearchQuery } = workspaceSlice.actions

export default workspaceSlice.reducer
