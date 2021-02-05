export type WorkspaceParam =
  | 'zoom'
  | 'latitude'
  | 'longitude'
  | 'start'
  | 'end'
  | 'vessel'
  | 'timebarMode'

export type QueryParams = {
  [query in WorkspaceParam]?: string | number | boolean | null
}

export type CoordinatePosition = {
  latitude: number
  longitude: number
}

export type MapCoordinates = {
  latitude: number
  longitude: number
  zoom: number
}

export interface OtherCallsign {
  counter: number
  name: string
}

export interface OtherImo {
  counter: number
  name: string
}

export interface OtherShipname {
  counter: number
  name: string
}

export interface Vessel {
  id: string
  callsign: string
  firstTransmissionDate: Date
  flag: string
  imo?: any
  lastTransmissionDate: Date
  mmsi: string
  otherCallsigns: OtherCallsign[]
  otherImos: OtherImo[]
  otherShipnames: OtherShipname[]
  shipname: string
  source: string
  dataset: string
  vesselMatchId: string
}
