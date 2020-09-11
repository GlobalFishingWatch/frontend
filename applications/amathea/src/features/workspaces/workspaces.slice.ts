import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { RootState } from 'store'
import memoize from 'lodash/memoize'
import GFWAPI from '@globalfishingwatch/api-client'
import { Workspace, WorkspaceUpsert } from '@globalfishingwatch/dataviews-client'
import { ColorBarOptions } from '@globalfishingwatch/ui-components/dist/color-bar'
import { AsyncReducer, createAsyncSlice } from 'features/api/api.slice'
import { getUserId } from 'features/user/user.slice'
import { selectCurrentWorkspaceId } from 'routes/routes.selectors'

export const fetchWorkspacesThunk = createAsyncThunk('workspaces/fetch', async () => {
  const workspaces = await GFWAPI.fetch<Workspace[]>('/v1/workspaces?include=aoi')
  return workspaces.map((workspace, i) => ({ ...workspace, color: ColorBarOptions[i].value }))
})

export const fetchWorkspaceByIdThunk = createAsyncThunk(
  'workspace/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const workspace = await GFWAPI.fetch<Workspace>(
        `/v1/workspaces/${id}?include=aoi,dataviews,dataviews.datasets,dataviews.datasets.endpoints`
      )
      return workspace
    } catch (e) {
      return rejectWithValue(id)
    }
  }
)

export const createWorkspaceThunk = createAsyncThunk(
  'workspaces/create',
  async (workspaceData: WorkspaceUpsert, { rejectWithValue }) => {
    try {
      const workspace = await GFWAPI.fetch<Workspace>(`/v1/workspaces`, {
        method: 'POST',
        body: workspaceData as any,
      })
      return workspace
    } catch (e) {
      return rejectWithValue(workspaceData.name)
    }
  }
)

export const updateWorkspaceThunk = createAsyncThunk(
  'workspaces/update',
  async (workspaceData: WorkspaceUpsert, { rejectWithValue }) => {
    try {
      const workspace = await GFWAPI.fetch<Workspace>(`/v1/workspaces/${workspaceData.id}`, {
        method: 'PATCH',
        body: workspaceData as any,
      })
      return workspace
    } catch (e) {
      return rejectWithValue(workspaceData.id)
    }
  }
)

export const deleteWorkspaceThunk = createAsyncThunk(
  'workspaces/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const workspace = await GFWAPI.fetch<Workspace>(`/v1/workspaces/${id}`, {
        method: 'DELETE',
      })
      return { ...workspace, id }
    } catch (e) {
      return rejectWithValue(id)
    }
  }
)

type WorkpaceExtended = Workspace & { color: string }

export type WorkspacesState = AsyncReducer<WorkpaceExtended>

const { slice: workspacesSlice, entityAdapter } = createAsyncSlice<
  WorkspacesState,
  WorkpaceExtended
>({
  name: 'workspaces',
  thunks: {
    fetchThunk: fetchWorkspacesThunk,
    fetchByIdThunk: fetchWorkspaceByIdThunk,
    updateThunk: updateWorkspaceThunk,
    createThunk: createWorkspaceThunk,
    deleteThunk: deleteWorkspaceThunk,
  },
})

export const { selectAll: selectAllWorkspaces, selectById } = entityAdapter.getSelectors<RootState>(
  (state) => state.workspaces
)

export const selectWorkspaceStatus = (state: RootState) => state.workspaces.status
export const selectWorkspaceStatusId = (state: RootState) => state.workspaces.statusId

export const selectCurrentWorkspace = createSelector(
  [selectAllWorkspaces, selectCurrentWorkspaceId],
  (workspaces, workspaceId) => {
    return workspaces.find((workspace) => workspace.id === workspaceId)
  }
)

export const selectWorkspaceById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export const selectShared = createSelector([selectAllWorkspaces, getUserId], (workspaces, userId) =>
  // TODO: make this real when editors in workspaces API
  workspaces.filter((w: any) => w.editors?.includes(userId))
)

export default workspacesSlice.reducer
