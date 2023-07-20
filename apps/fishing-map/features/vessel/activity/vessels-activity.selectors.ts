import { createSelector } from '@reduxjs/toolkit'
import { ResourceStatus } from '@globalfishingwatch/api-types'
import { ApiEvent } from '@globalfishingwatch/api-types'
import { EVENTS_COLORS } from 'data/config'
import { selectEventsResources, selectVesselEventsFilteredByTimerange } from '../vessel.selectors'

export enum PortVisitSubEvent {
  Exit = 'exit',
  Entry = 'entry',
}

export interface ActivityEvent extends ApiEvent {
  color?: string
  timestamp: number
  subEvent?: PortVisitSubEvent
}

export const selectVesselEventsLoading = createSelector([selectEventsResources], (resources) =>
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

export const selectActivityRegions = createSelector([selectFilteredEvents], (events) => {
  const activityRegions = events.reduce((acc, e) => {
    Object.entries(e.regions || {}).forEach(([regionType, ids]) => {
      if (!acc[regionType]) {
        acc[regionType] = []
      }
      ids.forEach((id) => {
        const index = acc[regionType].findIndex((r) => r.id === id)
        if (index === -1) {
          acc[regionType].push({ id, count: 1 })
        } else {
          acc[regionType][index].count++
        }
      })
    })
    return acc
  }, {})
  return activityRegions
})
