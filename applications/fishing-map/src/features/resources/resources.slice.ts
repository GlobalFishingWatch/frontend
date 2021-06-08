import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { memoize } from 'lodash'
import { Field, trackValueArrayToSegments } from '@globalfishingwatch/data-transforms'
import GFWAPI from '@globalfishingwatch/api-client'
import {
  Resource,
  ResourceStatus,
  DatasetTypes,
  EventTypes,
  ApiEvent,
  ApiEvents,
  EventVesselTypeEnum,
} from '@globalfishingwatch/api-types'
import { RootState } from 'store'

export type ResourcesState = Record<any, Resource>

const initialState: ResourcesState = {}

// TODO remove this once the cluster events follow the same API events format
type DatasetEvent = {
  event_id: string
  event_type: EventTypes
  vessel_id: string
  event_start: string
  event_end: string
  lat_mean: number
  lon_mean: number
}

// TODO: remove this workaound once the api returns the same format for every event
const parseFishingEvent = (fishingEvent: DatasetEvent): ApiEvent => {
  const event = {
    id: `${fishingEvent.lat_mean},${fishingEvent.lon_mean}`,
    position: {
      lat: fishingEvent.lat_mean,
      lon: fishingEvent.lon_mean,
    },
    type: fishingEvent.event_type,
    vessel: {
      id: fishingEvent.vessel_id,
      ssvid: '',
      name: '',
      flag: '',
      type: EventVesselTypeEnum.Fishing,
    },
    start: DateTime.fromISO(fishingEvent.event_start).toMillis(),
    end: DateTime.fromISO(fishingEvent.event_end).toMillis(),
    rfmos: [],
    eezs: [],
  }
  return event
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
        return (data as ApiEvents<DatasetEvent>).entries.map(parseFishingEvent)
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
