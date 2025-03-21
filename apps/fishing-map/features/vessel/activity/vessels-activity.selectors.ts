import { createSelector } from '@reduxjs/toolkit'
import { groupBy, uniqBy } from 'es-toolkit'

import type { ApiEvent, EventType, Regions, Vessel } from '@globalfishingwatch/api-types'
import { EventTypes, RegionType } from '@globalfishingwatch/api-types'

import { getEventsDatasetsInDataview } from 'features/datasets/datasets.utils'
import { selectVesselProfileDataview } from 'features/dataviews/selectors/dataviews.instances.selectors'
import {
  selectVesselActivityMode,
  selectVesselAreaSubsection,
} from 'features/vessel/vessel.config.selectors'
import { selectVesselEventType, selectVesselVoyage } from 'features/vessel/vessel.slice'
import { getUTCDateTime } from 'utils/dates'

import {
  selectVesselEventsByType,
  selectVesselEventsFilteredByTimerange,
} from '../selectors/vessel.resources.selectors'

export enum ActivityEventSubType {
  Entry = 'port_entry',
  Exit = 'port_exit',
}
export interface ActivityEvent extends ApiEvent {
  voyage: number
  subType?: ActivityEventSubType
}

export const selectEventsGroupedByType = createSelector(
  [selectVesselEventsFilteredByTimerange],
  (eventsList) => {
    return groupBy(eventsList, (e) => e.type)
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
    return groupBy(eventsListWithEntryExitEvents, (e) => e.voyage)
  }
)

export const selectVesselProfileEventsEvents = createSelector(
  [selectVesselActivityMode, selectEventsGroupedByType, selectEventsGroupedByVoyages],
  (activityMode, eventsByType, eventsByVoyage) => {
    return activityMode === 'voyage' ? eventsByVoyage : eventsByType
  }
)

export const selectVoyagesNumber = createSelector([selectEventsGroupedByVoyages], (voyages) => {
  return Object.keys(voyages).length
})

export const EVENTS_ORDER = [
  EventTypes.Port,
  EventTypes.Fishing,
  EventTypes.Encounter,
  EventTypes.Loitering,
  // EventTypes.Gap,
]

export const selectVirtuosoVesselProfileEventsByType = createSelector(
  [selectVesselEventType, selectEventsGroupedByType],
  (expandedType, activityGroups) => {
    const eventTypesWithData = EVENTS_ORDER.filter((eventType) => activityGroups[eventType])
    const eventsExpanded = eventTypesWithData.map((eventType) => {
      const expanded = expandedType === eventType
      return expanded ? activityGroups[eventType] : []
    })
    return {
      events: eventsExpanded.flat(),
      groupCounts: eventsExpanded.map((events) => events.length),
      groups: eventTypesWithData,
    }
  }
)

export const selectVirtuosoVesselProfileEventsByVoyage = createSelector(
  [selectVesselVoyage, selectEventsGroupedByVoyages],
  (expandedVoyage, voyages) => {
    const eventsExpanded = Object.entries(voyages).map(([voyage, events]) => {
      return expandedVoyage === parseInt(voyage) ? events : ([] as ActivityEvent[])
    })
    return {
      events: eventsExpanded.flat(),
      groupCounts: eventsExpanded.map((events) => events.length),
      groups: Object.keys(voyages),
    }
  }
)
export const selectVirtuosoVesselProfileEventsEvents = createSelector(
  [
    selectVesselActivityMode,
    selectVirtuosoVesselProfileEventsByType,
    selectVirtuosoVesselProfileEventsByVoyage,
  ],
  (activityMode, eventsByType, eventsByVoyage) => {
    return activityMode === 'voyage' ? eventsByVoyage : eventsByType
  }
)

export const selectActivitySummary = createSelector(
  [selectVesselEventsFilteredByTimerange],
  (events) => {
    const { activityRegions, mostVisitedPortCountries, fishingHours } = events.reduce(
      (acc, e) => {
        Object.entries<any>(e.regions || ({} as Regions)).forEach((region) => {
          const regionType = region[0] as RegionType
          const ids = region[1] as string[]
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
        if (e.type === EventTypes.Fishing) {
          acc.fishingHours += getUTCDateTime(e.end as number).diff(
            getUTCDateTime(e.start as number),
            ['hours']
          ).hours
        }
        const portFlag = e.port_visit?.intermediateAnchorage?.flag
        if (!portFlag) return acc
        if (!acc.mostVisitedPortCountries[portFlag]) {
          acc.mostVisitedPortCountries[portFlag] = 0
        }
        acc.mostVisitedPortCountries[portFlag]++
        return acc
      },
      {
        activityRegions: {} as Record<RegionType, { id: string; count: number }[]>,
        mostVisitedPortCountries: {} as Record<string, number>,
        fishingHours: 0,
      }
    )
    return {
      activityRegions,
      mostVisitedPortCountries: Object.entries(mostVisitedPortCountries)
        .sort((a, b) => b[1] - a[1])
        .map(([flag, count]) => ({ flag, count })),
      fishingHours,
    }
  }
)

export const selectVesselEventTypes = createSelector(
  [selectVesselProfileDataview],
  (vesselDataview) => {
    const eventDatasets =
      vesselDataview && uniqBy(getEventsDatasetsInDataview(vesselDataview), (e) => e.subcategory)
    return eventDatasets?.map(({ subcategory }) => subcategory as EventType) || []
  }
)

export const UNKNOWN_AREA = 'unknown-area'

export const selectEventsGroupedByArea = createSelector(
  [selectVesselEventsFilteredByTimerange, selectVesselAreaSubsection],
  (eventsList, area) => {
    const regionCounts: Record<
      string,
      Record<typeof UNKNOWN_AREA | 'total' | EventTypes, number>
    > = eventsList.reduce(
      (acc, event) => {
        let eventAreas = event.regions?.[area]
        if (!eventAreas?.length) eventAreas = [UNKNOWN_AREA]
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
      {} as Record<string, any>
    )
    return Object.entries(regionCounts)
      .map(([region, counts]) => ({ region, ...(counts || {}) }))
      .sort((a, b) => b.total - a.total)
  }
)

export const selectEventsGroupedByEncounteredVessel = createSelector(
  [selectVesselEventsByType(EventTypes.Encounter)],
  (encounters) => {
    const vesselCounts: Record<string, Vessel & { encounters: number }> = encounters.reduce(
      (acc, event) => {
        const encounteredVessel = event.encounter?.vessel
        if (encounteredVessel) {
          if (!acc[encounteredVessel.id]) {
            acc[encounteredVessel.id] = { ...encounteredVessel, encounters: 1 }
          } else {
            acc[encounteredVessel.id].encounters++
          }
        }
        return acc
      },
      {} as Record<string, any>
    )
    return Object.values(vesselCounts).sort((a, b) => b.encounters - a.encounters)
  }
)
