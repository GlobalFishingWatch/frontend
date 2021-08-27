import { createSelector } from '@reduxjs/toolkit'
import { Anchorage, EventTypes } from '@globalfishingwatch/api-types/dist'
import { anyRegion } from 'features/regions/regions.slice'
import {
  selectSettings,
  SettingsEvents,
  SettingsPortVisits,
} from 'features/settings/settings.slice'
import { RenderedEvent, selectEventsWithRenderingInfo } from './vessels-activity.selectors'

const isAnyRegionFilterSet = (filter: SettingsEvents) =>
  (filter.eezs !== undefined && filter.eezs.length > 0) ||
  (filter.rfmos !== undefined && filter.rfmos.length > 0) ||
  (filter.mpas !== undefined && filter.mpas.length > 0)

const isAnyFilterSet = (filter: SettingsEvents) =>
  isAnyRegionFilterSet(filter) ||
  filter.duration !== undefined ||
  filter.distanceShoreLonger !== undefined ||
  filter.distancePortLonger !== undefined

const matchDurationLonger = (duration: number, durationLongerThan?: number) =>
  durationLongerThan === undefined ||
  (durationLongerThan !== undefined && durationLongerThan >= 0 && duration > durationLongerThan)

const matchAnyDistanceLonger = (eventDistances: number[], distanceLongerThan?: number) =>
  distanceLongerThan === undefined ||
  (distanceLongerThan !== undefined &&
    distanceLongerThan >= 0 &&
    Math.max(...eventDistances) > distanceLongerThan)

const matchAnyRegion = (eventRegions: string[] = [], regions: string[] = []) =>
  // when there are regions defined to highlight
  // if ANY option was selected and the event is assigned to one region at least
  (regions.includes(anyRegion.id) && eventRegions.length > 0) ||
  // or at least one of the selected regions is assigned to the event
  regions.filter((e) => eventRegions.includes(e)).length > 0

const filterActivityEvent = (event: RenderedEvent, filter: SettingsEvents) =>
  isAnyFilterSet(filter) &&
  // no region filter is set
  (!isAnyRegionFilterSet(filter) ||
    // or if any is set, then at least one of them should match
    (isAnyRegionFilterSet(filter) &&
      // any eez is matched
      (matchAnyRegion(event.regions.eez, filter.eezs) ||
        // any rfmo is matched
        matchAnyRegion(event.regions.rfmo, filter.rfmos) ||
        // any mpa is matched (VERIFY/CONFIRM IF THIS IS CORRECT)
        matchAnyRegion(event.regions.mpant, filter.mpas) ||
        matchAnyRegion(event.regions.mparu, filter.mpas) ||
        matchAnyRegion(event.regions.mregion, filter.mpas)))) &&
  matchDurationLonger(event.duration, filter.duration) &&
  matchAnyDistanceLonger(
    [
      event.distances.startDistanceFromShoreKm ?? event.distances.endDistanceFromShoreKm,
      event.distances.endDistanceFromShoreKm,
    ],
    filter.distanceShoreLonger
  ) &&
  matchAnyDistanceLonger(
    [
      event.distances.startDistanceFromPortKm ?? event.distances.endDistanceFromPortKm,
      event.distances.endDistanceFromPortKm,
    ],
    filter.distancePortLonger
  )

const isAnyFlagFilterSet = (filter: SettingsPortVisits) =>
  filter.flags !== undefined && filter.flags.length > 0

const isAnyPortFilterSet = (filter: SettingsPortVisits) =>
  (filter.flags !== undefined && filter.flags.length > 0) ||
  filter.duration !== undefined ||
  filter.distanceShoreLonger !== undefined

const matchAnyPortFlag = (port: Anchorage | undefined, regions: string[] = []) =>
  port === undefined || matchAnyRegion([port.flag], regions)

const filterPortEvent = (event: RenderedEvent, filter: SettingsPortVisits) =>
  isAnyPortFilterSet(filter) &&
  // no flag filter is set
  (!isAnyFlagFilterSet(filter) ||
    // or when flag filter is set
    (isAnyFlagFilterSet(filter) &&
      // any port country is matched
      (matchAnyPortFlag(event.port_visit?.startAnchorage, filter.flags) ||
        matchAnyPortFlag(event.port_visit?.intermediateAnchorage, filter.flags) ||
        matchAnyPortFlag(event.port_visit?.endAnchorage, filter.flags)))) &&
  matchDurationLonger(event.duration, filter.duration) &&
  matchAnyDistanceLonger(
    [
      event.distances.startDistanceFromShoreKm ?? event.distances.endDistanceFromShoreKm,
      event.distances.endDistanceFromShoreKm,
    ],
    filter.distanceShoreLonger
  )

export const selectActivityHighlightEvents = createSelector(
  [selectEventsWithRenderingInfo, selectSettings],
  (events, settings) => {
    const filterByEventType: Record<EventTypes, ((event: RenderedEvent) => boolean) | undefined> = {
      encounter: (event) => filterActivityEvent(event, settings.encounters),
      fishing: (event) => filterActivityEvent(event, settings.fishingEvents),
      loitering: (event) => filterActivityEvent(event, settings.loiteringEvents),
      port_visit: (event) => filterPortEvent(event, settings.portVisits),
      gap: undefined,
    }
    return events
      .flat()
      .filter((event: RenderedEvent) => {
        const filterByTypeSettings = filterByEventType[event.type]
        return filterByTypeSettings && filterByTypeSettings(event)
      })
      .sort((a, b) => (a.start > b.start ? -1 : 1))
  }
)

export const selectAnyHighlightsSettingDefined = createSelector([selectSettings], (settings) => {
  return (
    isAnyFilterSet(settings.fishingEvents) ||
    isAnyFilterSet(settings.encounters) ||
    isAnyFilterSet(settings.loiteringEvents) ||
    isAnyPortFilterSet(settings.portVisits)
  )
})
