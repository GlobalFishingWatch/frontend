import { VesselSearch } from '@globalfishingwatch/api-types/dist'
import { ActivityEvent } from 'types/activity';

export type VesselSourceId = {
  [key: string]: any
}

export interface OfflineVessel extends VesselSearch {
  profileId: string
  activities?: ActivityEvent[]
  savedOn: string
}
