import type { GearType, VesselIdentitySourceEnum, VesselType } from '@globalfishingwatch/api-types'

import type { SearchType } from './search.config'

export type VesselSearchState = {
  query?: string
  shipname?: string
  sources?: string[]
  searchOption?: SearchType
  infoSource?: VesselIdentitySourceEnum
  ssvid?: string
  imo?: string
  callsign?: string
  codMarinha?: string
  nationalId?: string
  flag?: string[]
  geartypes?: GearType[]
  shiptypes?: VesselType[]
  targetSpecies?: string
  transmissionDateFrom?: string
  transmissionDateTo?: string
  owner?: string
  fleet?: string[]
  origin?: string
}

export type VesselSearchStateProperty = keyof VesselSearchState
