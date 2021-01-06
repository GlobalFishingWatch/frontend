import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import memoize from 'lodash/memoize'
import { fetchGoogleSheetsData } from 'google-sheets-mapper'
import { Workspace } from '@globalfishingwatch/api-types'
import GFWAPI from '@globalfishingwatch/api-client'
import { asyncInitialState, AsyncReducer, createAsyncSlice } from 'utils/async-slice'
import { RootState } from 'store'
import { APP_NAME } from 'data/config'
import { AsyncReducerStatus, WorkspaceViewport } from 'types'

export const fetchWorkspacesThunk = createAsyncThunk('workspaces/fetch', async (app: string) => {
  const workspaces = await GFWAPI.fetch<Workspace[]>(`/v1/workspaces?app=${app}`)
  return workspaces
})

export type HighlightedWorkspace = {
  id: string
  name: string
  description: string
  img?: string
  cta?: string
  viewport?: WorkspaceViewport
}

export const fetchHighlightWorkspacesThunk = createAsyncThunk(
  'workspaces/fetchHighlighted',
  async (_, { getState, dispatch }) => {
    const workspaceStatus = selectWorkspaceListStatus(getState() as RootState)
    const apiWorkspaces = selectWorkspaces(getState() as RootState)
    const workspaces = await fetchGoogleSheetsData({
      apiKey: process.env.REACT_APP_GOOGLE_API_KEY as string,
      sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID as string,
    }).then((response) => {
      return Object.fromEntries(
        response.map(({ id, data }) => [id, data as HighlightedWorkspace[]])
      )
    })
    if (workspaceStatus !== AsyncReducerStatus.Finished || !apiWorkspaces) {
      dispatch(fetchWorkspacesThunk(APP_NAME))
    }
    return workspaces
  }
)

export interface WorkspacesState extends AsyncReducer<Workspace> {
  highlighted: {
    status: AsyncReducerStatus
    data: Record<string, HighlightedWorkspace[]> | undefined
  }
}

const initialState: WorkspacesState = {
  ...asyncInitialState,
  highlighted: {
    status: AsyncReducerStatus.Idle,
    data: undefined,
  },
}

const { slice: workspacesSlice, entityAdapter } = createAsyncSlice<WorkspacesState, Workspace>({
  name: 'workspaces',
  initialState,
  thunks: {
    fetchThunk: fetchWorkspacesThunk,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHighlightWorkspacesThunk.pending, (state) => {
      state.highlighted.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchHighlightWorkspacesThunk.fulfilled, (state, action) => {
      state.highlighted.status = AsyncReducerStatus.Finished
      state.highlighted.data = action.payload
    })
    builder.addCase(fetchHighlightWorkspacesThunk.rejected, (state) => {
      state.highlighted.status = AsyncReducerStatus.Error
    })
  },
})

export const { selectAll: selectWorkspaces, selectById } = entityAdapter.getSelectors<RootState>(
  (state) => state.workspaces
)

export const selectWorkspaceListStatus = (state: RootState) => state.workspaces.status
export const selectHighlightedWorkspaces = (state: RootState) => state.workspaces.highlighted.data
export const selectHighlightedWorkspacesStatus = (state: RootState) =>
  state.workspaces.highlighted.status

export const selectWorkspaceById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export default workspacesSlice.reducer
