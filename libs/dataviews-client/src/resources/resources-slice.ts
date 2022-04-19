import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { memoize } from 'lodash'
import { DateTime } from 'luxon'
import { Feature, FeatureCollection, LineString } from 'geojson'
import {
  Field,
  mergeTrackChunks,
  trackValueArrayToSegments,
  wrapFeaturesLongitudes,
} from '@globalfishingwatch/data-transforms'
import { GFWAPI } from '@globalfishingwatch/api-client'
import {
  Resource,
  ResourceStatus,
  DatasetTypes,
  ApiEvent,
  ApiEvents,
  DataviewDatasetConfig,
} from '@globalfishingwatch/api-types'

export type ResourcesState = Record<any, Resource>
export interface PartialStoreResources {
  resources: ResourcesState
}

const initialState: ResourcesState = {}

export const getVesselIdFromDatasetConfig = (datasetConfig: DataviewDatasetConfig) => {
  return (datasetConfig?.query?.find((q) => q.id === 'vessels')?.value ||
    datasetConfig?.params?.find((q) => q.id === 'vesselId')?.value) as string
}

export const getTracksChunkSetId = (datasetConfig: DataviewDatasetConfig) => {
  const chunkSetVesselId = datasetConfig.params?.find((p) => p.id === 'vesselId')?.value
  const chunkSetZoom = datasetConfig.metadata?.zoom
  const chunkSetId = ['track', chunkSetVesselId, chunkSetZoom].join('-')
  return chunkSetId
}

const parseEvent = (event: ApiEvent, eventKey: string): ApiEvent => {
  return {
    ...event,
    id: eventKey,
    start: DateTime.fromISO(event.start as string).toMillis(),
    end: DateTime.fromISO(event.end as string).toMillis(),
  }
}

export type FetchResourceThunkParams = { resource: Resource; parseEventCb?: ParseEventCallback }
export type ParseEventCallback = (event: ApiEvent, idKey: string) => unknown

export const fetchResourceThunk = createAsyncThunk(
  'resources/fetch',
  async ({ resource, parseEventCb }: FetchResourceThunkParams) => {
    const isTrackResource = resource.dataset.type === DatasetTypes.Tracks
    const isUserTrackResource = resource.dataset.type === DatasetTypes.UserTracks
    const isEventsResource = resource.dataset.type === DatasetTypes.Events
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
        const vesselId =
          getVesselIdFromDatasetConfig(resource?.datasetConfig) || resource.url.split('/')[3] // grab vesselId from url
        return (data as ApiEvents).entries.map((event, index) => {
          const eventKey = `${vesselId}-${event.type}-${index}`
          return parseEventCb ? parseEventCb(event, eventKey) : parseEvent(event, eventKey)
        })
      }

      if (isUserTrackResource) {
        const fc = data as FeatureCollection
        return {
          ...fc,
          features: wrapFeaturesLongitudes(fc.features as Feature<LineString>[]),
        }
      }
      return data
    })
    return {
      ...resource,
      data,
    }
  },
  {
    condition: ({ resource }: FetchResourceThunkParams, { getState }) => {
      const { resources } = getState() as PartialStoreResources
      const { status } = resources[resource.url] || {}
      return !status || (status !== ResourceStatus.Loading && status !== ResourceStatus.Finished)
    },
  }
)

export const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchResourceThunk.pending, (state, action) => {
      const { resource } = action.meta.arg
      state[resource.url] = { status: ResourceStatus.Loading, ...resource }
    })
    builder.addCase(fetchResourceThunk.fulfilled, (state, action) => {
      const { url } = action.payload
      const resource = { status: ResourceStatus.Finished, ...action.payload }
      state[url] = resource

      // If resource is part of a chunk set (ie tracks by year), rebuild the whole set into a single resource
      if (action.payload.datasetConfig.metadata?.chunkSetId) {
        const thisChunkSetId = action.payload.datasetConfig.metadata?.chunkSetId
        const chunks = Object.keys(state)
          .map((k) => state[k])
          .filter((resource) => resource.datasetConfig.metadata?.chunkSetId === thisChunkSetId)

        if (
          chunks.map((chunk) => chunk.status).some((status) => status === ResourceStatus.Finished)
        ) {
          const mergedData = mergeTrackChunks(chunks.map((chunk) => chunk.data) as any)

          // TODO should we always use URL as key or is this ok?
          state[thisChunkSetId] = {
            ...resource,
            data: mergedData,
            datasetConfig: {
              ...resource.datasetConfig,
              metadata: {
                ...resource.datasetConfig.metadata,
                chunkSetMerged: true,
              },
            },
          }
        }
      }
    })
    builder.addCase(fetchResourceThunk.rejected, (state, action) => {
      const { url } = action.meta.arg.resource
      state[url].status = ResourceStatus.Error
    })
  },
})

export const selectResources = (state: PartialStoreResources) => state.resources
export const selectResourceByUrl = memoize(<T = any>(url = '') =>
  createSelector([selectResources], (resources) => resources[url] as Resource<T>)
)
export const selectResourcesLoading = createSelector([selectResources], (resources) => {
  return Object.entries(resources)
    .map(([, resource]) => resource.status)
    .includes(ResourceStatus.Loading)
})

export default resourcesSlice.reducer
