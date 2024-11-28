import type { VesselAPISource } from 'types'

export type FlagColor = {
  black: string[]
  grey: string[]
}
export type MOU = {
  tokyo: FlagColor
  paris: FlagColor
}

export type AISCoverage = {
  blocks: number
  blocksWithPositions: number
  percentage: number
  voyages: number
}

export type LocationRelatedEventIndicators = {
  mou: MOU
  eventsInForeignEEZ: string[]
  eventsInMPA: string[]
  eventsInRFMO: string[]
  eventsInRFMOWithoutAuthorization: string[]
}

export type PortVisitsIndicators = {
  nonPSMAPortState: string[]
}

export type GapsIndicators = {
  intentionalDisabling: string[]
}

export type VesselIdentityHistoryValue = {
  from: string
  to: string
  value: string
  source: VesselAPISource
}

export type VesselIdentityIndicators = {
  flags: VesselIdentityHistoryValue[]
  iuuListed: boolean | null
  mou: MOU
  names: VesselIdentityHistoryValue[]
  operators: VesselIdentityHistoryValue[]
  owners: VesselIdentityHistoryValue[]
}

export type FlagOnMOU = {
  name: string
  type: string
  flags: string[]
}

export type Indicator = {
  id: string
  coverage: AISCoverage
  encounters: LocationRelatedEventIndicators
  fishing: LocationRelatedEventIndicators
  portVisits: PortVisitsIndicators
  loitering: LocationRelatedEventIndicators
  vesselIdentity: VesselIdentityIndicators
  gaps: GapsIndicators
}

export enum IndicatorType {
  coverage = 'coverage',
  encounter = 'encounter',
  fishing = 'fishing',
  gap = 'gap',
  portVisit = 'port-visit',
  vesselIdentity = 'vessel-identity',
}
