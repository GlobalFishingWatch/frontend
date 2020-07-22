import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from 'store'
import GFWAPI from '@globalfishingwatch/api-client'
import { Workspace } from '@globalfishingwatch/dataviews-client'

interface WorkspaceEditorState {
  data: Partial<Workspace> | null
}

const initialState: WorkspaceEditorState = {
  data: null,
}

const workSpaceEditorSlice = createSlice({
  name: 'workspaceEditor',
  initialState,
  reducers: {},
})

export default workSpaceEditorSlice.reducer
