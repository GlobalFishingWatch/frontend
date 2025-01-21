import type { PayloadAction} from '@reduxjs/toolkit';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import type { Feature, FeatureCollection, LineString } from 'geojson'
import memoize from 'lodash/memoize'
import { DateTime } from 'luxon'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type {
  ApiEvent,
  ApiEvents,
  DataviewDatasetConfig,
  Resource,
  TrackField} from '@globalfishingwatch/api-types';
import {
  DatasetTypes,
  ResourceStatus} from '@globalfishingwatch/api-types'
import {
  mergeTrackChunks,
  trackValueArrayToSegments,
  wrapLineStringLongitudes,
} from '@globalfishingwatch/data-transforms'

export type ResourcesState = Record<any, Resource>
export interface PartialStoreResources {
  resources: ResourcesState
}

const initialState: ResourcesState = {}

export const getVesselIdFromDatasetConfig = (datasetConfig: DataviewDatasetConfig) => {
  const vesselIds = (datasetConfig?.query?.find((q) => q.id === 'vessels')?.value ||
    datasetConfig?.params?.find((q) => q.id === 'vesselId')?.value) as string
  return Array.isArray(vesselIds) ? vesselIds.join(',') : vesselIds
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
    const isTrackBinary = resource.datasetConfig.query?.some(
      (q) => q.id === 'binary' && q.value === true
    )
    const responseType = isTrackResource && isTrackBinary ? 'vessel' : 'json'

    // The urls has the version included so I need to remove them
    const data = await GFWAPI.fetch(resource.url, { responseType, signal })
      .then((data: any) => {
        if (isTrackResource && isTrackBinary) {
          const fields = resource.datasetConfig.query?.find((q) => q.id === 'fields')
            ?.value as TrackField[]

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
            features: wrapLineStringLongitudes(geoJSON.features as Feature<LineString>[]),
          }

          if (parseUserTrackCb) {
            return parseUserTrackCb(wrappedGeoJSON)
          }

          return wrappedGeoJSON
        }

        return data
      })
      .catch((e) => {
        console.warn(e)
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

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setResource(state, action: PayloadAction<Resource>) {
      const key = action.payload.key || action.payload.url
      state[key] = action.payload
    },
  },
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

export const { setResource } = resourcesSlice.actions
export const selectResources = (state: PartialStoreResources) => state.resources
export const selectResourceByUrl = memoize(<T = any>(url = '') =>
  createSelector([selectResources], (resources) => resources[url] as Resource<T>)
)
export const selectResourcesLoading = createSelector([selectResources], (resources) => {
  return Object.entries(resources)
    .map(([, resource]) => resource.status)
    .includes(ResourceStatus.Loading)
})

export const resourcesReducer = resourcesSlice.reducer
