import { createSelector } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import {
  ApiEvent,
  DatasetTypes,
  EventTypes,
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
import { EVENTS_COLORS } from 'data/config'
import {
  selectActiveTrackDataviews,
  selectActiveVesselsDataviews,
} from 'features/dataviews/dataviews.slice'
import { getVesselLabel } from 'utils/info'

export const selectTracksData = createSelector(
  [selectActiveTrackDataviews, selectResources],
  (trackDataviews, resources) => {
    if (!trackDataviews || !resources) return
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

      const trackResource = pickTrackResource(dataview, endpointType, resources)

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
        }
      })
      const { url: infoUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Vessels)
      const vessel = (resources[infoUrl] as any)?.data
      const shipname = vessel ? getVesselLabel(vessel) : ''
      const item: TimebarChartItem = {
        ...timebarTrack,
        chunks,
        status: ResourceStatus.Finished,
        defaultLabel: shipname,
        // getHighlighterLabel: t('vessel.inTransit', 'in transit'),
        // TODO
        // segmentsOffsetY: trackResource.dataset.type === DatasetTypes.UserTracks,
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

const getTrackEventChunkProps = (
  event: ApiEvent,
  showAuthorizationStatus: boolean
): TrackEventChunkProps => {
  let description
  let descriptionGeneric
  switch (event.type) {
    case EventTypes.Encounter:
      if (event.encounter) {
        description = `${t('event.encounterActionWith', 'had an encounter with')} ${
          event.encounter.vessel.name
            ? event.encounter.vessel.name
            : t('event.encounterAnotherVessel', 'another vessel')
        } `
      }
      descriptionGeneric = `${t('event.encounter')}`
      break
    case EventTypes.Port:
      if (event.port && event.port.name) {
        description = `${t('event.portAt', { port: event.port.name })} `
      } else {
        description = `${t('event.portAction')}`
      }
      descriptionGeneric = `${t('event.port')}`
      break
    case EventTypes.Loitering:
      description = `${t('event.loiteringAction')}`
      descriptionGeneric = `${t('event.loitering')}`
      break
    case EventTypes.Fishing:
      description = `${t('event.fishingAction')}`
      descriptionGeneric = `${t('event.fishing')}`
      break
    default:
      description = t('event.unknown', 'Unknown event')
      descriptionGeneric = t('event.unknown', 'Unknown event')
  }
  const duration = DateTime.fromMillis(event.end as number)
    .diff(DateTime.fromMillis(event.start as number), ['days', 'hours', 'minutes'])
    .toObject()

  description = [
    description,
    duration.days && duration.days > 0
      ? t('event.dayAbbreviated', '{{count}}d', { count: duration.days })
      : '',
    duration.hours && duration.hours > 0
      ? t('event.hourAbbreviated', '{{count}}h', { count: duration.hours })
      : '',
    duration.minutes && duration.minutes > 0
      ? t('event.minuteAbbreviated', '{{count}}m', {
          count: Math.round(duration.minutes as number),
        })
      : '',
  ].join(' ')

  let colorKey = event.type as string
  if (event.type === 'encounter' && showAuthorizationStatus) {
    colorKey = `${colorKey}${event.encounter?.authorizationStatus}`
  }
  const color = EVENTS_COLORS[colorKey]
  const colorLabels = EVENTS_COLORS[`${colorKey}Labels`]

  return {
    color,
    colorLabels,
    description,
    descriptionGeneric,
    latitude: event.position.lat,
    longitude: event.position.lon,
  }
}

const getTrackEventHighlighterLabel = (chunk: TimebarChartChunk<TrackEventChunkProps>) => {
  if (chunk.cluster) {
    return `${chunk.props.descriptionGeneric} (${chunk.cluster.numChunks} ${t(
      'event.events',
      'events'
    )})`
  }
  return chunk.props.description
}

export const selectTracksEvents = createSelector(
  [selectActiveTrackDataviews, selectResources, selectVisibleEvents],
  (trackDataviews, resources, visibleEvents) => {
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

      const { url: tracksUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks)
      const trackResource = resources[tracksUrl]
      const eventsResources = resolveDataviewDatasetResources(dataview, DatasetTypes.Events)
      const hasEventData =
        eventsResources?.length && eventsResources.some(({ url }) => resources[url]?.data)
      const tracksResourceResolved = tracksUrl && trackResource?.status === ResourceStatus.Finished
      if (!hasEventData || !tracksResourceResolved) {
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

        const data = resources[url].data as ApiEvent[]
        const chunks = data.map((event) => {
          const props = getTrackEventChunkProps(event, dataview.config?.showAuthorizationStatus)
          const chunk: TimebarChartChunk<TrackEventChunkProps> = {
            id: event.id,
            start: event.start as number,
            end: event.end as number,
            type: event.type,
            props,
          }
          return chunk
        })
        return chunks
      })
      return trackEvents
    })
    return tracksEvents
  }
)
