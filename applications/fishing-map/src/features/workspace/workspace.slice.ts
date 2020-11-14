import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import uniq from 'lodash/uniq'
import { Workspace, Dataview, DataviewInstance } from '@globalfishingwatch/api-types'
import GFWAPI from '@globalfishingwatch/api-client'
import { AsyncReducerStatus, QueryParams } from 'types'
import { RootState } from 'store'
import { fetchDatasetsByIdsThunk } from 'features/datasets/datasets.slice'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import { selectUrlParams, selectVersion } from 'routes/routes.selectors'
import { HOME } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'

interface WorkspaceState {
  status: AsyncReducerStatus
  data: Workspace | null
  // used to identify when someone shared its own version of the workspace
  custom: boolean
}

const initialState: WorkspaceState = {
  status: AsyncReducerStatus.Idle,
  data: null,
  custom: false,
}

export const mergeWorkspaceWithUrl = (workspace: Workspace, urlParams: QueryParams) => {
  return workspace
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
      ? await GFWAPI.fetch<Workspace>(`/${version}/workspaces/${workspaceId}`)
      : await import('./workspace.default').then((m) => m.default)

    const dataviews = uniq(workspace.dataviewInstances?.map(({ dataviewId }) => dataviewId))
    if (dataviews) {
      await dispatch(fetchDataviewsByIdsThunk(dataviews))
    }
    const datasets = [
      ...(workspace.datasets?.map(({ id }) => id as string) || []),
      ...getDatasetByDataview(workspace.dataviewInstances),
    ]
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
    const currentWorkspace = selectWorkspace(state) as Workspace
    const urlParams = selectUrlParams(state)
    const mergedWorkspace = mergeWorkspaceWithUrl(currentWorkspace, urlParams)
    console.log('mergedWorkspace', mergedWorkspace)
    // const version = selectVersion(getState() as RootState)
    // const workspaceUpdated = await GFWAPI.fetch<Workspace>(`/${version}/workspaces/`, {
    //   method: 'POST',
    // })
    const version = selectVersion(getState() as RootState)
    const workspaceUpdated = await GFWAPI.fetch<Workspace>(`/${version}/workspaces/32`)
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
    setCustomWorkspace(state, action: PayloadAction<Workspace>) {
      state.custom = true
      state.data = action.payload
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
      state.status = AsyncReducerStatus.Error
    })
  },
})

export const { setCustomWorkspace } = workspaceSlice.actions

export const selectWorkspace = (state: RootState) => state.workspace.data
export const selectWorkspaceStatus = (state: RootState) => state.workspace.status
export const selectWorkspaceCustom = (state: RootState) => state.workspace.custom

export default workspaceSlice.reducer
