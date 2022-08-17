import { createSelector } from '@reduxjs/toolkit'
import {
  DatasetTypes,
  Resource,
  ResourceStatus,
  TrackResourceData,
  EndpointId,
} from '@globalfishingwatch/api-types'
import {
  resolveDataviewDatasetResource,
  resolveDataviewDatasetResources,
  pickTrackResource,
} from '@globalfishingwatch/dataviews-client'
import { geoJSONToSegments } from '@globalfishingwatch/data-transforms'
import {
  TimebarChartData,
  TimebarChartChunk,
  TimebarChartItem,
  TimebarChartValue,
  TrackEventChunkProps,
  HighlighterCallbackFnArgs,
} from '@globalfishingwatch/timebar'
import { selectTimebarGraph, selectVisibleEvents } from 'features/app/app.selectors'
import { t } from 'features/i18n/i18n'
import { selectResources } from 'features/resources/resources.slice'
import {
  selectActiveTrackDataviews,
  selectActiveVesselsDataviews,
} from 'features/dataviews/dataviews.slice'
import { getVesselLabel } from 'utils/info'
import { MAX_TIMEBAR_VESSELS } from 'features/timebar/timebar.config'

const getUserTrackHighlighterLabel = ({ chunk }: HighlighterCallbackFnArgs) => {
  return chunk.props?.id || null
}

export const selectTracksData = createSelector(
  [selectActiveTrackDataviews, selectResources],
  (trackDataviews, resources) => {
    if (!trackDataviews || trackDataviews.length > MAX_TIMEBAR_VESSELS || !resources) return
    const tracksSegments: TimebarChartData = trackDataviews.flatMap((dataview) => {
      const timebarTrack: TimebarChartItem = {
        color: dataview.config?.color,
        chunks: [],
        status: ResourceStatus.Idle,
      }

      const endpointType =
        dataview.datasets && dataview.datasets?.[0]?.type === DatasetTypes.UserTracks
          ? EndpointId.UserTracks
          : EndpointId.Tracks

      let trackResource
      if (endpointType === EndpointId.Tracks) {
        trackResource = pickTrackResource(dataview, EndpointId.Tracks, resources)
      } else {
        const { url } = resolveDataviewDatasetResource(dataview, [DatasetTypes.UserTracks])
        trackResource = resources[url] as Resource<TrackResourceData>
      }

      if (!trackResource) {
        return { ...timebarTrack, status: ResourceStatus.Idle }
      } else if (trackResource.status === ResourceStatus.Loading) {
        return { ...timebarTrack, status: ResourceStatus.Loading }
      } else if (
        trackResource.status === ResourceStatus.Error ||
        (trackResource.status === ResourceStatus.Finished && !trackResource?.data)
      ) {
        return { ...timebarTrack, status: ResourceStatus.Error }
      }

      const segments: any = (trackResource.data as any)?.features
        ? geoJSONToSegments(trackResource.data as any)
        : trackResource.data || []

      const chunks: TimebarChartChunk[] = segments.map((segment) => {
        const useOwnColor = trackDataviews.length === 1 && endpointType === EndpointId.UserTracks
        return {
          start: segment[0].timestamp || Number.POSITIVE_INFINITY,
          // TODO This assumes that segments ends at last value's timestamp, which is probably incorrect
          end: segment[segment.length - 1].timestamp || Number.NEGATIVE_INFINITY,
          values: segment as TimebarChartValue[],
          props: {
            id: segment[0]?.id,
            color: useOwnColor ? segment[0]?.color : undefined,
          },
        }
      })
      const { url: infoUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Vessels)
      const vessel = (resources[infoUrl] as any)?.data
      const shipname =
        trackResource.dataset.type === DatasetTypes.UserTracks
          ? dataview.datasets[0]?.name
          : getVesselLabel(vessel)

      const item: TimebarChartItem = {
        ...timebarTrack,
        chunks,
        status: ResourceStatus.Finished,
        defaultLabel: shipname || '',
        getHighlighterLabel:
          trackResource.dataset.type === DatasetTypes.UserTracks
            ? getUserTrackHighlighterLabel
            : null,
        getHighlighterIcon:
          trackResource.dataset.type === DatasetTypes.UserTracks ? 'track' : 'vessel',
        props: {
          segmentsOffsetY: trackResource.dataset.type === DatasetTypes.UserTracks,
        },
      }
      return item
    })
    return tracksSegments
  }
)

export const selectHasTracksData = createSelector([selectTracksData], (tracks) =>
  tracks.some(({ chunks }) => chunks.length > 0)
)

export const selectHasTracksWithNoData = createSelector([selectTracksData], (tracks) =>
  tracks.some(({ chunks, status }) => status !== ResourceStatus.Loading && chunks.length === 0)
)

const getTrackGraphSpeedHighlighterLabel = ({ value }: HighlighterCallbackFnArgs) =>
  value ? `${value.value.toFixed(2)} knots` : ''
const getTrackGraphElevationighlighterLabel = ({ value }: HighlighterCallbackFnArgs) =>
  value ? `${value.value} m` : ''

export const selectTracksGraphData = createSelector(
  [selectActiveVesselsDataviews, selectResources, selectTimebarGraph],
  (vesselDataviews, resources, timebarGraphType) => {
    if (!resources) return
    const tracksGraphsData: TimebarChartData = vesselDataviews.flatMap((dataview) => {
      const trackGraphData: TimebarChartItem = {
        color: dataview.config?.color,
        chunks: [],
        status: ResourceStatus.Idle,
        getHighlighterLabel:
          timebarGraphType === 'speed'
            ? getTrackGraphSpeedHighlighterLabel
            : getTrackGraphElevationighlighterLabel,
        getHighlighterIcon: 'vessel',
      }

      const resourcesQueries = resolveDataviewDatasetResources(dataview, DatasetTypes.Tracks)
      const resourceQuery = resourcesQueries.find((r) =>
        r.datasetConfig.query?.find(
          (q) => q.id === 'fields' && q.value.toString().includes(timebarGraphType)
        )
      )
      const graphUrl = resourceQuery?.url
      if (!graphUrl) return trackGraphData
      const graphResource = resources[graphUrl] as Resource<TrackResourceData>

      if (!graphResource || graphResource.status === ResourceStatus.Loading) {
        return { ...trackGraphData, status: ResourceStatus.Loading }
      } else if (
        graphResource.status === ResourceStatus.Error ||
        (graphResource.status === ResourceStatus.Finished && !graphResource?.data)
      ) {
        return { ...trackGraphData, status: ResourceStatus.Error }
      }
      const graphChunks: TimebarChartChunk[] = graphResource.data.flatMap((segment) => {
        if (!segment) {
          return []
        }
        return {
          start: segment[0].timestamp || Number.POSITIVE_INFINITY,
          // TODO This assumes that segments ends at last value's timestamp, which is probably incorrect
          end: segment[segment.length - 1].timestamp || Number.NEGATIVE_INFINITY,
          values: segment.map((segmentPoint) => {
            const value = (segmentPoint as any)?.[timebarGraphType]
            return {
              timestamp: segmentPoint.timestamp,
              value,
            }
          }),
        }
      })

      trackGraphData.chunks = graphChunks
      return trackGraphData
    })
    return tracksGraphsData
  }
)

const getTrackEventHighlighterLabel = ({ chunk, expanded }: HighlighterCallbackFnArgs) => {
  if (chunk.cluster) {
    return `${chunk.props?.descriptionGeneric} (${chunk.cluster.numChunks} ${t(
      'event.events',
      'events'
    )})`
  }
  if (expanded) {
    return chunk.props?.description
  }
  return chunk.props?.descriptionGeneric
}

export const selectTracksEvents = createSelector(
  [selectActiveTrackDataviews, selectResources, selectVisibleEvents],
  (trackDataviews, resources, visibleEvents) => {
    if (!trackDataviews || trackDataviews.length > MAX_TIMEBAR_VESSELS) {
      return []
    }
    const tracksEvents: TimebarChartData<TrackEventChunkProps> = trackDataviews.map((dataview) => {
      const { url: infoUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Vessels)
      const vessel = (resources[infoUrl] as any)?.data
      const shipname = vessel ? getVesselLabel(vessel) : ''
      const trackEvents: TimebarChartItem<TrackEventChunkProps> = {
        color: dataview.config?.color,
        chunks: [],
        status: ResourceStatus.Idle,
        defaultLabel: shipname,
        getHighlighterLabel: getTrackEventHighlighterLabel,
        getHighlighterIcon: 'vessel',
      }
      if (Array.isArray(visibleEvents) && visibleEvents?.length === 0) return trackEvents

      const eventsResources = resolveDataviewDatasetResources(dataview, DatasetTypes.Events)
      if (!eventsResources.length) {
        return trackEvents
      }

      const eventsResourcesFiltered = eventsResources.filter(({ dataset }) => {
        if (visibleEvents === 'all') {
          return true
        }
        return dataset.configuration?.type && visibleEvents.includes(dataset.configuration?.type)
      })

      trackEvents.chunks = eventsResourcesFiltered.flatMap(({ url }) => {
        if (!url || !resources[url] || !resources[url].data) {
          return []
        }

        return resources[url].data as TimebarChartChunk<TrackEventChunkProps>[]
      })
      const statuses = eventsResourcesFiltered.map(({ url }) => resources[url]?.status)

      if (statuses.some((s) => s === ResourceStatus.Error)) {
        trackEvents.status = ResourceStatus.Error
      } else if (statuses.every((s) => s === ResourceStatus.Finished)) {
        trackEvents.status = ResourceStatus.Finished
      } else {
        trackEvents.status = ResourceStatus.Loading
      }

      return trackEvents
    })
    return tracksEvents
  }
)
