import { createSlice } from '@reduxjs/toolkit'
import { Workspace } from '@globalfishingwatch/api-types'
import { WorkspaceState } from 'types'
import { DEFAULT_WORKSPACE } from 'data/config'
import { dataviewInstances } from 'features/dataviews/dataviews.config'

interface WorkspaceSliceState {
  data: Workspace<WorkspaceState>
}

export const getDefaultWorkspace = () => {
  return DEFAULT_WORKSPACE
}

const initialState: WorkspaceSliceState = {
  data: { ...getDefaultWorkspace(), dataviewInstances },
}

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {},
})

export default workspaceSlice.reducer
