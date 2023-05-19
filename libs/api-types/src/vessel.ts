export interface Authorization {
  source: string
  startDate: string
  endDate: string
  originalStartDate: number
  originalEndDate: number
}

export type VesselType =
  | 'seismic_vessel'
  | 'carrier'
  | 'cargo'
  | 'passenger'
  | 'fishing'
  | 'other_non_fishing'
  | 'bunker_or_tanker'
  | 'support'

export type VesselRegistryInfo = {
  callsign: string
  flag: string
  geartype: string
  imo: string
  latestVesselInfo: true
  lengthM: number
  matchFields: string
  nShipname: string
  recordId: string
  shipname: string
  shiptype: string
  sourceCode: string[]
  ssvid: string
  tonnageGt: number
  transmissionDateFrom: string
  transmissionDateTo: string
  vesselInfoReference: string
}
export type VesselRegistryOwner = {
  owner: string
  ownerFlag: string
  recordId: string
  sourceCode: string[]
}
export type VesselRegistryAuthorization = {
  authorizedFrom: string
  authorizedTo: string
  recordId: string
  sourceCode: string[]
}

export interface Vessel {
  authorizations?: Authorization[]
  builtYear?: string
  callsign?: string
  casco?: string
  dataset?: string
  depth?: string
  firstTransmissionDate: string
  flag: string
  fleet?: string
  geartype?: string
  grossTonnage?: string
  id: string
  imageList?: string[]
  imo?: string
  lastTransmissionDate: string
  length?: string
  matricula?: string
  mmsi?: string
  nationalId?: string
  operator?: string
  origin?: string
  owner?: string
  posCount?: number
  registeredGearType?: string
  shipname: string
  type?: string
  vesselType?: VesselType
  years?: number[]
  msgCount?: number
  vesselRegistryInfo?: VesselRegistryInfo[]
  vesselRegistryOwners?: VesselRegistryOwner[]
  vesselRegistryAuthorizations?: VesselRegistryAuthorization[]
}

export interface VesselSearch extends Vessel {
  dataset: string
  source: string // Label of the dataset
  vesselMatchId: string
}

export interface RelatedVesselSearchMerged extends VesselSearch {
  relatedVessels: VesselSearch[]
}
