import { Anchorage, EventTypes } from '@globalfishingwatch/api-types/dist'
import { anyRegion } from 'features/regions/regions.slice'
import { Settings, SettingsEvents, SettingsPortVisits } from 'features/settings/settings.slice'
import { RenderedEvent } from './vessels-activity.selectors'

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
  regions.filter((e) => eventRegions.includes(`${e}`)).length > 0

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

const isAnyFlagFilterSet = (filter: SettingsPortVisits) =>
  !isNullOrUndefined(filter.flags) && (filter.flags ?? []).length > 0

const isAnyPortFilterSet = (filter: SettingsPortVisits) =>
  isAnyFlagFilterSet(filter) ||
  !isNullOrUndefined(filter.duration) ||
  !isNullOrUndefined(filter.distanceShoreLonger)

const matchAnyPortFlag = (port: Anchorage | undefined, regions: string[] = []) =>
  port === undefined || port === null || matchAnyRegion([port.flag], regions)

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
    encounter: (event) => filterActivityEvent(event, settings.encounters),
    fishing: (event) => filterActivityEvent(event, settings.fishingEvents),
    loitering: (event) => filterActivityEvent(event, settings.loiteringEvents),
    port_visit: (event) => filterPortEvent(event, settings.portVisits),
    gap: undefined,
  }
  return events.filter((event: RenderedEvent) => {
    const filterByTypeSettings = filterByEventType[event.type]
    return filterByTypeSettings && filterByTypeSettings(event)
  })
}

export function isAnyHighlightsSettingDefined(settings: Settings) {
  return (
    isAnyFilterSet(settings.fishingEvents) ||
    isAnyFilterSet(settings.encounters) ||
    isAnyFilterSet(settings.loiteringEvents) ||
    isAnyPortFilterSet(settings.portVisits)
  )
}
const mod = { filterActivityHighlightEvents, isAnyHighlightsSettingDefined }
export default mod
