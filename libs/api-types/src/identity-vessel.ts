import { VesselType } from './vessel'

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

type IdentityShiptypeByYear = {
  shiptype: VesselType
  years: number[]
}

type SelfReportedMatchFields = 'ID_MATCH_ONLY' | 'SEVERAL_FIELDS'

export type SelfReportedInfo = VesselInfo & {
  ssvid: string
  shiptypesByYear?: IdentityShiptypeByYear[]
  posCount?: number
  msgCount?: number
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
}

export type VesselRegistryOwner = VesselRegistryProperty & {
  name: string
  flag: string
}

export type VesselRegistryAuthorization = VesselRegistryProperty

export interface IdentityVessel {
  dataset: string
  selfReportedInfo: SelfReportedInfo[]
  registryInfo?: VesselRegistryInfo[]
  registryOwners?: VesselRegistryOwner[]
  registryAuthorizations?: VesselRegistryAuthorization[]
}
