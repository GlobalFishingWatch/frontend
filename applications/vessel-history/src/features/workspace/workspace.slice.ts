import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { uniq } from 'lodash'
import { Workspace, Dataview, DataviewInstance } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { WorkspaceState } from 'types'
import { AsyncReducerStatus, AsyncError } from 'utils/async-slice'
import { DEFAULT_WORKSPACE } from 'data/config'
import { dataviewInstances } from 'features/dataviews/dataviews.config'

interface WorkspaceSliceState {
  status: AsyncReducerStatus
  // used to identify when someone saves its own version of the workspace
  customStatus: AsyncReducerStatus
  error: AsyncError
  data: Workspace<WorkspaceState>
}

export const getDefaultWorkspace = () => {
  return DEFAULT_WORKSPACE
}

const initialState: WorkspaceSliceState = {
  status: AsyncReducerStatus.Idle,
  customStatus: AsyncReducerStatus.Idle,
  error: {},
  data: { ...getDefaultWorkspace(), dataviewInstances },
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

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setDataviewInstances: (state, action: PayloadAction<DataviewInstance<any>[]>) => {
      state.data.dataviewInstances = action.payload
    },
  },
})

export const { setDataviewInstances } = workspaceSlice.actions

export default workspaceSlice.reducer
