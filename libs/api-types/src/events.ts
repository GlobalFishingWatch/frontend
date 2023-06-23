export interface PointCoordinate {
  lat: number
  lon: number
}

export interface Regions {
  eez: string[]
  rfmo: string[]
  mpa: any[]
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

export type EventType = 'encounter' | 'fishing' | 'gap' | 'port_visit' | 'loitering'

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

export interface EventVessel {
  id: string
  ssvid: string
  name: string
  flag: string
  type: EventVesselTypeEnum
  nextPort?: EventNextPort
  authorizations?: EventAuthorization[]
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

export interface ApiEvent<Vessel = EventVessel> {
  id: string
  type: EventTypes
  vessel: Vessel
  start: number | string // Depends on timestamp format API param
  end: number | string // Depends on timestamp format API param
  rfmos: string[]
  eezs: string[]
  nextPort?: EventNextPort
  position: PointCoordinate
  loitering?: LoiteringEvent
  encounter?: EncounterEvent<Vessel>
  gap?: GapEvent
  port?: PortEvent
  port_visit?: PortVisitEvent
  key?: string
}

export interface ApiEvents<T = ApiEvent> {
  entries: T[]
  limit: number | null
  total: number
}
