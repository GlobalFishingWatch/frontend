import { createSelector, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from 'store'
import GFWAPI from '@globalfishingwatch/api-client'
import { Workspace } from '@globalfishingwatch/dataviews-client'
import { AsyncReducer, createAsyncSlice } from 'features/api/api.slice'

export const fetchWorkspaces = createAsyncThunk('workspaces/fetchList', async () => {
  const data = await GFWAPI.fetch<Workspace[]>('http://localhost:3001/workspaces')
  return data
})

const initialState: AsyncReducer<Workspace[]> = {}

const workspacesSlice = createAsyncSlice({
  name: 'workspaces',
  initialState,
  reducers: {},
  thunk: fetchWorkspaces,
})

export const selectWorkspacesList = (state: RootState) => state.workspaces.data

export default workspacesSlice.reducer
