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

export type VesselInfo = {
  callsign: string
  flag: string
  geartype: string
  imo: string
  shipname: string
  nShipname: string
  shiptype: VesselType
  ssvid: string
  sourceCode: string[]
  transmissionDateFrom: string
  transmissionDateTo: string
}

export type VesselTMTInfo = {
  grossTonnage?: string
  imageList?: string[]
  length?: string
  operator?: string
  origin?: string
  owner?: string
  registeredGearType?: string
  type?: string
}

export type VesselCoreInfo = VesselInfo & {
  id: string
  firstTransmissionDate: string
  lastTransmissionDate: string
  ssvid: string
  years?: number[]
  posCount?: number
  msgCount?: number
  // VMS Custom data
  casco?: string
  fleet?: string
  depth?: string
  matricula?: string
  nationalId?: string
  vesselType?: string
}

export type VesselRegistryInfo = VesselInfo & {
  latestVesselInfo: true
  lengthM: number
  matchFields: string
  recordId: string
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
  dataset: string
  coreInfo: VesselCoreInfo
  registryInfo?: VesselRegistryInfo[]
  registryOwners?: VesselRegistryOwner[]
  registryAuthorizations?: VesselRegistryAuthorization[]
}

export interface VesselSearch extends Vessel {
  dataset: string
  source: string // Label of the dataset
  vesselMatchId: string
}

export interface RelatedVesselSearchMerged extends VesselSearch {
  relatedVessels: VesselSearch[]
}
