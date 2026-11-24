/** Vessel profile: get_vessel_identity, get_vessel_activity, get_vessel_areas, get_vessel_related, get_vessel_insights */

import type { AssistantLoadStatus, AssistantTimeRange } from './shared-context-tool.types.js'

export type AssistantVesselIdentity = {
  id?: string
  /** registry / selfReported */
  source?: string
  shipname?: string
  flag?: string
  /** MMSI */
  ssvid?: string
  imo?: string
  callsign?: string
  shiptypes?: string[]
  geartypes?: string[]
  sourceCode?: string[]
  /** Registry only. A string when the registry needs the user to log in to show it */
  lengthM?: number | string
  /** Registry only. A string when the registry needs the user to log in to show it */
  tonnageGt?: number | string
  from?: string
  to?: string
}

export type AssistantVesselIdentityContext =
  | { status: string }
  | {
      status: string
      /** The identity the profile header shows */
      shown: AssistantVesselIdentity
      /** Every identity over time */
      identities: AssistantVesselIdentity[]
      authorizations?: {
        sourceCode?: string[]
        dateFrom?: string
        dateTo?: string
        ssvid?: string
      }[]
      owners?: { name?: string; flag?: string; dateFrom?: string; dateTo?: string }[]
    }

export type AssistantVesselActivity = {
  timeRange: AssistantTimeRange
  /** The open profile section */
  section?: string
  /** Event counts by event type: fishing, encounter, loitering, port_visit, gap */
  eventsByType: Record<string, number>
  voyages: number
  fishingHours: number
  /** By region type (eez, fao, rfmo, mpa) */
  regions: Record<string, { id: string; name: string; events: number }[]>
  mostVisitedPortCountries: { flag: string; count: number }[]
}

export type AssistantVesselAreas = {
  /** eez, fao, rfmo, mpa */
  areaType: string
  /** `region` id, `name`, `total` and a count per event type */
  areas: { region: string; name: string; total: number; [eventType: string]: string | number }[]
}

export type AssistantVesselRelated = {
  totalEncounteredVessels: number
  encountered: {
    id: string
    shipname?: string
    flag?: string
    ssvid?: string
    type?: string
    encounters: number
  }[]
}

export type AssistantInsightList = {
  totalTimesListed?: number
  totalTimesListedInThePeriod?: number
  valuesInThePeriod?: unknown[]
}

export type AssistantVesselInsight =
  /** COVERAGE */
  | { percentage?: number }
  /** GAP */
  | { events?: number; eventsGapOff?: number }
  /** FISHING */
  | {
      events?: number
      eventsInNoTakeMPAs?: number
      eventsInRFMOWithoutKnownAuthorization?: number
    }
  /** IUU and FLAG-CHANGES lists */
  | AssistantInsightList
  /** MOU lists */
  | { tokyo?: AssistantInsightList; paris?: AssistantInsightList }

export type AssistantVesselInsights = {
  timeRange: AssistantTimeRange
  /** By insight id (COVERAGE, GAP, FISHING, VESSEL-IDENTITY-*), null when it has no data */
  insights: Record<string, AssistantVesselInsight | { status: AssistantLoadStatus } | null>
}
