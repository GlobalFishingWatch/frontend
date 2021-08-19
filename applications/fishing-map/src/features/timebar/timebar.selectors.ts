import { createSelector } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import {
  ApiEvent,
  DatasetTypes,
  Resource,
  ResourceStatus,
  TrackResourceData,
} from '@globalfishingwatch/api-types'
import {
  resolveDataviewDatasetResource,
  resolveDataviewEventsResources,
} from '@globalfishingwatch/dataviews-client'
import { geoJSONToSegments, Segment } from '@globalfishingwatch/data-transforms'
import { selectTimebarGraph, selectVisibleEvents } from 'features/app/app.selectors'
import { t } from 'features/i18n/i18n'
import {
  selectActiveTrackDataviews,
  selectActiveVesselsDataviews,
} from 'features/dataviews/dataviews.selectors'
import { selectResources } from 'features/resources/resources.slice'
import { EVENTS_COLORS } from 'data/config'

type TimebarTrackSegment = {
  start: number
  end: number
}

export type TimebarTrack = {
  segments: TimebarTrackSegment[]
  color: string
}

export const selectTracksData = createSelector(
  [selectActiveTrackDataviews, selectResources],
  (trackDataviews, resources) => {
    if (!trackDataviews || !resources) return

    const tracksSegments: (TimebarTrack | null)[] = trackDataviews.flatMap((dataview) => {
      const { url } = resolveDataviewDatasetResource(dataview, [
        DatasetTypes.Tracks,
        DatasetTypes.UserTracks,
      ])
      if (!url) return null
      const track = resources[url] as Resource<TrackResourceData>
      if (!track?.data) return null

      const segments = (track.data as any).features
        ? geoJSONToSegments(track.data as any)
        : (track?.data as Segment[])

      const trackSegments: TimebarTrackSegment[] = segments.map((segment) => {
        return {
          start: segment[0].timestamp || Number.POSITIVE_INFINITY,
          end: segment[segment.length - 1].timestamp || Number.NEGATIVE_INFINITY,
        }
      })
      return {
        segments: trackSegments,
        color: dataview.config?.color || '',
        segmentsOffsetY: track.dataset.type === DatasetTypes.UserTracks,
      }
    })
    return tracksSegments
  }
)
export const selectTrackSpeedData = createSelector(
  [selectActiveTrackDataviews, selectResources],
  (trackDataviews, resources) => {
    if (!trackDataviews || !resources) return

    const tracksSegments = trackDataviews.flatMap((dataview) => {
      const { url } = resolveDataviewDatasetResource(
        dataview,
        [DatasetTypes.Tracks, DatasetTypes.UserTracks],
        { id: 'fields', value: 'speed' }
      )
      if (!url) return null
      const track = resources[url] as Resource<TrackResourceData>
      if (!track?.data) return null

      return track.data
    })
    return tracksSegments
  }
)

export const selectTracksGraphs = createSelector(
  [selectActiveVesselsDataviews, selectTimebarGraph, selectResources],
  (vesselDataviews, timebarGraph, resources) => {
    if (!vesselDataviews || vesselDataviews.length > 2 || !resources) return

    const graphs = vesselDataviews.flatMap((dataview) => {
      const { url } = resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks)
      if (!url) return []
      const track = resources[url] as Resource<TrackResourceData>
      if (!track?.data) return []

      const segmentsWithCurrentFeature = track.data?.map((segment) => {
        return segment.flatMap((pt) => {
          const value = (pt as any)[timebarGraph]
          if (!value) return []
          return {
            date: pt.timestamp,
            value,
          }
        })
      })
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
      // const { url: eventsUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Events)
      const eventsResources = resolveDataviewEventsResources(dataview)
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
  [selectEventsForTracks],
  (eventsForTrack) => {
    const eventsWithRenderingInfo: RenderedEvent[][] = eventsForTrack.map(({ dataview, data }) => {
      return (data || []).map((event: ApiEvent, index) => {
        const vesselName = event.vessel.name || event.vessel.id

        let description
        let descriptionGeneric
        switch (event.type) {
          case 'encounter':
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
          case 'port':
            if (event.port && event.port.name) {
              description = `${vesselName} ${t('event.portAt', { port: event.port.name })} `
            } else {
              description = `${vesselName} ${t('event.portAction')}`
            }
            descriptionGeneric = `${vesselName} ${t('event.port')}`
            break
          case 'loitering':
            description = `${vesselName} ${t('event.loiteringAction')}`
            descriptionGeneric = `${vesselName} ${t('event.loitering')}`
            break
          case 'fishing':
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
