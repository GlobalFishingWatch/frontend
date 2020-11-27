import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import uniq from 'lodash/uniq'
import {
  Workspace,
  Dataview,
  DataviewInstance,
  WorkspaceUpsert,
} from '@globalfishingwatch/api-types'
import GFWAPI, { FetchOptions } from '@globalfishingwatch/api-client'
import { AsyncReducerStatus, UrlDataviewInstance, WorkspaceState } from 'types'
import { RootState } from 'store'
import { fetchDatasetsByIdsThunk } from 'features/datasets/datasets.slice'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import { selectUrlDataviewInstances, selectVersion } from 'routes/routes.selectors'
import { HOME } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import { selectCustomWorkspace } from 'features/app/app.selectors'
import { ENV } from 'data/config'

interface WorkspaceSliceState {
  status: AsyncReducerStatus
  data: Workspace<WorkspaceState> | null
  // used to identify when someone shared its own version of the workspace
  custom: boolean
}

const initialState: WorkspaceSliceState = {
  status: AsyncReducerStatus.Idle,
  data: null,
  custom: false,
}

export const getDatasetByDataview = (
  dataviews: (Dataview | DataviewInstance | UrlDataviewInstance)[]
) => {
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
    const state = getState() as RootState
    const version = selectVersion(state)
    const urlDataviewInstances = selectUrlDataviewInstances(state)
    const workspace = workspaceId
      ? await GFWAPI.fetch<Workspace<WorkspaceState>>(`/${version}/workspaces/${workspaceId}`)
      : ((await import(`./workspace.default.${ENV}`).then(
          (m) => m.default
        )) as Workspace<WorkspaceState>)

    const dataviewIds = [
      ...(workspace.dataviews?.map(({ id }) => id as number) || []),
      ...uniq(workspace.dataviewInstances?.map(({ dataviewId }) => dataviewId)),
    ]

    let dataviews = []
    if (dataviewIds) {
      const { payload }: any = await dispatch(fetchDataviewsByIdsThunk(dataviewIds))
      if (payload?.length) {
        dataviews = payload
      }
    }
    const dataviewIntances = [
      ...dataviews,
      ...(workspace.dataviewInstances || []),
      ...(urlDataviewInstances || []),
    ]

    const datasets = getDatasetByDataview(dataviewIntances)

    if (datasets?.length) {
      await dispatch(fetchDatasetsByIdsThunk(datasets))
    }
    return workspace
  }
)

export const saveCurrentWorkspaceThunk = createAsyncThunk(
  'workspace/saveCurrent',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState
    const mergedWorkspace = selectCustomWorkspace(state)
    const version = selectVersion(state)
    const workspaceUpdated = await GFWAPI.fetch<Workspace<WorkspaceState>>(
      `/${version}/workspaces`,
      {
        method: 'POST',
        body: mergedWorkspace,
      } as FetchOptions<WorkspaceUpsert<WorkspaceState>>
    )
    dispatch(
      updateLocation(HOME, {
        payload: { workspaceId: workspaceUpdated.id },
        query: {},
        replaceQuery: true,
      })
    )
    return workspaceUpdated
  }
)

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    resetWorkspaceSearchQuery(state) {
      if (state.data?.state) {
        state.data.state.query = undefined
      }
    },
  },
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
    builder.addCase(saveCurrentWorkspaceThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
      state.custom = true
    })
    builder.addCase(saveCurrentWorkspaceThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      if (action.payload) {
        state.data = action.payload
      }
    })
    builder.addCase(saveCurrentWorkspaceThunk.rejected, (state) => {
      state.status = AsyncReducerStatus.Finished
      state.custom = false
    })
  },
})

export const { resetWorkspaceSearchQuery } = workspaceSlice.actions

export default workspaceSlice.reducer
