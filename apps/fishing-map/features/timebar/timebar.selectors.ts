import { createSelector } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import {
  ApiEvent,
  DatasetTypes,
  EventTypes,
  Resource,
  ResourceStatus,
  TrackResourceData,
  Vessel,
  EndpointId,
} from '@globalfishingwatch/api-types'
import {
  resolveDataviewDatasetResource,
  resolveDataviewDatasetResources,
  pickTrackResource,
} from '@globalfishingwatch/dataviews-client'
import { geoJSONToSegments } from '@globalfishingwatch/data-transforms'
import { selectTimebarGraph, selectVisibleEvents } from 'features/app/app.selectors'
import { t } from 'features/i18n/i18n'
import { selectResources } from 'features/resources/resources.slice'
import { EVENTS_COLORS } from 'data/config'
import {
  selectActiveTrackDataviews,
  selectActiveVesselsDataviews,
} from 'features/dataviews/dataviews.slice'

type TimebarTrackSegment = {
  start: number
  end: number
}

export type TimebarTrack = {
  segments?: TimebarTrackSegment[]
  color: string
}

export const selectTracksData = createSelector(
  [selectActiveTrackDataviews, selectResources],
  (trackDataviews, resources) => {
    if (!trackDataviews || !resources) return
    const tracksSegments: (TimebarTrack | null)[] = trackDataviews.flatMap((dataview) => {
      const timebarTrack = {
        color: dataview.config?.color || '',
      }

      const endpointType =
        dataview.datasets && dataview.datasets?.[0]?.type === DatasetTypes.UserTracks
          ? EndpointId.UserTracks
          : EndpointId.Tracks

      const trackResource = pickTrackResource(dataview, endpointType, resources)

      if (!trackResource || trackResource.status === ResourceStatus.Loading) {
        return timebarTrack
      } else if (
        trackResource.status === ResourceStatus.Error ||
        (trackResource.status === ResourceStatus.Finished && !trackResource?.data)
      ) {
        return { ...timebarTrack, segments: [] }
      }

      const segments: any = (trackResource.data as any)?.features
        ? geoJSONToSegments(trackResource.data as any)
        : trackResource.data || []

      const trackSegments: TimebarTrackSegment[] = segments.map((segment) => {
        return {
          start: segment[0].timestamp || Number.POSITIVE_INFINITY,
          end: segment[segment.length - 1].timestamp || Number.NEGATIVE_INFINITY,
        }
      })
      return {
        ...timebarTrack,
        segments: trackSegments,
        segmentsOffsetY: trackResource.dataset.type === DatasetTypes.UserTracks,
      }
    })
    return tracksSegments
  }
)

export const selectTracksGraphsResources = createSelector(
  [selectActiveVesselsDataviews, selectTimebarGraph, selectResources],
  (vesselDataviews, timebarGraphType, resources) => {
    if (!vesselDataviews || !resources) return

    const trackGraphResources = vesselDataviews.flatMap((dataview) => {
      const { url } = resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks)
      if (!url) return []
      const trackResource = resources[url] as Resource<TrackResourceData>
      if (!trackResource?.data) return []

      const { url: graphUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks, {
        id: 'fields',
        value: timebarGraphType,
      })
      if (!graphUrl) return []

      const graphResource = resources[graphUrl] as Resource<TrackResourceData>
      return { dataview, trackResource, graphResource }
    })
    return trackGraphResources
  }
)

export const selectTracksGraphsLoading = createSelector(
  [selectTracksGraphsResources],
  (trackResources) => {
    if (!trackResources) return false
    return trackResources.some(
      ({ trackResource, graphResource }) =>
        trackResource?.status === ResourceStatus.Loading ||
        graphResource?.status === ResourceStatus.Loading
    )
  }
)

export const selectTracksGraphs = createSelector(
  [selectTracksGraphsResources, selectTimebarGraph],
  (tracksGraphsResources, timebarGraphType) => {
    if (!tracksGraphsResources || tracksGraphsResources.length > 2) return

    const graphs = tracksGraphsResources.flatMap(({ dataview, trackResource, graphResource }) => {
      const segmentsWithCurrentFeature = trackResource.data?.map(
        (trackSegment, trackSegmentIndex) => {
          const graphSegment = graphResource?.data?.[trackSegmentIndex]
          return trackSegment.flatMap((trackSegmentPoint, trackSegmentPointIndex) => {
            const graphSegmentPoint = graphSegment?.[trackSegmentPointIndex]
            const value = (graphSegmentPoint as any)?.[timebarGraphType]
            if (!value) return []
            return {
              date: trackSegmentPoint.timestamp,
              value,
            }
          })
        }
      )
      return {
        color: dataview.config?.color || '',
        segmentsWithCurrentFeature,
        // TODO Figure out this magic value
        maxValue: 25,
      }
    })
    return graphs
  }
)

const selectEventsForTracks = createSelector(
  [selectActiveTrackDataviews, selectResources, selectVisibleEvents],
  (trackDataviews, resources, visibleEvents) => {
    const vesselsEvents = trackDataviews.map((dataview) => {
      const { url: tracksUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks)
      const eventsResources = resolveDataviewDatasetResources(dataview, DatasetTypes.Events)
      const hasEventData =
        eventsResources?.length && eventsResources.every(({ url }) => resources[url]?.data)
      const tracksResourceResolved =
        tracksUrl && resources[tracksUrl]?.status === ResourceStatus.Finished

      // Waiting for the tracks resource to be resolved to show the events
      if (
        !hasEventData ||
        !tracksResourceResolved ||
        (Array.isArray(visibleEvents) && visibleEvents?.length === 0)
      ) {
        return { dataview, data: [] }
      }

      const eventsResourcesFiltered = eventsResources.filter(({ dataset }) => {
        if (visibleEvents === 'all') {
          return true
        }
        return dataset.configuration?.type && visibleEvents.includes(dataset.configuration?.type)
      })

      const data = eventsResourcesFiltered.flatMap(({ url }) => {
        if (!url || !resources[url].data) {
          return []
        }

        return resources[url].data as ApiEvent[]
      })
      return { dataview, data }
    })
    return vesselsEvents
  }
)

export interface RenderedEvent extends ApiEvent {
  color: string
  description: string
  descriptionGeneric: string
}

export const selectEventsWithRenderingInfo = createSelector(
  [selectEventsForTracks, selectResources],
  (eventsForTrack, resources) => {
    const eventsWithRenderingInfo: RenderedEvent[][] = eventsForTrack.map(({ dataview, data }) => {
      const { url: infoUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Vessels)
      const infoResource = resources[infoUrl] as Resource<Vessel>
      return (data || []).map((event: ApiEvent, index) => {
        const vesselName = infoResource?.data?.shipname || 'unknown vessel'

        let description
        let descriptionGeneric
        switch (event.type) {
          case EventTypes.Encounter:
            if (event.encounter) {
              description = `${vesselName} ${t(
                'event.encounterActionWith',
                'had an encounter with'
              )} ${
                event.encounter.vessel.name
                  ? event.encounter.vessel.name
                  : t('event.encounterAnotherVessel', 'another vessel')
              } `
            }
            descriptionGeneric = `${vesselName} ${t('event.encounter')}`
            break
          case EventTypes.Port:
            if (event.port && event.port.name) {
              description = `${vesselName} ${t('event.portAt', { port: event.port.name })} `
            } else {
              description = `${vesselName} ${t('event.portAction')}`
            }
            descriptionGeneric = `${vesselName} ${t('event.port')}`
            break
          case EventTypes.Loitering:
            description = `${vesselName} ${t('event.loiteringAction')}`
            descriptionGeneric = `${vesselName} ${t('event.loitering')}`
            break
          case EventTypes.Fishing:
            description = `${vesselName} ${t('event.fishingAction')}`
            descriptionGeneric = `${vesselName} ${t('event.fishing')}`
            break
          default:
            description = t('event.unknown', 'Unknown event')
            descriptionGeneric = t('event.unknown', 'Unknown event')
        }
        const duration = DateTime.fromMillis(event.end as number)
          .diff(DateTime.fromMillis(event.start as number), ['hours', 'minutes'])
          .toObject()

        description = [
          description,
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
        if (event.type === 'encounter' && dataview.config?.showAuthorizationStatus) {
          colorKey = `${colorKey}${event.encounter?.authorizationStatus}`
        }
        const color = EVENTS_COLORS[colorKey]
        const colorLabels = EVENTS_COLORS[`${colorKey}Labels`]

        return {
          ...event,
          color,
          colorLabels,
          description,
          descriptionGeneric,
        }
      })
    })
    return eventsWithRenderingInfo
  }
)
