import { ApiEvent, EventAuthorization, Regions } from '@globalfishingwatch/api-types'

export interface EventVessel {
  id: string
  name: string
  ssvid: string
  nextPort?: any
  authorizations?: EventAuthorization[]
}
export interface Position {
  lat: number
  lon: number
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
  timestamp: number
  color?: string
  subEvent?: PortVisitSubEvent
}

export enum PortVisitSubEvent {
  Exit = 'exit',
  Entry = 'entry',
}
