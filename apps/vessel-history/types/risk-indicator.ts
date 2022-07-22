import { VesselAPISource } from 'types'

export type FlagColor = {
  black: string[]
  grey: string[]
}
export type MOU = {
  tokyo: FlagColor
  paris: FlagColor
}

export type LocationRelatedEventIndicators = {
  mou: MOU
  eventsInForeignEEZ: string[]
  eventsInMPA: string[]
  eventsInRFMO: string[]
}

export type PortVisitsIndicators = {
  nonPSMAPortState: string[]
}

export type VesselIdentityHistoryValue = {
  from: string
  to: string
  value: string
  source: VesselAPISource
}

export type VesselIdentityIndicators = {
  mou: MOU
  flags: VesselIdentityHistoryValue[]
}

export type FlagOnMOU = {
  name: string
  type: string
  flags: string[]
}

export type Indicator = {
  id: string
  encounters: LocationRelatedEventIndicators
  fishing: LocationRelatedEventIndicators
  portVisits: PortVisitsIndicators
  loitering: LocationRelatedEventIndicators
  vesselIdentity: VesselIdentityIndicators
}
