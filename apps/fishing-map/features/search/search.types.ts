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
  codMarinha?: string // pipe 3
  nationalId?: string // pipe 3
  externalId?: string
  flag?: string[]
  geartypes?: GearType[]
  shiptypes?: VesselType[]
  targetSpecies?: string
  transmissionDateFrom?: string
  transmissionDateTo?: string
  owner?: string
  sourceFleet?: string[]
  fleet?: string[] // pipe 3
  origin?: string
}

export type VesselSearchStateProperty = keyof VesselSearchState
