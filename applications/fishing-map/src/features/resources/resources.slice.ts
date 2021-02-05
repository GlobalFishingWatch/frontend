import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import memoize from 'lodash/memoize'
import { Field, Segment, trackValueArrayToSegments } from '@globalfishingwatch/data-transforms'
import GFWAPI from '@globalfishingwatch/api-client'
import { DataviewDatasetConfig, DatasetTypes } from '@globalfishingwatch/api-types'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'types'

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

export type TrackResourceData = Segment[]

type ResourcesState = Record<any, Resource>

const initialState: ResourcesState = {}

export const fetchResourceThunk = createAsyncThunk(
  'resources/fetch',
  async (resource: ResourceQuery) => {
    const isTrackResource = resource.datasetType === DatasetTypes.Tracks
    const responseType =
      isTrackResource &&
      resource.datasetConfig.query?.some((q) => q.id === 'binary' && q.value === true)
        ? 'vessel'
        : 'json'
    const data = await GFWAPI.fetch(resource.url, { responseType }).then((data) => {
      // TODO Replace with enum?
      if (isTrackResource) {
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
