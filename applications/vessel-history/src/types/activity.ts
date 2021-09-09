import { ApiEvent, EventTypes } from '@globalfishingwatch/api-types'
import { GroupRegions } from 'features/regions/regions.slice'

export interface EventVessel {
  id: string
  name: string
  ssvid: string
  nextPort?: any
}
export interface Position {
  lat: number
  lon: number
}

export interface Regions {
  arg: any[]
  eez: string[]
  fao: string[]
  hsp: any[]
  kkp: any[]
  vme: string[]
  ames: string[]
  rfmo: string[]
  mpant: any[]
  mparu: any[]
  ocean: string[]
  other: any[]
  mregion: string[]
  majorFao: string[]
}

export interface Distances {
  startDistanceFromShoreKm?: number
  endDistanceFromShoreKm: number
  startDistanceFromPortKm?: number
  endDistanceFromPortKm: number
}

export interface Fishing {
  totalDistanceKm: number
  averageSpeedKnots: number
  averageDurationHours: number
}

export interface ActivityEvent<Vessel = EventVessel> extends ApiEvent<Vessel> {
  regions: Regions
  boundingBox: number[]
  distances: Distances
  fishing: Fishing
  timestamp?: number
}
export interface ActivityEventGroup {
  event_type: EventTypes
  event_places: GroupRegions[]
  ocean?: string
  start: string
  end: string
  open: boolean
  entries: ActivityEvent[]
}

export interface ActivityEvents {
  total: number
  limit?: any
  groups: ActivityEventGroup[]
}

export interface OfflineVesselActivity {
  activities: ActivityEvent[]
  profileId: string
  savedOn: string
}
