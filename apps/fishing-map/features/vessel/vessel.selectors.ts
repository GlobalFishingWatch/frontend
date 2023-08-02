import { createSelector } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { resolveDataviewDatasetResources } from '@globalfishingwatch/dataviews-client'
import { ApiEvent, DatasetTypes, EventTypes } from '@globalfishingwatch/api-types'
import { selectTimeRange, selectVisibleEvents } from 'features/app/app.selectors'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import { selectResources } from 'features/resources/resources.slice'
import { selectVesselInfoDataId } from 'features/vessel/vessel.slice'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'

export const selectEventsResources = createSelector(
  [selectActiveTrackDataviews, selectResources],
  (trackDataviews, resources) => {
    return trackDataviews?.flatMap((dataview) => {
      return resolveDataviewDatasetResources(dataview, DatasetTypes.Events).flatMap(
        (eventResource) => {
          return resources[eventResource.url] || []
        }
      )
    })
  }
)

export const selectVesselEventsResources = createSelector(
  [selectEventsResources, selectVesselInfoDataId],
  (eventsResources, vesselId) => {
    return eventsResources?.filter((r) => {
      return r.datasetConfig?.query?.some((q) => q.id === 'vessels' && q.value === vesselId)
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
