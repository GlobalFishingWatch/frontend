import { createSelector } from '@reduxjs/toolkit'
import { groupBy } from 'lodash'
import { EventTypes, RegionType, ResourceStatus } from '@globalfishingwatch/api-types'
import { ApiEvent } from '@globalfishingwatch/api-types'
import { selectVesselAreaSubsection } from 'features/vessel/vessel.config.selectors'
import { selectEventsResources, selectVesselEventsFilteredByTimerange } from '../vessel.selectors'

export enum ActivityEventSubType {
  Entry = 'port_entry',
  Exit = 'port_exit',
}
export interface ActivityEvent extends ApiEvent {
  voyage: number
  subType?: ActivityEventSubType
}

export const selectVesselEventsLoading = createSelector([selectEventsResources], (resources) =>
  resources.some((resource) => resource?.status === ResourceStatus.Loading)
)

export const selectActivitySummary = createSelector(
  [selectVesselEventsFilteredByTimerange],
  (events) => {
    const { activityRegions, mostVisitedPortCountries } = events.reduce(
      (acc, e) => {
        Object.entries(e.regions || {}).forEach(([regionType, ids]) => {
          if (!acc.activityRegions[regionType]) {
            acc.activityRegions[regionType] = []
          }
          ids.forEach((id) => {
            // Discard FAO areas other than major
            if (RegionType.fao && id.split('.').length > 1) return
            const index = acc.activityRegions[regionType].findIndex((r) => r.id === id)
            if (index === -1) {
              acc.activityRegions[regionType].push({ id, count: 1 })
            } else {
              acc.activityRegions[regionType][index].count++
            }
          })
        })
        const portFlag = e.port_visit?.intermediateAnchorage?.flag
        if (!portFlag) return acc
        if (!acc.mostVisitedPortCountries[portFlag]) {
          acc.mostVisitedPortCountries[portFlag] = 0
        }
        acc.mostVisitedPortCountries[portFlag]++
        return acc
      },
      { activityRegions: {}, mostVisitedPortCountries: {} as Record<string, number> }
    )
    return {
      activityRegions,
      mostVisitedPortCountries: Object.entries(mostVisitedPortCountries)
        .sort((a, b) => b[1] - a[1])
        .map(([flag, count]) => ({ flag, count })),
    }
  }
)

export const selectEventsGroupedByType = createSelector(
  [selectVesselEventsFilteredByTimerange],
  (eventsList) => {
    return groupBy(eventsList, 'type')
  }
)

export const selectEventsGroupedByArea = createSelector(
  [selectVesselEventsFilteredByTimerange, selectVesselAreaSubsection],
  (eventsList, area) => {
    const regionCounts: Record<string, Record<'total' | EventTypes, number>> = eventsList.reduce(
      (acc, event) => {
        let eventAreas = event.regions?.[area]
        if (area === 'fao') {
          eventAreas = eventAreas?.filter((area) => area.split('.').length === 1)
        }
        const eventType = event.type
        eventAreas?.forEach((eventArea) => {
          if (!acc[eventArea]) {
            acc[eventArea] = { total: 1 }
          } else {
            acc[eventArea].total++
          }
          if (!acc[eventArea][eventType]) {
            acc[eventArea][eventType] = 1
          } else {
            acc[eventArea][eventType]++
          }
        })
        return acc
      },
      {}
    )
    return Object.entries(regionCounts)
      .map(([region, counts]) => ({ region, ...(counts || {}) }))
      .sort((a, b) => b.total - a.total)
  }
)

export const selectEventsGroupedByVoyages = createSelector(
  [selectVesselEventsFilteredByTimerange],
  (eventsList) => {
    const eventsListWithEntryExitEvents = eventsList.flatMap((event, index) => {
      if (event.type === EventTypes.Port) {
        const voyage = eventsList[index + 1]?.voyage
        if (!voyage) {
          return { ...event, subType: ActivityEventSubType.Exit }
        }
        return [
          { ...event, subType: ActivityEventSubType.Exit },
          { ...event, voyage, subType: ActivityEventSubType.Entry },
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
