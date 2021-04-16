import { VesselSearch } from '@globalfishingwatch/api-types/dist'

export type VesselSourceId = {
  [key: string]: any
}

export interface OfflineVessel extends VesselSearch {
  profileId: string
  savedOn: string
}
