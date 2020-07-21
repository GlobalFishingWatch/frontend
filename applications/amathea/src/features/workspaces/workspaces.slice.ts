import { createAsyncThunk } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import { Workspace } from '@globalfishingwatch/dataviews-client'
import { RootState } from 'store'
import { AsyncReducer, createAsyncSlice } from 'features/api/api.slice'

export const fetchWorkspacesThunk = createAsyncThunk('workspaces/fetch', async () => {
  const data = await GFWAPI.fetch<Workspace[]>('/workspaces')
  return data
})

export const deleteWorkspaceThunk = createAsyncThunk(
  'workspaces/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const workspace = await GFWAPI.fetch<Workspace>(`/workspaces/${id}`, {
        method: 'DELETE',
      })
      return { id, workspace }
    } catch (e) {
      return rejectWithValue(id)
    }
  }
)

export type WorkspacesState = AsyncReducer<Workspace>

const { slice: workspacesSlice, entityAdapter } = createAsyncSlice<WorkspacesState, Workspace>({
  name: 'workspaces',
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(deleteWorkspaceThunk.fulfilled, (state, action) => {
      entityAdapter.removeOne(state, action.payload.id)
    })
    builder.addCase(deleteWorkspaceThunk.rejected, (state, action) => {
      state.error = `Error removing workspace ${action.payload}`
    })
  },
  thunk: fetchWorkspacesThunk,
})

export const { selectAll, selectById } = entityAdapter.getSelectors<RootState>(
  (state) => state.workspaces
)

export default workspacesSlice.reducer
