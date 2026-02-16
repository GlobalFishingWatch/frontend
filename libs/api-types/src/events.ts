export type PointCoordinate = {
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

export type Regions = {
  [RegionType.eez]: string[]
  [RegionType.rfmo]: string[]
  [RegionType.mpa]: string[]
  [RegionType.fao]?: string[]
  [RegionType.majorFao]?: string[]
  [RegionType.highSeas]?: string[]
}

export type GapPosition = PointCoordinate & {
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

export type EventNextPort = {
  id: string
  flag: string
  name: string
  portVisitEventId: string
}

export enum EventVesselTypeEnum {
  Carrier = 'carrier',
  Fishing = 'fishing',
}

export type AuthorizationType = 'true' | 'false' | 'pending'

export type EventAuthorization = {
  isAuthorized: AuthorizationType
  rfmo: string
}

export type EventVesselAuthorization = {
  hasPubliclyListedAuthorization: 'true' | 'false'
  rfmo: string
}

export type EventVessel = {
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

export type EncounterEventAuthorizations = {
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

export type EncounterEvent<Vessel = EventVessel> = {
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

export type LoiteringEvent = {
  totalTimeHours: number
  totalDistanceKm: number
  averageDistanceFromShoreKm: number
  averageSpeedKnots: number
}

export type PortEvent = {
  id: string
  name: string
  topDestination: string
  flag: string
  position: PointCoordinate
}

export type Anchorage = {
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

export type PortVisitEvent = {
  visitId: string
  confidence: number
  durationHrs: number
  startAnchorage: Anchorage
  intermediateAnchorage: Anchorage
  endAnchorage: Anchorage
}

export type GapEvent = {
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

export type GapsEvent = {
  latMax: number
  latMin: number
  lonMax: number
  lonMin: number
}

export type FishingEvent = {
  totalDistanceKm: number
  averageSpeedKnots: number
  averageDurationHours: number
}

export type Distances = {
  startDistanceFromShoreKm?: number
  endDistanceFromShoreKm: number
  startDistanceFromPortKm?: number
  endDistanceFromPortKm: number
}

export type ApiEvent<Vessel = EventVessel> = {
  distances?: Distances
  encounter?: EncounterEvent<Vessel>
  end: number | string // Depends on timestamp format API param
  fishing?: FishingEvent
  gap?: GapEvent
  gaps?: GapsEvent
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

export type ApiEvents<T = ApiEvent> = {
  entries: T[]
  limit: number | null
  total: number
}
