import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit'
import type { Workspace, WorkspaceProfileViewParam, WorkspaceState } from 'types'

import { DEFAULT_WORKSPACE } from 'data/config'
import { dataviewInstances } from 'features/dataviews/dataviews.config'

interface WorkspaceSliceState extends Workspace<WorkspaceState> {}

export const getDefaultWorkspace = () => {
  return DEFAULT_WORKSPACE
}

const initialState: WorkspaceSliceState = {
  ...getDefaultWorkspace(),
  dataviewInstances,
}

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setProfileView: (state, action: PayloadAction<WorkspaceProfileViewParam>) => {
      state.profileView = action.payload
    },
  },
})

export const { setProfileView } = workspaceSlice.actions

export default workspaceSlice.reducer
