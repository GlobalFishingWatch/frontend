import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { RootState } from 'store'
import memoize from 'lodash/memoize'
import GFWAPI from '@globalfishingwatch/api-client'
import { Workspace } from '@globalfishingwatch/dataviews-client'
import { AsyncReducer, createAsyncSlice } from 'features/api/api.slice'
import { getUserId } from 'features/user/user.slice'
import { selectCurrentWorkspaceId } from 'routes/routes.selectors'

export const fetchWorkspacesThunk = createAsyncThunk('workspaces/fetch', async () => {
  const data = await GFWAPI.fetch<Workspace[]>('/v1/workspaces')
  return data
})

export const fetchWorkspaceByIdThunk = createAsyncThunk(
  'workspace/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const workspace = await GFWAPI.fetch<Workspace>(`/v1/workspaces/${id}?include=dataview,aoi`)
      // REMODE THESE MOCKED VALUES AND RETURN FROM API
      if (!workspace.dataviewsId?.length) {
        workspace.dataviewsId = [46, 47, 48, 49, 50]
      }
      return workspace
    } catch (e) {
      return rejectWithValue(id)
    }
  }
)

export const createWorkspaceThunk = createAsyncThunk(
  'workspaces/create',
  async (workspaceData: Partial<Workspace>, { rejectWithValue }) => {
    try {
      const workspace = await GFWAPI.fetch<Workspace>(`/v1/workspaces`, {
        method: 'POST',
        // Hack to support aoi and aoi living together for now
        // Needs to be addressed at API level first
        body: { ...workspaceData, aoi: workspaceData.aoiId } as any,
      })
      return workspace
    } catch (e) {
      return rejectWithValue(workspaceData.label)
    }
  }
)

export const updateWorkspaceThunk = createAsyncThunk(
  'workspaces/update',
  async (workspaceData: Partial<Workspace>, { rejectWithValue }) => {
    try {
      const workspace = await GFWAPI.fetch<Workspace>(`/v1/workspaces/${workspaceData.id}`, {
        method: 'PATCH',
        body: workspaceData as BodyInit,
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

export type WorkspacesState = AsyncReducer<Workspace>

const { slice: workspacesSlice, entityAdapter } = createAsyncSlice<WorkspacesState, Workspace>({
  name: 'workspaces',
  thunks: {
    fetchThunk: fetchWorkspacesThunk,
    fetchByIdThunk: fetchWorkspaceByIdThunk,
    updateThunk: updateWorkspaceThunk,
    createThunk: createWorkspaceThunk,
    deleteThunk: deleteWorkspaceThunk,
  },
})

export const { selectAll, selectById } = entityAdapter.getSelectors<RootState>(
  (state) => state.workspaces
)

export const selectWorkspaceStatus = (state: RootState) => state.workspaces.status
export const selectWorkspaceStatusId = (state: RootState) => state.workspaces.statusId

export const selectCurrentWorkspace = createSelector(
  [selectAll, selectCurrentWorkspaceId],
  (workspaces, workspaceId) => {
    return workspaces.find((workspace) => workspace.id === workspaceId)
  }
)

export const selectWorkspaceById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export const selectShared = createSelector([selectAll, getUserId], (workspaces, userId) =>
  // TODO: make this real when editors in workspaces API
  workspaces.filter((w: any) => w.editors?.includes(userId))
)

export default workspacesSlice.reducer
