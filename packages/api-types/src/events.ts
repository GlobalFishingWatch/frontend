export interface PointCoordinate {
  lat: number
  lon: number
}

export type EventTypes = 'encounter' | 'fishing' | 'gap' | 'port' | 'loitering'

export interface EventNextPort {
  id: string
  iso: string
  label: string
}

export type EventVesselTypeEnum = 'carrier' | 'fishing'
export interface EventVessel {
  id: string
  ssvid: string
  name: string
  flag: string
  type: EventVesselTypeEnum
  nextPort?: EventNextPort
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

export type AuthorizationOptions = 'authorized' | 'partially' | 'unmatched'
export interface EncounterEvent {
  /**
   * Median distance to the other vessel across the encounter, in kilometers
   */
  medianDistanceKilometers: number
  /**
   * Median speed of the vessels across the encounter, in knots
   */
  medianSpeedKnots: number
  vessel: EventVessel
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
  medianSpeedKnots: number
  totalTimeHours: number
  totalDistanceKilometers: number
}

export interface PortEvent {
  id: string
  name: string
  topDestination: string
  flag: string
  position: PointCoordinate
}

export interface ApiEvent {
  id: string
  type: EventTypes
  vessel: EventVessel
  start: number
  end: number
  rfmos: string[]
  eezs: string[]
  nextPort?: EventNextPort
  position: PointCoordinate
  loitering?: LoiteringEvent
  encounter?: EncounterEvent
  port?: PortEvent
}
