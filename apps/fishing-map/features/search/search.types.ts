import type { GearType, VesselIdentitySourceEnum, VesselType } from '@globalfishingwatch/api-types'

import type { SearchType } from './search.config'

export type VesselSearchState = {
  id?: string
  query?: string
  shipname?: string
  sources?: string[]
  searchOption?: SearchType
  infoSource?: VesselIdentitySourceEnum
  ssvid?: string
  imo?: string
  callsign?: string
  flag?: string[]
  geartypes?: GearType[]
  shiptypes?: VesselType[]
  transmissionDateFrom?: string
  transmissionDateTo?: string
  owner?: string
  // VMS pipe 3
  origin?: string
  fleet?: string[]
  externalId?: string
  nationalId?: string
  codMarinha?: string
  targetSpecies?: string
  // VMS pipe 4
  'selfReportedInfo.externalId'?: string
  'selfReportedInfo.sourceFleet'?: string[]
  // VMS-PER
  'selfReportedInfo.hull'?: string
  'selfReportedInfo.origin'?: string
  // VMS-BRA
  'selfReportedInfo.fishingLicenseCode'?: string
  'selfReportedInfo.fleetCode'?: string
  'selfReportedInfo.vesselRegistrationCode'?: string
}

export type VesselSearchStateProperty = keyof VesselSearchState
