export type VesselType =
  | 'SEISMIC_VESSEL'
  | 'CARRIER'
  | 'CARGO'
  | 'PASSENGER'
  | 'FISHING'
  | 'OTHER_NON_FISHING'
  | 'BUNKER_OR_TANKER'
  | 'SUPPORT'
  | 'OTHER'

export const VESSEL_TYPES = [
  'SEISMIC_VESSEL',
  'CARRIER',
  'CARGO',
  'PASSENGER',
  'FISHING',
  'OTHER_NON_FISHING',
  'BUNKER_OR_TANKER',
  'SUPPORT',
]

export type GearType =
  | 'BUNKER'
  | 'CARGO'
  | 'FISHING'
  | 'OTHER_PURSE_SEINES'
  | 'SET_GILLNETS'
  | 'DRIFTING_LONGLINES'
  | 'CARRIER'
  | 'GEAR'
  | 'TRAWLERS'
  | 'POTS_AND_TRAPS'
  | 'PURSE_SEINE_SUPPORT'
  | 'PASSENGER'
  | 'SEINERS'
  | 'NON_FISHING'
  | 'SET_LONGLINES'
  | 'DREDGE_FISHING'
  | 'INCONCLUSIVE'
  | 'POLE_AND_LINE'
  | 'OTHER'
  | 'FIXED_GEAR'
  | 'OTHER_SEINES'
  | 'CARGO_OR_TANKER'
  | 'SQUID_JIGGER'
  | 'SEISMIC_VESSEL'
  | 'TROLLERS'
  | 'SPECIALIZED_REEFER'
  | 'PATROL_VESSEL'
  | 'PURSE_SEINES'
  | 'TUNA_PURSE_SEINES'
  | 'TUG'

export const GEAR_TYPES = [
  'BUNKER',
  'CARGO',
  'FISHING',
  'OTHER_PURSE_SEINES',
  'SET_GILLNETS',
  'DRIFTING_LONGLINES',
  'CARRIER',
  'GEAR',
  'TRAWLERS',
  'POTS_AND_TRAPS',
  'PURSE_SEINE_SUPPORT',
  'PASSENGER',
  'SEINERS',
  'NON_FISHING',
  'SET_LONGLINES',
  'DREDGE_FISHING',
  'INCONCLUSIVE',
  'POLE_AND_LINE',
  'FIXED_GEAR',
  'CARGO_OR_TANKER',
  'SQUID_JIGGER',
  'SEISMIC_VESSEL',
  'TROLLERS',
  'SPECIALIZED_REEFER',
  'PATROL_VESSEL',
  'PURSE_SEINES',
  'TUNA_PURSE_SEINES',
  'TUG',
  'OTHER_SEINES',
]

export enum VesselIdentitySourceEnum {
  SelfReported = 'selfReportedInfo',
  Registry = 'registryInfo',
}

export enum SelfReportedSource {
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
  imo: string
  shipname: string
  nShipname: string
  ssvid: string
  sourceCode: SelfReportedSource[]
  transmissionDateFrom: string
  transmissionDateTo: string
  // For custom VMS or combinedSourceInfo merge simplicity
  geartypes: GearType[]
  shiptypes: VesselType[]
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

export type SelfReportedMatchFields = 'ID_MATCH_ONLY' | 'SEVERAL_FIELDS'

export const API_LOGIN_REQUIRED = 'BEARER_TOKEN_REQUIRED'
export type RegistryLoginMessage = typeof API_LOGIN_REQUIRED

export type SelfReportedInfo = VesselInfo & {
  ssvid: string
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

export type RegistryImage = {
  url: string
  copyright: string
}

export type RegistryExtraFieldValue = {
  dateFrom: string
  dateFromMask: string
  dateTo: string
  dateToMask: string
  value: number
}

export type RegistryExtraFields = {
  builtYear: RegistryExtraFieldValue
  depthM: RegistryExtraFieldValue
  hasArchiveInfo: boolean
  hasComplianceInfo: boolean
  iuuStatus: string | null
  operator: string | null
  registrySource: string
  images: RegistryImage[]
}

export type VesselRegistryInfo = VesselInfo & {
  geartypes: GearType[] | RegistryLoginMessage
  latestVesselInfo: true
  lengthM: number | RegistryLoginMessage
  matchFields: string
  recordId: string
  tonnageGt: number | RegistryLoginMessage
  vesselInfoReference: string
  extraFields?: RegistryExtraFields[]
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

export type VesselRegistryOperator = Omit<RegistryExtraFieldValue, 'value'> & {
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

export type CombinedSourceInfo = {
  name: string
  source: string
  yearFrom: number
  yearTo: number
  value?: string | boolean
}
export type VesselCombinedSourcesInfo = {
  vesselId: string
  geartypes: CombinedSourceInfo[]
  shiptypes: CombinedSourceInfo[]
  onFishingListSr?: CombinedSourceInfo[]
  inferredVesselClassAg?: CombinedSourceInfo[]
}

export interface IdentityVessel {
  combinedSourcesInfo: VesselCombinedSourcesInfo[]
  dataset: string
  matchCriteria?: VesselIdentitySearchMatchCriteria[]
  registryPublicAuthorizations?: VesselRegistryAuthorization[]
  registryInfo?: VesselRegistryInfo[]
  registryOwners?: VesselRegistryOwner[]
  operator?: VesselRegistryOperator
  selfReportedInfo: SelfReportedInfo[]
}
