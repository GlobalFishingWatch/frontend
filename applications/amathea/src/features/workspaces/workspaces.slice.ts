import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { RootState } from 'store'
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
      const workspace = await GFWAPI.fetch<Workspace>(`/v1/workspaces/${id}`)
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
        body: workspaceData as Body,
      })
      return workspace
    } catch (e) {
      return rejectWithValue(workspaceData.label)
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
    createThunk: createWorkspaceThunk,
    deleteThunk: deleteWorkspaceThunk,
  },
})

export const { selectAll, selectById } = entityAdapter.getSelectors<RootState>(
  (state) => state.workspaces
)

export const selectCurrentWorkspace = createSelector(
  [(state) => state, selectCurrentWorkspaceId],
  (state, workspaceId) => selectById(state, workspaceId)
)

export const selectShared = createSelector([selectAll, getUserId], (workspaces, userId) =>
  // TODO: make this real when editors in workspaces API
  workspaces.filter((w: any) => w.editors?.includes(userId))
)

export default workspacesSlice.reducer
