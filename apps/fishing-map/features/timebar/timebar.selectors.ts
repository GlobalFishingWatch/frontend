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

const getUserTrackHighlighterLabel = (chunk: TimebarChartChunk<any>) => {
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
        trackResource = pickTrackResource(dataview, endpointType, resources)
      } else {
        const { url } = resolveDataviewDatasetResource(dataview, [DatasetTypes.UserTracks])
        trackResource = resources[url] as Resource<TrackResourceData>
      }

      if (!trackResource || trackResource.status === ResourceStatus.Loading) {
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
        return {
          start: segment[0].timestamp || Number.POSITIVE_INFINITY,
          end: segment[segment.length - 1].timestamp || Number.NEGATIVE_INFINITY,
          values: segment as TimebarChartValue[],
          props: {
            id: segment[0]?.id,
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
        props: {
          segmentsOffsetY: trackResource.dataset.type === DatasetTypes.UserTracks,
        },
      }
      return item
    })
    return tracksSegments
  }
)

const getTrackGraphSpeedHighlighterLabel = (chunk, value: TimebarChartValue) =>
  value ? `${value.value.toFixed(2)} knots` : ''
const getTrackGraphElevationighlighterLabel = (chunk, value: TimebarChartValue) =>
  value ? `${value.value} m` : ''

export const selectTracksGraphData = createSelector(
  [selectTracksData, selectActiveVesselsDataviews, selectResources, selectTimebarGraph],
  (tracksData, vesselDataviews, resources, timebarGraphType) => {
    if (!tracksData || !resources) return
    const tracksGraphsData: TimebarChartData = vesselDataviews.flatMap(
      (dataview, dataviewIndex) => {
        const trackGraphData: TimebarChartItem = {
          color: dataview.config?.color,
          chunks: [],
          status: ResourceStatus.Idle,
          getHighlighterLabel:
            timebarGraphType === 'speed'
              ? getTrackGraphSpeedHighlighterLabel
              : getTrackGraphElevationighlighterLabel,
        }

        const { url: graphUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks, {
          id: 'fields',
          value: timebarGraphType,
        })
        if (!graphUrl) return trackGraphData
        const graphResource = resources[graphUrl] as Resource<TrackResourceData>

        // TODO better by id?
        const track = tracksData[dataviewIndex]

        if (
          track.status === ResourceStatus.Loading ||
          !graphResource ||
          graphResource.status === ResourceStatus.Loading
        ) {
          return { ...trackGraphData, status: ResourceStatus.Loading }
        } else if (
          track.status === ResourceStatus.Error ||
          graphResource.status === ResourceStatus.Error ||
          (graphResource.status === ResourceStatus.Finished && !graphResource?.data)
        ) {
          return { ...trackGraphData, status: ResourceStatus.Error }
        }

        const graphChunksWithCurrentFeature: TimebarChartChunk[] = track.chunks.map(
          (trackChunk, trackChunkIndex) => {
            const graphSegment = graphResource?.data?.[trackChunkIndex]
            const graphChunkValues: TimebarChartValue[] = trackChunk.values?.flatMap(
              (trackSegmentPoint, trackSegmentPointIndex) => {
                const graphSegmentPoint = graphSegment?.[trackSegmentPointIndex]
                const value = (graphSegmentPoint as any)?.[timebarGraphType]
                if (!value) return []
                return {
                  timestamp: trackSegmentPoint.timestamp,
                  value,
                }
              }
            )
            const graphChunk: TimebarChartChunk = {
              ...trackChunk,
              values: graphChunkValues,
            }
            return graphChunk
          }
        )
        trackGraphData.chunks = graphChunksWithCurrentFeature
        return trackGraphData
      }
    )
    return tracksGraphsData
  }
)

const getTrackEventHighlighterLabel = (chunk: TimebarChartChunk<TrackEventChunkProps>) => {
  if (chunk.cluster) {
    return `${chunk.props?.descriptionGeneric} (${chunk.cluster.numChunks} ${t(
      'event.events',
      'events'
    )})`
  }
  return chunk.props?.description
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
      }
      if (Array.isArray(visibleEvents) && visibleEvents?.length === 0) return trackEvents

      const eventsResources = resolveDataviewDatasetResources(dataview, DatasetTypes.Events)
      if (!eventsResources.length) {
        return trackEvents
      }
      const hasEventData = eventsResources.some(({ url }) => resources[url]?.data)
      if (!hasEventData) {
        return { ...trackEvents, status: ResourceStatus.Loading }
      }

      const eventsResourcesFiltered = eventsResources.filter(({ dataset }) => {
        if (visibleEvents === 'all') {
          return true
        }
        return dataset.configuration?.type && visibleEvents.includes(dataset.configuration?.type)
      })

      trackEvents.chunks = eventsResourcesFiltered.flatMap(({ url }) => {
        if (!url || !resources[url].data) {
          return []
        }

        return resources[url].data as TimebarChartChunk<TrackEventChunkProps>[]
      })
      return trackEvents
    })
    return tracksEvents
  }
)
