import { VesselType } from './vessel'

export enum VesselIdentitySourceEnum {
  SelfReported = 'selfReportedInfo',
  Registry = 'registryInfo',
}

export enum SourceCode {
  Ais = 'AIS',
  Belize = 'VMS Belize',
  Brazil = 'VMS Brazil Onyxsat',
  Chile = 'VMS Chile',
  CostaRica = 'VMS Costa Rica',
  Ecuador = 'VMS Ecuador',
  Indonesia = 'VMS Indonesia',
  Norway = 'VMS Norway',
  Papua = 'VMS PNG',
  Peru = 'VMS Peru',
}

export type VesselInfo = {
  id: string
  callsign: string
  flag: string
  geartype: string[]
  imo: string
  shipname: string
  nShipname: string
  shiptype: VesselType
  ssvid: string
  sourceCode: SourceCode[]
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

type IdentityShiptypeByYear = {
  shiptype: VesselType
  years: number[]
}

type SelfReportedMatchFields = 'ID_MATCH_ONLY' | 'SEVERAL_FIELDS'

export type SelfReportedInfo = VesselInfo & {
  ssvid: string
  shiptypesByYear?: IdentityShiptypeByYear[]
  posCount?: number
  positionsCounter?: number
  matchFields?: SelfReportedMatchFields
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
  vesselInfoReference: string
}

export type VesselRegistryProperty = {
  dateFrom: string
  dateTo: string
  recordId: string
  sourceCode: string[]
  ssvid: string
}

export type VesselRegistryOwner = VesselRegistryProperty & {
  name: string
  flag: string
}

export type VesselRegistryAuthorization = VesselRegistryProperty

export type VesselIdentitySearchMatch = {
  property: string
  value: string
}

export type VesselIdentitySearchMatchCriteria = {
  latestVesselInfo: boolean
  matches: VesselIdentitySearchMatch[]
  period: {
    dateFrom: string
    dateTo: string
  }
  property: string
  reference: string
  source: VesselIdentitySourceEnum
}

export type CombinedSourceInfo = { name: string; source: string; yearFrom: number; yearTo: number }
export type VesselCombinedSourcesInfo = {
  vesselId: string
  geartypes: CombinedSourceInfo[]
  shiptypes: CombinedSourceInfo[]
}

export interface IdentityVessel {
  combinedSourcesInfo: VesselCombinedSourcesInfo[]
  dataset: string
  matchCriteria?: VesselIdentitySearchMatchCriteria[]
  registryAuthorizations?: VesselRegistryAuthorization[]
  registryInfo?: VesselRegistryInfo[]
  registryOwners?: VesselRegistryOwner[]
  selfReportedInfo: SelfReportedInfo[]
}
