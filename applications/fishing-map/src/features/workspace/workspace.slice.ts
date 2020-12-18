import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import uniq from 'lodash/uniq'
import {
  Workspace,
  Dataview,
  DataviewInstance,
  WorkspaceUpsert,
} from '@globalfishingwatch/api-types'
import GFWAPI, { FetchOptions } from '@globalfishingwatch/api-client'
import { getOceanAreaName } from '@globalfishingwatch/ocean-areas'
import { AsyncReducerStatus, UrlDataviewInstance, WorkspaceState, WorkspaceViewport } from 'types'
import { RootState } from 'store'
import { fetchDatasetsByIdsThunk } from 'features/datasets/datasets.slice'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import { selectUrlDataviewInstances, selectVersion } from 'routes/routes.selectors'
import { HOME } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import { selectCustomWorkspace } from 'features/app/app.selectors'
import { getWorkspaceEnv } from 'data/workspaces'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { pickDateFormatByRange } from 'features/map/controls/MapInfo'

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
    const workspaceEnv = getWorkspaceEnv()
    const workspace = workspaceId
      ? await GFWAPI.fetch<Workspace<WorkspaceState>>(`/${version}/workspaces/${workspaceId}`)
      : ((await import(`./workspace.default.${workspaceEnv}`).then(
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
    const areaName = await getOceanAreaName(mergedWorkspace.viewport as WorkspaceViewport)
    const dateFormat = pickDateFormatByRange(
      mergedWorkspace.startAt as string,
      mergedWorkspace.endAt as string
    )
    const start = formatI18nDate(mergedWorkspace.startAt as string, {
      format: dateFormat,
    })
      .replace(',', '')
      .replace('.', '')
    const end = formatI18nDate(mergedWorkspace.endAt as string, {
      format: dateFormat,
    })
      .replace(',', '')
      .replace('.', '')
    mergedWorkspace.name = `From ${start} to ${end} near ${areaName}`

    const saveWorkspace = async (tries = 0): Promise<Workspace<WorkspaceState> | undefined> => {
      let workspaceUpdated
      try {
        const version = selectVersion(state)
        const name = tries > 0 ? mergedWorkspace.name + `_${tries}` : mergedWorkspace.name
        workspaceUpdated = await GFWAPI.fetch<Workspace<WorkspaceState>>(`/${version}/workspaces`, {
          method: 'POST',
          body: { ...mergedWorkspace, name },
        } as FetchOptions<WorkspaceUpsert<WorkspaceState>>)
      } catch (e) {
        // Means we already have a workspace with this name
        if (e.status === 400) {
          return await saveWorkspace(tries + 1)
        }
        throw e
      }
      return workspaceUpdated
    }

    const workspaceUpdated = await saveWorkspace()
    if (workspaceUpdated) {
      dispatch(
        updateLocation(HOME, {
          payload: { workspaceId: workspaceUpdated.id },
          query: {},
          replaceQuery: true,
        })
      )
    }
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
