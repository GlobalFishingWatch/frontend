import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'types'
import { Workspace } from '@globalfishingwatch/api-types'
import { fetchDatasetsByIdsThunk } from 'features/datasets/datasets.slice'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import workspaceMock from './workspace.mock'

// import { selectVersion } from 'routes/routes.selectors'
// import GFWAPI from '@globalfishingwatch/api-client'

interface WorkspaceState {
  status: AsyncReducerStatus
  data: Workspace | null
}

const initialState: WorkspaceState = {
  status: AsyncReducerStatus.Idle,
  data: null,
}

export const fetchWorkspaceThunk = createAsyncThunk(
  'workspace/fetch',
  async (workspaceId: string, { dispatch, getState }) => {
    // const version = selectVersion(getState() as RootState)
    // const workspace = await GFWAPI.fetch<Workspace>(`/${version}/workspaces/${workspaceId}`)
    const workspace = workspaceMock
    const datasets = workspace.datasets?.map((dataset) => dataset.id as string)
    if (datasets) {
      await dispatch(fetchDatasetsByIdsThunk(datasets))
    }
    const dataviews = workspace.dataviews?.map((dataview) => dataview.id as number)
    if (dataviews) {
      await dispatch(fetchDataviewsByIdsThunk(dataviews))
    }
    return workspace
  }
)

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
      if (action.payload) {
        state.data = action.payload
      }
    })
    builder.addCase(fetchWorkspaceThunk.rejected, (state) => {
      state.status = AsyncReducerStatus.Error
    })
  },
})

export const selectWorkspace = (state: RootState) => state.workspace.data
export const selectWorkspaceStatus = (state: RootState) => state.workspace.status

export default workspaceSlice.reducer
