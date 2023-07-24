import { createSelector } from '@reduxjs/toolkit'
import { groupBy } from 'lodash'
import { EventTypes, ResourceStatus } from '@globalfishingwatch/api-types'
import { ApiEvent } from '@globalfishingwatch/api-types'
import { selectEventsResources, selectVesselEventsFilteredByTimerange } from '../vessel.selectors'

export type ActivityEventSubType = 'entry' | 'exit'
export interface ActivityEvent extends ApiEvent {
  voyage: number
  subType?: ActivityEventSubType
}

export const selectVesselEventsLoading = createSelector([selectEventsResources], (resources) =>
  resources.some((resource) => resource?.status === ResourceStatus.Loading)
)

export const selectActivityRegions = createSelector(
  [selectVesselEventsFilteredByTimerange],
  (events) => {
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
  }
)

export const selectEventsGroupedByType = createSelector(
  [selectVesselEventsFilteredByTimerange],
  (eventsList) => {
    return groupBy(eventsList, 'type')
  }
)

export const selectEventsGroupedByVoyages = createSelector(
  [selectVesselEventsFilteredByTimerange],
  (eventsList) => {
    const eventsListWithEntryExitEvents = eventsList.flatMap((event, index) => {
      if (event.type === EventTypes.Port) {
        const voyage = eventsList[index + 1]?.voyage
        if (!voyage) {
          return event
        }
        return [
          { ...event, subType: 'exit' as ActivityEventSubType },
          { ...event, voyage, subType: 'entry' as ActivityEventSubType },
        ]
      }
      return event
    })
    return groupBy(eventsListWithEntryExitEvents, 'voyage')
  }
)
export const selectVoyagesNumber = createSelector([selectEventsGroupedByVoyages], (voyages) => {
  return Object.keys(voyages).length
})
