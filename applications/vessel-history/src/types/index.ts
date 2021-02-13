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
  firstSeen: Date
  endDate: Date
}

export interface Flag {
  value: string
  firstSeen: Date
  endDate?: Date
}

export interface Gt {
  value: string
  firstSeen: Date
  endDate?: any
}

export interface Imo {
  value: string
  firstSeen: Date
  endDate?: any
}

export interface Loa {
  value: string
  firstSeen: Date
  endDate?: any
}

export interface Name {
  value: string
  firstSeen: Date
  endDate?: Date
}

export interface Irc {
  value: string
  firstSeen: Date
  endDate?: any
}

export interface VesselType {
  value: string
  firstSeen: Date
  endDate?: any
}

export interface Depth {
  value: string
  firstSeen: Date
  endDate?: any
}

export interface ValueList {
  builtYear: BuiltYear[]
  flag: Flag[]
  gt: Gt[]
  imo: Imo[]
  loa: Loa[]
  mmsi: any[]
  name: Name[]
  ircs: Irc[]
  vesselType: VesselType[]
  gear: any[]
  depth: Depth[]
}

export interface VesselOwnership {
  value: string
  firstSeen?: Date
  endDate?: Date
}

export interface VesselOperation {
  value: string
  firstSeen?: Date
  endDate?: Date
}

export interface RelationList {
  vesselOwnership: VesselOwnership[]
  vesselOperations: VesselOperation[]
}

export interface TMTDetail {
  vesselMatchId: string
  valueList: ValueList
  relationList: RelationList
  authorisationList: any[]
}
export interface OtherImo {
  counter: number
  name: string
}

export interface OtherShipname {
  counter: number
  name: string
}

export type GFWDetail = {
  callsign: string
  firstTransmissionDate: Date
  flag: string
  id: string
  imo?: any
  lastTransmissionDate: Date
  mmsi: string
  otherCallsigns: OtherCallsign[]
  otherImos: OtherImo[]
  otherShipnames: OtherShipname[]
  shipname: string
  source: string
  dataset: string
}

export type VesselInfo = {
  gfwData: GFWDetail | null
  tmtData: TMTDetail | null
}
