import type { RelatedVesselSearchMerged, VesselTypeV2 } from '@globalfishingwatch/api-types'

import type { ActivityEvent } from 'types/activity'

export type VesselSourceId = {
  [key: string]: any
}

export interface OfflineVessel extends RelatedVesselSearchMerged {
  profileId: string
  vesselType: string | VesselTypeV2
  aka?: string[]
  activities?: ActivityEvent[]
  savedOn: string
}

export enum VesselFieldLabel {
  name = 'name',
  flag = 'flag',
  shipname = 'shipname',
  firstTransmissionDate = 'firstTransmissionDate',
  lastTransmissionDate = 'lastTransmissionDate',
  imo = 'imo',
  mmsi = 'mmsi',
  callsign = 'callsign',
  fleet = 'fleet',
  origin = 'origin',
  type = 'type',
  geartype = 'geartype',
  length = 'length',
  depth = 'depth',
  grossTonnage = 'grossTonnage',
  owner = 'owner',
  operator = 'operator',
  builtYear = 'builtYear',
  authorizations = 'authorizations',
  registeredGearType = 'registeredGearType',
  iuuStatus = 'iuuStatus',
  forcedLabourModel = 'forcedLabourModel',
}
