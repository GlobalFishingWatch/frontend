import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { AsyncReducerStatus } from 'types'
import { RootState } from 'store'
import memoize from 'lodash/memoize'
import { trackValueArrayToSegments, Field } from '@globalfishingwatch/data-transforms'
import GFWAPI from '@globalfishingwatch/api-client'
import { DataviewDatasetConfig, DatasetTypes } from '@globalfishingwatch/dataviews-client'
import { TRACKS_DATASET_TYPE } from 'features/workspace/workspace.mock'

export interface ResourceQuery {
  url: string
  dataviewId: number
  datasetConfig: DataviewDatasetConfig
  datasetType: DatasetTypes
}

export interface Resource<T = unknown> extends ResourceQuery {
  status: AsyncReducerStatus
  data?: T
}

type ResourcesState = Record<any, Resource>

const initialState: ResourcesState = {}

export const fetchResourceThunk = createAsyncThunk(
  'resources/fetch',
  async (resource: ResourceQuery) => {
    const data = await GFWAPI.fetch(resource.url).then((data) => {
      // TODO Replace with enum?
      if (resource.datasetType === TRACKS_DATASET_TYPE) {
        const fields = (resource.datasetConfig.query?.find((q) => q.id === 'fields')
          ?.value as string).split(',') as Field[]
        const segments = trackValueArrayToSegments(data as any, fields)
        return segments
      }
      return data
    })
    return {
      ...resource,
      data,
    }
  },
  {
    condition: (resource: ResourceQuery, { getState }) => {
      const { resources } = getState() as RootState
      const { status } = resources[resource.url] || {}
      return !status || (status !== 'loading' && status !== 'finished')
    },
  }
)

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchResourceThunk.pending, (state, action) => {
      const resource = action.meta.arg
      state[resource.url] = { status: AsyncReducerStatus.Loading, ...resource }
    })
    builder.addCase(fetchResourceThunk.fulfilled, (state, action) => {
      const { url } = action.payload
      state[url] = { status: AsyncReducerStatus.Finished, ...action.payload }
    })
    builder.addCase(fetchResourceThunk.rejected, (state, action) => {
      const { url } = action.meta.arg
      state[url].status = AsyncReducerStatus.Error
    })
  },
})

export const selectResources = (state: RootState) => state.resources
export const selectResourceByUrl = memoize(<T = any>(url = '') =>
  createSelector([selectResources], (resources) => resources[url] as Resource<T>)
)

export default resourcesSlice.reducer
