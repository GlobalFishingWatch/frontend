import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import uniq from 'lodash/uniq'
import {
  Workspace,
  Dataview,
  DataviewInstance,
  WorkspaceUpsert,
} from '@globalfishingwatch/api-types'
import GFWAPI, { FetchOptions } from '@globalfishingwatch/api-client'
import { AsyncReducerStatus, WorkspaceState } from 'types'
import { RootState } from 'store'
import { fetchDatasetsByIdsThunk } from 'features/datasets/datasets.slice'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import { selectVersion } from 'routes/routes.selectors'
import { HOME } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import { selectCustomWorkspace } from 'features/app/app.selectors'

interface WorkspaceSliceState {
  status: AsyncReducerStatus
  data: Workspace<WorkspaceState> | null
  // used to identify when someone shared its own version of the workspace
  custom: boolean
}

const initialState: WorkspaceSliceState = {
  status: AsyncReducerStatus.Idle,
  data: null,
  custom: false,
}

export const getDatasetByDataview = (dataviews: (Dataview | DataviewInstance)[]) => {
  return uniq(
    dataviews?.flatMap((dataviews) => {
      if (!dataviews.datasetsConfig) return []
      return dataviews.datasetsConfig.map(({ datasetId }) => datasetId)
    })
  )
}

export const fetchWorkspaceThunk = createAsyncThunk(
  'workspace/fetch',
  async (workspaceId: number, { dispatch, getState }) => {
    const version = selectVersion(getState() as RootState)
    const workspace = workspaceId
      ? await GFWAPI.fetch<Workspace<WorkspaceState>>(`/${version}/workspaces/${workspaceId}`)
      : await import('./workspace.default').then((m) => m.default)

    const dataviews = [
      ...(workspace.dataviews?.map(({ id }) => id as number) || []),
      ...uniq(workspace.dataviewInstances?.map(({ dataviewId }) => dataviewId)),
    ]
    if (dataviews) {
      await dispatch(fetchDataviewsByIdsThunk(dataviews))
    }
    const datasets = getDatasetByDataview(workspace.dataviewInstances)
    if (datasets?.length) {
      await dispatch(fetchDatasetsByIdsThunk(datasets))
    }
    return workspace
  }
)

export const saveCurrentWorkspaceThunk = createAsyncThunk(
  'workspace/saveCurrent',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState
    const mergedWorkspace = selectCustomWorkspace(state)
    const version = selectVersion(getState() as RootState)
    const workspaceUpdated = await GFWAPI.fetch<Workspace<WorkspaceState>>(
      `/${version}/workspaces`,
      {
        method: 'POST',
        body: mergedWorkspace,
      } as FetchOptions<WorkspaceUpsert<WorkspaceState>>
    )
    dispatch(
      updateLocation(HOME, {
        payload: { workspaceId: workspaceUpdated.id },
        query: {},
        replaceQuery: true,
      })
    )
    return workspaceUpdated
  }
)

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
    builder.addCase(fetchWorkspaceThunk.rejected, (state) => {
      state.status = AsyncReducerStatus.Error
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
    })
    builder.addCase(saveCurrentWorkspaceThunk.rejected, (state) => {
      state.status = AsyncReducerStatus.Finished
      state.custom = false
    })
  },
})

export const { resetWorkspaceSearchQuery } = workspaceSlice.actions

export default workspaceSlice.reducer
