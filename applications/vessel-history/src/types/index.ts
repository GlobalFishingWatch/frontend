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
export interface Flag {
  start: string
  end: string
  value: string
}

export interface Mmsi {
  start: string
  end: string
  value: string
}
export interface Callsign {
  start: string
  end: string
  value: string
}
export interface Extra {
  id: string
  label: string
  value: string
}
export interface Vessel {
  id: string
  vesselId: string
  type: string
  ssvid: string
  name: string
  imo: string
  flags: Flag[]
  authorizations: any[]
  mmsi: Mmsi[]
  callsign: Callsign[]
  extra: Extra[]
  dataset: string
  firstTransmissionDate: string
  lastTransmissionDate: string
}
