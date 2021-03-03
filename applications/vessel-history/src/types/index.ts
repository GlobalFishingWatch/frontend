export type WorkspaceParam =
  | 'zoom'
  | 'latitude'
  | 'longitude'
  | 'start'
  | 'end'
  | 'vessel'
  | 'timebarMode'
  | 'q'

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

export interface Vessel {
  id: string
  callsign: string
  firstTransmissionDate: string
  flag: string
  imo?: any
  lastTransmissionDate: string
  mmsi: string
  otherCallsigns: OtherCallsign[]
  otherImos: OtherImo[]
  otherShipnames: OtherShipname[]
  shipname: string
  source: string
  dataset: string
  vesselMatchId: string
}

export enum VesselAPISource {
  TMT = 'TMT',
  GFW = 'GFW',
}
export interface BuiltYear {
  value: string
  firstSeen: string
  endDate: Date
}

export interface Flag {
  value: string
  firstSeen: string
  endDate?: string
}

export interface Gt {
  value: string
  firstSeen: string
  endDate?: any
}

export interface Imo {
  value: string
  firstSeen: string
  endDate?: any
}

export interface Loa {
  value: string
  firstSeen: string
  endDate?: any
}

export interface Name {
  value: string
  firstSeen: string
  endDate?: string
}

export interface Irc {
  value: string
  firstSeen: string
  endDate?: any
}

export interface VesselType {
  value: string
  firstSeen: string
  endDate?: any
}

export interface Depth {
  value: string
  firstSeen: string
  endDate?: any
}
export interface Mmsi {
  value: string
  firstSeen: string
  endDate?: string | null
}

export type AnyValueList =
  | BuiltYear
  | Flag
  | Gt
  | Imo
  | Loa
  | Mmsi
  | Name
  | Irc
  | VesselType
  | Depth
  | VesselOwnership
  | VesselOperation
export interface ValueList {
  builtYear: BuiltYear[]
  flag: Flag[]
  gt: Gt[]
  imo: Imo[]
  loa: Loa[]
  mmsi: Mmsi[]
  name: Name[]
  ircs: Irc[]
  vesselType: VesselType[]
  gear: any[]
  depth: Depth[]
}

export interface VesselOwnership {
  value: string
  firstSeen?: string
  endDate?: string
}

export interface VesselOperation {
  value: string
  firstSeen?: string
  endDate?: string
}

export interface RelationList {
  vesselOwnership: VesselOwnership[]
  vesselOperations: VesselOperation[]
}

export interface AuthorizationList {
  source: string
  startDate: Date
  endDate?: string
}

export interface TMTDetail {
  vesselMatchId: string
  valueList: ValueList
  relationList: RelationList
  authorisationList: AuthorizationList[]
}
export interface OtherImo {
  counter: number
  name: string
}

export interface OtherShipname {
  counter: number
  name: string
}

export type AnyHistoricValue = OtherCallsign | OtherShipname | OtherImo

export type GFWDetail = {
  callsign: string
  firstTransmissionDate: string
  flag: string
  id: string
  imo?: any
  lastTransmissionDate: string
  mmsi: string
  otherCallsigns: OtherCallsign[]
  otherImos: OtherImo[]
  otherShipnames: OtherShipname[]
  shipname: string
  source: string
  dataset: string
}
