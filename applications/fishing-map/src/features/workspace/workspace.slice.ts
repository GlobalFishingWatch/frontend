import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'types'
import { Workspace } from '@globalfishingwatch/dataviews-client'
import workspace from './workspace.mock'
// import GFWAPI from '@globalfishingwatch/api-client'

interface WorkspaceState {
  status: AsyncReducerStatus
  data: Workspace | null
}

const initialState: WorkspaceState = {
  status: AsyncReducerStatus.Idle,
  data: null,
}

export const fetchWorkspaceThunk = createAsyncThunk('workspace/fetch', async () => {
  // const workspace = await GFWAPI.fetch<Workspace>(`/v1/workspaces${id}`)
  return workspace
})

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchWorkspaceThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchWorkspaceThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      state.data = action.payload
    })
    builder.addCase(fetchWorkspaceThunk.rejected, (state) => {
      state.status = AsyncReducerStatus.Error
    })
  },
})

export const selectWorkspace = (state: RootState) => state.workspace.data
export const selectWorkspaceStatus = (state: RootState) => state.workspace.status

export default workspaceSlice.reducer
