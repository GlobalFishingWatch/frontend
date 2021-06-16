import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { memoize } from 'lodash'
import { DateTime } from 'luxon'
import { Field, trackValueArrayToSegments } from '@globalfishingwatch/data-transforms'
import GFWAPI from '@globalfishingwatch/api-client'
import {
  Resource,
  ResourceStatus,
  DatasetTypes,
  ApiEvent,
  ApiEvents,
} from '@globalfishingwatch/api-types'
import { RootState } from 'store'

export type ResourcesState = Record<any, Resource>

const initialState: ResourcesState = {}

const parseFishingEvent = (event: ApiEvent, index: number): ApiEvent => {
  return {
    ...event,
    id: index.toString(),
    start: DateTime.fromISO(event.start as string).toMillis(),
    end: DateTime.fromISO(event.end as string).toMillis(),
  }
}

export const fetchResourceThunk = createAsyncThunk(
  'resources/fetch',
  async (resource: Resource) => {
    const isTrackResource = resource.datasetType === DatasetTypes.Tracks
    const isEventsResource = resource.datasetType === DatasetTypes.Events
    const responseType =
      isTrackResource &&
      resource.datasetConfig.query?.some((q) => q.id === 'binary' && q.value === true)
        ? 'vessel'
        : 'json'

    const data = await GFWAPI.fetch(resource.url, { responseType }).then((data) => {
      // TODO Replace with enum?
      if (isTrackResource) {
        const fields = (
          resource.datasetConfig.query?.find((q) => q.id === 'fields')?.value as string
        ).split(',') as Field[]
        const segments = trackValueArrayToSegments(data as any, fields)
        return segments
      }
      // TODO check by eventType when needed
      if (isEventsResource) {
        return (data as ApiEvents).entries.map(parseFishingEvent)
      }
      return data
    })
    return {
      ...resource,
      data,
    }
  },
  {
    condition: (resource: Resource, { getState }) => {
      const { resources } = getState() as RootState
      const { status } = resources[resource.url] || {}
      return !status || (status !== ResourceStatus.Loading && status !== ResourceStatus.Finished)
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
      state[resource.url] = { status: ResourceStatus.Loading, ...resource }
    })
    builder.addCase(fetchResourceThunk.fulfilled, (state, action) => {
      const { url } = action.payload
      state[url] = { status: ResourceStatus.Finished, ...action.payload }
    })
    builder.addCase(fetchResourceThunk.rejected, (state, action) => {
      const { url } = action.meta.arg
      state[url].status = ResourceStatus.Error
    })
  },
})

export const selectResources = (state: RootState) => state.resources
export const selectResourceByUrl = memoize(<T = any>(url = '') =>
  createSelector([selectResources], (resources) => resources[url] as Resource<T>)
)

export default resourcesSlice.reducer
