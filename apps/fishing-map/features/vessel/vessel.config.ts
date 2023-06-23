import { EventType } from '@globalfishingwatch/api-types'

export const IDENTITY_FIELD_GROUPS = [
  ['shipname', 'flag'],
  ['shiptype', 'geartype'],
  ['ssvid', 'imo', 'callsign'],
  ['owner'],
  ['lengthM', 'tonnageGt'],
]
export const IDENTITY_FIELDS_INFO_AVAILABLE = ['geartype', 'shiptype']
export const EVENTS_INCLUDES_BASE = ['id', 'type', 'start', 'end', 'position']
export const EVENTS_INCLUDES_REGIONS = ['regions.mpa', 'regions.eez', 'regions.fao', 'regions.rfmo']

type EventConfigByType = Record<EventType, { includes: string[]; params?: Record<string, any> }>
// Workaround until we load the dataview TEMPLATE_VESSEL_DATAVIEW_SLUG to load the datasetConfig
export const EVENTS_CONFIG_BY_EVENT_TYPE: EventConfigByType = {
  fishing: {
    includes: [...EVENTS_INCLUDES_BASE, ...EVENTS_INCLUDES_REGIONS],
    params: {},
  },
  loitering: {
    includes: [...EVENTS_INCLUDES_BASE, ...EVENTS_INCLUDES_REGIONS],
    params: {},
  },
  gap: {
    includes: [...EVENTS_INCLUDES_BASE, ...EVENTS_INCLUDES_REGIONS],
    params: {},
  },
  port_visit: {
    includes: [
      ...EVENTS_INCLUDES_BASE,
      ...EVENTS_INCLUDES_REGIONS,
      'port_visit.intermediateAnchorage.name',
      'port_visit.intermediateAnchorage.flag',
    ],
    params: {
      confidences: ['4'],
    },
  },
  encounter: {
    includes: [
      ...EVENTS_INCLUDES_BASE,
      ...EVENTS_INCLUDES_REGIONS,
      'encounter.mainVesselAuthorizationStatus',
      'encounter.encounteredVesselAuthorizationStatus',
      'encounter.vessel.id',
      'encounter.vessel.name',
      'encounter.vessel.flag',
    ],
    params: {
      encounterTypes: ['carrier-fishing', 'fishing-carrier', 'fishing-support', 'support-fishing'],
    },
  },
}
