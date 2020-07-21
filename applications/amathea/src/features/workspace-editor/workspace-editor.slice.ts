import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from 'store'
import GFWAPI from '@globalfishingwatch/api-client'
import { Workspace } from '@globalfishingwatch/dataviews-client'
import { AsyncReducerStatus } from 'features/api/api.slice'

interface WorkspaceEditorState {
  status: AsyncReducerStatus
  data: Workspace | null
}

const initialState: WorkspaceEditorState = {
  status: 'idle',
  data: null,
}

export const fetchWorkspaceByIdThunk = createAsyncThunk(
  'workspace/fetchById',
  async (id: number) => {
    const workspace = await GFWAPI.fetch<Workspace>(`/workspaces/${id}`)
    return workspace
  }
)

const workSpaceEditorSlice = createSlice({
  name: 'workspaceEditor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchWorkspaceByIdThunk.pending, (state) => {
      state.status = 'loading'
      state.data = null
    })
    builder.addCase(fetchWorkspaceByIdThunk.fulfilled, (state, action) => {
      state.status = 'finished'
      state.data = action.payload
    })
    builder.addCase(fetchWorkspaceByIdThunk.rejected, (state) => {
      state.status = 'error'
    })
  },
})

export const selectWorkspace = (state: RootState) => state.workspaceEditor.data
export const selectUserStatus = (state: RootState) => state.workspaceEditor.status

export default workSpaceEditorSlice.reducer
