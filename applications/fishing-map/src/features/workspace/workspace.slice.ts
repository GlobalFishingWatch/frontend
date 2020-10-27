import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import uniq from 'lodash/uniq'
import { Workspace, Dataview, DataviewInstance } from '@globalfishingwatch/api-types'
import GFWAPI from '@globalfishingwatch/api-client'
import { AsyncReducerStatus } from 'types'
import { RootState } from 'store'
import { fetchDatasetsByIdsThunk } from 'features/datasets/datasets.slice'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import { selectVersion } from 'routes/routes.selectors'

interface WorkspaceState {
  status: AsyncReducerStatus
  data: Workspace | null
}

const initialState: WorkspaceState = {
  status: AsyncReducerStatus.Idle,
  data: null,
}

export const getDatasetByDataview = (dataviews: (Dataview | DataviewInstance)[]) => {
  return uniq(
    dataviews?.flatMap((dataviews) => {
      if (!dataviews.datasetsConfig) return []
      return dataviews.datasetsConfig.map(({ datasetId }) => datasetId)
    })
  )
}

export const fetchWorkspaceThunk = createAsyncThunk(
  'workspace/fetch',
  async (workspaceId: number, { dispatch, getState }) => {
    const version = selectVersion(getState() as RootState)
    const workspace = workspaceId
      ? await GFWAPI.fetch<Workspace>(`/${version}/workspaces/${workspaceId}`)
      : await import('./workspace.default').then((m) => m.default)

    const dataviews = uniq(workspace.dataviewInstances?.map(({ dataviewId }) => dataviewId))
    if (dataviews) {
      await dispatch(fetchDataviewsByIdsThunk(dataviews))
    }
    const datasets = getDatasetByDataview(workspace.dataviewInstances)
    if (datasets?.length) {
      await dispatch(fetchDatasetsByIdsThunk(datasets))
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
