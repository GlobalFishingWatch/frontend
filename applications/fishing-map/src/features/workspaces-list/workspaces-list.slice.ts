import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import memoize from 'lodash/memoize'
import { Workspace } from '@globalfishingwatch/api-types'
import GFWAPI from '@globalfishingwatch/api-client'
import { AsyncReducer, createAsyncSlice } from 'utils/async-slice'
import { RootState } from 'store'

export const fetchWorkspacesThunk = createAsyncThunk('workspaces/fetch', async (app: string) => {
  const workspaces = await GFWAPI.fetch<Workspace[]>(`/v1/workspaces?app=${app}`)
  return workspaces
})

export type ResourcesState = AsyncReducer<Workspace>

const { slice: workspacesSlice, entityAdapter } = createAsyncSlice<ResourcesState, Workspace>({
  name: 'workspaces',
  thunks: {
    fetchThunk: fetchWorkspacesThunk,
  },
})

export const { selectAll: selectWorkspaces, selectById } = entityAdapter.getSelectors<RootState>(
  (state) => state.workspaces
)

export const selectWorkspaceById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export default workspacesSlice.reducer
