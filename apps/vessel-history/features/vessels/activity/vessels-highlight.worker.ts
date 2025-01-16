import type { Anchorage, EventTypes } from '@globalfishingwatch/api-types'

import { anyRegion } from 'features/regions/regions.slice'
import type { Settings, SettingsEvents, SettingsPortVisits } from 'features/settings/settings.slice'

import type { RenderedEvent } from './vessels-activity.selectors'

const isNullOrUndefined = (value: any) => value === undefined || value === null

const isAnyRegionFilterSet = (filter: SettingsEvents) =>
  (!isNullOrUndefined(filter.eezs) && (filter.eezs ?? []).length > 0) ||
  (!isNullOrUndefined(filter.rfmos) && (filter.rfmos ?? []).length > 0) ||
  (!isNullOrUndefined(filter.mpas) && (filter.mpas || []).length > 0)

const isAnyFilterSet = (filter: SettingsEvents) =>
  isAnyRegionFilterSet(filter) ||
  !isNullOrUndefined(filter.duration) ||
  !isNullOrUndefined(filter.distanceShoreLonger) ||
  !isNullOrUndefined(filter.distancePortLonger)

const matchAnyValueLonger = (value: number[], longerThan?: number) =>
  isNullOrUndefined(longerThan) ||
  longerThan === undefined ||
  (Number.isFinite(longerThan) &&
    longerThan !== null &&
    longerThan >= 0 &&
    Math.max(...value) > longerThan)

const matchAnyRegion = (eventRegions: string[] = [], regions: string[] = []) =>
  // when there are regions defined to highlight
  // if ANY option was selected and the event is assigned to one region at least
  (regions.includes(anyRegion.id) && eventRegions.length > 0) ||
  // or at least one of the selected regions is assigned to the event
  regions.filter((e) => eventRegions.map((r) => `${r}`).includes(`${e}`)).length > 0

const filterActivityEvent = (event: RenderedEvent, filter?: SettingsEvents) =>
  filter &&
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
        matchAnyRegion(event.regions.mpa, filter.mpas)))) &&
  matchAnyValueLonger([event.duration], filter.duration) &&
  matchAnyValueLonger(
    [
      event.distances.startDistanceFromShoreKm ?? event.distances.endDistanceFromShoreKm,
      event.distances.endDistanceFromShoreKm,
    ],
    filter.distanceShoreLonger
  ) &&
  matchAnyValueLonger(
    [
      event.distances.startDistanceFromPortKm ?? event.distances.endDistanceFromPortKm,
      event.distances.endDistanceFromPortKm,
    ],
    filter.distancePortLonger
  )

const isAnyFlagFilterSet = (filter?: SettingsPortVisits) =>
  filter && !isNullOrUndefined(filter.flags) && (filter.flags ?? []).length > 0

const isAnyPortFilterSet = (filter?: SettingsPortVisits) =>
  filter &&
  (isAnyFlagFilterSet(filter) ||
    !isNullOrUndefined(filter.duration) ||
    !isNullOrUndefined(filter.distanceShoreLonger))

const matchAnyPortFlag = (port: Anchorage | undefined, regions: string[] = []) =>
  port === undefined || port === null || matchAnyRegion([port.flag], regions)

const filterPortEvent = (event: RenderedEvent, filter: SettingsPortVisits) =>
  filter &&
  isAnyPortFilterSet(filter) &&
  // no flag filter is set
  (!isAnyFlagFilterSet(filter) ||
    // or when flag filter is set
    (isAnyFlagFilterSet(filter) &&
      // any port country is matched
      (matchAnyPortFlag(event.port_visit?.startAnchorage, filter.flags) ||
        matchAnyPortFlag(event.port_visit?.intermediateAnchorage, filter.flags) ||
        matchAnyPortFlag(event.port_visit?.endAnchorage, filter.flags)))) &&
  matchAnyValueLonger([event.duration], filter.duration) &&
  matchAnyValueLonger(
    [
      event.distances.startDistanceFromShoreKm ?? event.distances.endDistanceFromShoreKm,
      event.distances.endDistanceFromShoreKm,
    ],
    filter.distanceShoreLonger
  )

export function filterActivityHighlightEvents(events: RenderedEvent[], settings: Settings) {
  const filterByEventType: Record<EventTypes, ((event: RenderedEvent) => boolean) | undefined> = {
    encounter: (event) => settings.enabled && filterActivityEvent(event, settings.encounters),
    fishing: (event) => settings.enabled && filterActivityEvent(event, settings.fishingEvents),
    loitering: (event) => settings.enabled && filterActivityEvent(event, settings.loiteringEvents),
    port_visit: (event) => settings.enabled && filterPortEvent(event, settings.portVisits),
    gap: (event) => settings.enabled && filterActivityEvent(event, settings.gapEvents),
  }
  return events
    .filter((event: RenderedEvent) => {
      const filterByTypeSettings = filterByEventType[event.type]
      return filterByTypeSettings && filterByTypeSettings(event)
    })
    .sort((a, b) => (b.timestamp as number) - (a.timestamp as number))
}

export function isAnyHighlightsSettingDefined(settings: Settings) {
  return (
    settings.enabled &&
    (isAnyFilterSet(settings.fishingEvents) ||
      isAnyFilterSet(settings.encounters) ||
      isAnyFilterSet(settings.loiteringEvents) ||
      isAnyPortFilterSet(settings.portVisits) ||
      isAnyFilterSet(settings.gapEvents))
  )
}
const mod = { filterActivityHighlightEvents, isAnyHighlightsSettingDefined }
export default mod
