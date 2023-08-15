import { createSelector } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { resolveDataviewDatasetResources } from '@globalfishingwatch/dataviews-client'
import {
  ApiEvent,
  DatasetTypes,
  EventTypes,
  ResourceStatus,
  Segment,
} from '@globalfishingwatch/api-types'
import { selectTimeRange, selectVisibleEvents } from 'features/app/app.selectors'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import { selectResources } from 'features/resources/resources.slice'
import { selectSelfReportedVesselIds } from 'features/vessel/vessel.slice'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'

export const selectResourcesByType = (type: DatasetTypes) =>
  createSelector([selectActiveTrackDataviews, selectResources], (trackDataviews, resources) => {
    return trackDataviews?.flatMap((dataview) => {
      return resolveDataviewDatasetResources(dataview, type).flatMap((eventResource) => {
        return resources[eventResource.url] || []
      })
    })
  })

export const selectEventsResources = createSelector(
  [selectResourcesByType(DatasetTypes.Events)],
  (events) => events
)

export const selectTrackResources = createSelector(
  [selectResourcesByType(DatasetTypes.Tracks)],
  (events) => events
)

export const selectVesselEventsResources = createSelector(
  [selectEventsResources, selectSelfReportedVesselIds],
  (eventsResources, vesselIds) => {
    return eventsResources?.filter((r) => {
      return r.datasetConfig?.query?.some((q) => {
        if (q.id === 'vessels') {
          return Array.isArray(q.value)
            ? q.value.some((v) => vesselIds?.includes(v))
            : vesselIds?.includes(q.value as string)
        }
        return false
      })
    })
  }
)

export const selectVesselTrackResources = createSelector(
  [selectTrackResources, selectSelfReportedVesselIds],
  (trackResources, vesselIds) => {
    return trackResources?.filter((r) => {
      return r.datasetConfig?.params?.some((param) => {
        if (param.id === 'vesselId') {
          const paramVesselIds = (param.value as string).includes(',')
            ? (param.value as string).split(',')
            : [param.value as string]
          return paramVesselIds.some((v) => vesselIds?.includes(v))
        }
        return false
      })
    })
  }
)

export const selectVesselEventsData = createSelector(
  [selectVesselEventsResources],
  (eventsResources) => {
    return eventsResources
      ?.flatMap((r) => (r.data as ApiEvent[]) || [])
      .sort((a, b) => (a.start > b.start ? -1 : 1))
  }
)

export const selectVesselTracksData = createSelector(
  [selectVesselTrackResources],
  (trackResources) => {
    return trackResources.flatMap((r) =>
      r.status === ResourceStatus.Finished ? (r.data as Segment[]) || [] : []
    )
  }
)

export const selectVesselVisibleEventsData = createSelector(
  [selectVesselEventsData, selectVisibleEvents],
  (events, visibleEvents) => {
    if (visibleEvents === 'all') return events
    return events.filter(({ type }) => visibleEvents.includes(type))
  }
)

export const selectVesselEventsDataWithVoyages = createSelector(
  [selectVesselVisibleEventsData],
  (events): ActivityEvent[] => {
    let voyage = 1
    return events?.map((event) => {
      const currentVoyage = voyage
      if (event.type === EventTypes.Port) {
        voyage++
      }
      return { ...event, voyage: currentVoyage }
    })
  }
)

export const selectOngoingVoyageId = createSelector(
  [selectVesselEventsDataWithVoyages],
  (eventsWithVoyages): ActivityEvent['voyage'] => {
    return eventsWithVoyages[0]?.voyage
  }
)

export const selectVesselEventsFilteredByTimerange = createSelector(
  [selectVesselEventsDataWithVoyages, selectTimeRange],
  (events, timerange) => {
    const startMillis = DateTime.fromISO(timerange.start as string, { zone: 'utc' }).toMillis()
    const endMillis = DateTime.fromISO(timerange.end as string, { zone: 'utc' }).toMillis()
    if (!timerange) return events ?? []
    return (
      events?.filter((event) => {
        return (event.end as number) >= startMillis && (event.start as number) <= endMillis
      }) || []
    )
  }
)

export const selectHasVesselEventsFilteredByTimerange = createSelector(
  [selectVesselEventsFilteredByTimerange],
  (events) => {
    return events?.length > 0
  }
)
