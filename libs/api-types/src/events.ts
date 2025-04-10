import type { JSX } from 'react'

export interface PointCoordinate {
  lat: number
  lon: number
}

export enum RegionType {
  eez = 'eez',
  rfmo = 'rfmo',
  mpa = 'mpa',
  fao = 'fao',
  majorFao = 'majorFao',
  highSeas = 'highSeas',
}

export interface Regions {
  [RegionType.eez]: string[]
  [RegionType.rfmo]: string[]
  [RegionType.mpa]: string[]
  [RegionType.fao]?: string[]
  [RegionType.majorFao]?: string[]
  [RegionType.highSeas]?: string[]
}

export interface GapPosition extends PointCoordinate {
  regions: Regions
}

export enum EventTypes {
  Encounter = 'encounter',
  Fishing = 'fishing',
  Gap = 'gap',
  Port = 'port_visit',
  Loitering = 'loitering',
}

export type EventType = `${EventTypes}`

export interface EventNextPort {
  id: string
  iso: string
  label: string
}

export enum EventVesselTypeEnum {
  Carrier = 'carrier',
  Fishing = 'fishing',
}

export type AuthorizationType = 'true' | 'false' | 'pending'

export interface EventAuthorization {
  isAuthorized: AuthorizationType
  rfmo: string
}

export interface EventVesselAuthorization {
  hasPubliclyListedAuthorization: 'true' | 'false'
  rfmo: string
}

export interface EventVessel {
  id: string
  ssvid: string
  dataset: string
  name: string
  flag: string
  type: EventVesselTypeEnum
  nextPort?: EventNextPort
  authorizations?: EventAuthorization[]
  publicAuthorizations?: EventVesselAuthorization[]
}

export type RFMOs =
  | 'iccat'
  | 'iotc'
  | 'wcpfc'
  | 'iattc'
  | 'aidcp'
  | 'ccsbt'
  | 'sprfmo'
  | 'npfc'
  | 'none'

export interface EncounterEventAuthorizations {
  rfmo: RFMOs
  /**
   * If true, the vessel has authorization to operate by the management organization for this RFMO.
   * If false, we don't have authorization information for this vessel in this RFMO.
   */
  authorized: boolean
}

export enum AuthorizationOptions {
  Authorized = 'authorized',
  Partially = 'partially',
  Unmatched = 'unmatched',
}
export interface EncounterEvent<Vessel = EventVessel> {
  encounteredVesselAuthorizationStatus: JSX.Element
  mainVesselAuthorizationStatus: JSX.Element
  /**
   * Median distance to the other vessel across the encounter, in kilometers
   */
  medianDistanceKilometers: number
  /**
   * Median speed of the vessels across the encounter, in knots
   */
  medianSpeedKnots: number
  vessel: Vessel
  /**
   * If authorization information is available, indicates wether the main vessel of the encounter
   * had authorization to do so by all the management organizations for the regions in which the
   * encounter happened (if true) or if we don't have enough information to determine it was (if false).
   */
  authorized: boolean
  authorizationStatus: AuthorizationOptions
  /**
   * List of authorizations by RFMO
   */
  regionAuthorizations: EncounterEventAuthorizations[]
  /**
   * List of authorizations by Vessel
   */
  vesselAuthorizations: { id: string; authorizations: EncounterEventAuthorizations[] }[]
}

export interface LoiteringEvent {
  totalTimeHours: number
  totalDistanceKm: number
  averageDistanceFromShoreKm: number
  averageSpeedKnots: number
}

export interface PortEvent {
  id: string
  name: string
  topDestination: string
  flag: string
  position: PointCoordinate
}

export interface Anchorage {
  id: string
  lat: number
  lon: number
  flag: string
  name: string
  at_dock: boolean
  anchorage_id: number
  top_destination: string
  distance_from_shore_km: number
}

export interface PortVisitEvent {
  visitId: string
  confidence: number
  durationHrs: number
  startAnchorage: Anchorage
  intermediateAnchorage: Anchorage
  endAnchorage: Anchorage
}

export interface GapEvent {
  distanceKm: number
  durationHours: number
  intentionalDisabling: boolean
  impliedSpeedKnots: number
  isEventStart?: boolean
  isEventEnd?: boolean
  offPosition: GapPosition
  onPosition: GapPosition
  positions12HoursBefore: number
  positions12HoursBeforeSat: number
  positionsPerDaySatReception: number
}

export interface FishingEvent {
  totalDistanceKm: number
  averageSpeedKnots: number
  averageDurationHours: number
}

export interface Distances {
  startDistanceFromShoreKm?: number
  endDistanceFromShoreKm: number
  startDistanceFromPortKm?: number
  endDistanceFromPortKm: number
}

export interface ApiEvent<Vessel = EventVessel> {
  distances?: Distances
  encounter?: EncounterEvent<Vessel>
  end: number | string // Depends on timestamp format API param
  fishing?: FishingEvent
  gap?: GapEvent
  id: string
  key?: string
  loitering?: LoiteringEvent
  nextPort?: EventNextPort
  regions?: Regions
  port_visit?: PortVisitEvent
  port?: PortEvent
  position: PointCoordinate
  start: number | string // Depends on timestamp format API param
  type: EventTypes
  vessel: Vessel
  coordinates?: [number, number]
}

export interface ApiEvents<T = ApiEvent> {
  entries: T[]
  limit: number | null
  total: number
}
