import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { memoize } from 'lodash'
import { DateTime } from 'luxon'
import { Feature, FeatureCollection, LineString } from 'geojson'
import {
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
  Field,
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

export const parseEvent = (event: ApiEvent, eventKey: string): ApiEvent => {
  return {
    ...event,
    key: eventKey,
    start: DateTime.fromISO(event.start as string, { zone: 'utc' }).toMillis(),
    end: DateTime.fromISO(event.end as string, { zone: 'utc' }).toMillis(),
  }
}

export type FetchResourceThunkParams = {
  resource: Resource
  resourceKey?: string
  parseEventCb?: ParseEventCallback
  parseUserTrackCb?: ParseTrackCallback
}
export type ParseEventCallback = (event: ApiEvent, idKey: string) => unknown
export type ParseTrackCallback = (data: FeatureCollection) => FeatureCollection

export const fetchResourceThunk = createAsyncThunk(
  'resources/fetch',
  async ({ resource, parseEventCb, parseUserTrackCb }: FetchResourceThunkParams, { signal }) => {
    const isTrackResource = resource.dataset.type === DatasetTypes.Tracks
    const isUserTrackResource = resource.dataset.type === DatasetTypes.UserTracks
    const isEventsResource = resource.dataset.type === DatasetTypes.Events
    const responseType =
      isTrackResource &&
      resource.datasetConfig.query?.some((q) => q.id === 'binary' && q.value === true)
        ? 'vessel'
        : 'json'

    // The urls has the version included so I need to remove them
    const data = await GFWAPI.fetch(resource.url, { responseType, signal }).then((data: any) => {
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
        const geoJSON = data as FeatureCollection

        // Wrap longitudes
        const wrappedGeoJSON = {
          ...geoJSON,
          features: wrapFeaturesLongitudes(geoJSON.features as Feature<LineString>[]),
        }

        if (parseUserTrackCb) {
          return parseUserTrackCb(wrappedGeoJSON)
        }

        return wrappedGeoJSON
      }

      return data
    })
    return {
      ...resource,
      data,
    }
  },
  {
    condition: ({ resource, resourceKey }: FetchResourceThunkParams, { getState }) => {
      const { resources } = getState() as PartialStoreResources
      const key = resourceKey || resource.url
      const { status } = resources[key] || {}
      return !status || (status !== ResourceStatus.Loading && status !== ResourceStatus.Finished)
    },
  }
)

const getChunkSetChunks = (state: ResourcesState, chunkSetId: string) => {
  const chunks = Object.keys(state)
    .map((k) => state[k])
    .filter(
      (resource) =>
        resource.datasetConfig.metadata?.chunkSetId === chunkSetId &&
        !resource.datasetConfig.metadata?.chunkSetMerged
    )
  return chunks
}

export const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchResourceThunk.pending, (state, action) => {
      const { resource } = action.meta.arg
      const key = action.meta.arg.resourceKey || resource.url
      state[key] = { status: ResourceStatus.Loading, ...resource }
      const thisChunkSetId = resource.datasetConfig?.metadata?.chunkSetId
      if (thisChunkSetId) {
        state[thisChunkSetId] = {
          ...resource,
          status: ResourceStatus.Loading,
          datasetConfig: {
            ...resource.datasetConfig,
            metadata: {
              ...resource.datasetConfig.metadata,
              chunkSetMerged: true,
            },
          },
        }
      }
    })
    builder.addCase(fetchResourceThunk.fulfilled, (state, action) => {
      const { url } = action.payload
      const key = action.meta.arg.resourceKey || url
      state[key] = { status: ResourceStatus.Finished, ...action.payload }

      const chunkSetId = action.payload.datasetConfig.metadata?.chunkSetId
      // If resource is part of a chunk set (ie tracks by year), rebuild the whole set into a single resource
      if (chunkSetId) {
        const chunkSetChunks = getChunkSetChunks(state, chunkSetId)
        if (
          chunkSetChunks
            .map((chunk) => chunk.status)
            .some((status) => status === ResourceStatus.Finished)
        ) {
          const mergedData = mergeTrackChunks(chunkSetChunks.map((chunk) => chunk.data) as any)

          state[chunkSetId] = {
            ...state[chunkSetId],
            data: mergedData,
            status: ResourceStatus.Finished,
          }
        }
      }
    })
    builder.addCase(fetchResourceThunk.rejected, (state, action) => {
      const { url } = action.meta.arg.resource
      const key = action.meta.arg.resourceKey || url
      const resource = state[key]
      if (action.meta.arg.resource.url === resource.url) {
        resource.status = ResourceStatus.Error
      }
      const chunkSetId = resource.datasetConfig.metadata?.chunkSetId
      if (chunkSetId) {
        state[chunkSetId] = {
          ...state[chunkSetId],
          status: ResourceStatus.Error,
        }
      }
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
