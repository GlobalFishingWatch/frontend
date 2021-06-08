import { createSelector } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { ApiEvent, DatasetTypes, Resource, TrackResourceData } from '@globalfishingwatch/api-types'
import { resolveDataviewDatasetResource } from '@globalfishingwatch/dataviews-client'
import { geoJSONToSegments, Segment } from '@globalfishingwatch/data-transforms'
import { selectTimebarGraph } from 'features/app/app.selectors'
import {
  selectActiveTrackDataviews,
  selectActiveVesselsDataviews,
  selectTrackDataviews,
} from 'features/dataviews/dataviews.selectors'
import { selectResources } from 'features/resources/resources.slice'
import { EVENTS_COLORS } from 'data/config'

type TimebarTrackSegment = {
  start: number
  end: number
}

type TimebarTrack = {
  segments: TimebarTrackSegment[]
  color: string
}

export const selectTracksData = createSelector(
  [selectActiveTrackDataviews, selectResources],
  (trackDataviews, resources) => {
    if (!trackDataviews || !resources) return

    const tracksSegments: TimebarTrack[] = trackDataviews.flatMap((dataview) => {
      const { url } = resolveDataviewDatasetResource(dataview, [
        DatasetTypes.Tracks,
        DatasetTypes.UserTracks,
      ])
      if (!url) return []
      const track = resources[url] as Resource<TrackResourceData>
      if (!track?.data) return []

      const segments = (track.data as any).features
        ? geoJSONToSegments(track.data as any)
        : (track?.data as Segment[])

      const trackSegments: TimebarTrackSegment[] = segments.map((segment) => {
        return {
          start: Math.min(...segment.map((p) => p.timestamp || Number.POSITIVE_INFINITY)),
          end: Math.max(...segment.map((p) => p.timestamp || Number.NEGATIVE_INFINITY)),
        }
      })
      return {
        segments: trackSegments,
        color: dataview.config?.color || '',
        segmentsOffsetY: track.datasetType === DatasetTypes.UserTracks,
      }
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
  [selectTrackDataviews, selectResources],
  (trackDataviews, resources) => {
    const vesselsEvents = trackDataviews.map((dataview) => {
      const { url: eventsUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Events)
      if (!eventsUrl) {
        return []
      }
      return resources[eventsUrl]?.data as ApiEvent[]
    })
    return vesselsEvents
  }
)

interface RenderedEvent extends ApiEvent {
  color: string
  description: string
}

export const selectEventsWithRenderingInfo = createSelector(
  [selectEventsForTracks],
  (eventsForTrack) => {
    const eventsWithRenderingInfo: RenderedEvent[][] = eventsForTrack.map(
      (trackEvents: ApiEvent[]) => {
        return trackEvents?.map((event: ApiEvent) => {
          const vesselName = event.vessel.name || event.vessel.id
          let description
          switch (event.type) {
            // case 'encounter':
            //   if (event.encounter && event.encounter.vessel.name) {
            //     description = `${vesselName} had an encounter with ${event.encounter.vessel.name}`
            //   } else {
            //     description = `${vesselName} had an encounter with another vessel`
            //   }
            //   break
            // case 'port':
            //   if (event.port && event.port.name) {
            //     description = `${vesselName} docked at ${event.port.name}`
            //   } else {
            //     description = `${vesselName} Docked`
            //   }
            //   break
            // case 'loitering':
            //   description = `${vesselName} loitered`
            //   break
            case 'fishing':
              description = `${vesselName} fishing`
              break
            default:
              description = 'Unknown event'
          }
          const duration = DateTime.fromMillis(event.end as number)
            .diff(DateTime.fromMillis(event.start as number), ['hours', 'minutes'])
            .toObject()
          description = `${description} for ${duration.hours}hrs ${Math.round(
            duration.minutes as number
          )}mns`

          let colorKey = event.type as string
          if (event.type === 'encounter') {
            colorKey = `${colorKey}${event.encounter?.authorizationStatus}`
          }
          const color = EVENTS_COLORS[colorKey]
          const colorLabels = EVENTS_COLORS[`${colorKey}Labels`]

          return {
            ...event,
            color,
            colorLabels,
            description,
          }
        })
      }
    )
    return eventsWithRenderingInfo
  }
)
