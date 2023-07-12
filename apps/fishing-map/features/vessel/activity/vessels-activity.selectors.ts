import { createSelector } from '@reduxjs/toolkit'
import { resolveDataviewDatasetResources } from '@globalfishingwatch/dataviews-client'
import { DatasetTypes, ResourceStatus } from '@globalfishingwatch/api-types'
import { ApiEvent } from '@globalfishingwatch/api-types'
import { EVENTS_COLORS } from 'data/config'
import { selectResources } from 'features/resources/resources.slice'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import { selectVesselEventsFilteredByTimerange } from '../vessel.selectors'

export enum PortVisitSubEvent {
  Exit = 'exit',
  Entry = 'entry',
}

export interface ActivityEvent extends ApiEvent {
  color?: string
  timestamp: number
  subEvent?: PortVisitSubEvent
}

export const selectEventsResources = createSelector(
  [selectActiveTrackDataviews, selectResources],
  (trackDataviews, resources) => {
    return trackDataviews.flatMap((dataview) => {
      return resolveDataviewDatasetResources(dataview, DatasetTypes.Events).flatMap(
        (eventResource) => {
          return resources[eventResource.url] || []
        }
      )
    })
  }
)

export const selectEventsLoading = createSelector([selectEventsResources], (resources) =>
  resources.some((resource) => resource?.status === ResourceStatus.Loading)
)

export const selectEventsWithRenderingInfo = createSelector(
  [selectVesselEventsFilteredByTimerange],
  (events) => {
    const eventsWithRenderingInfo: ActivityEvent[] = events.map((event) => {
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
        timestamp: event.start as number,
      }
    })

    return eventsWithRenderingInfo
  }
)

export const selectFilteredEvents = createSelector([selectEventsWithRenderingInfo], (events) =>
  events.sort((a, b) => ((a.timestamp ?? a.start) > (b.timestamp ?? a.start) ? -1 : 1))
)
