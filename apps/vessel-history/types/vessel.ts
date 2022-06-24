import { VesselSearch } from '@globalfishingwatch/api-types'
import { ActivityEvent } from 'types/activity'

export type VesselSourceId = {
  [key: string]: any
}

export interface OfflineVessel extends VesselSearch {
  profileId: string
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
