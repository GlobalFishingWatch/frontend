import { Vessel } from '@globalfishingwatch/api-types'

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

export interface MapCoordinates extends CoordinatePosition {
  zoom: number
}

export interface FieldValueCounter<T = string> {
  counter: number
  name: T
}

export interface VesselFieldHistory<T> {
  byDate: ValueItem<T>[]
  byCount: FieldValueCounter<T>[]
}

export interface VesselFieldsHistory {
  callsign: VesselFieldHistory<string>
  geartype: VesselFieldHistory<string>
  mmsi: VesselFieldHistory<string>
  imo: VesselFieldHistory<string>
  shipname: VesselFieldHistory<string>
  owner: VesselFieldHistory<string>
  flag: VesselFieldHistory<string>
  depth: VesselFieldHistory<string>
  length: VesselFieldHistory<string>
  grossTonnage: VesselFieldHistory<string>
  vesselType: VesselFieldHistory<string>
  operator: VesselFieldHistory<string>
}

export interface VesselWithHistory extends Vessel {
  history: VesselFieldsHistory
}

export enum VesselAPISource {
  TMT = 'TMT',
  GFW = 'GFW',
}
export interface ValueItem<T = string> {
  value: T
  firstSeen?: string
  endDate?: string
}
export type BuiltYear = ValueItem
export type Flag = ValueItem
export type Gt = ValueItem
export type Imo = ValueItem
export type Loa = ValueItem
export type Name = ValueItem
export type Irc = ValueItem
export type VesselType = ValueItem
export type Depth = ValueItem
export type Mmsi = ValueItem

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

export type VesselOwnership = ValueItem

export type VesselOperation = ValueItem

export interface RelationList {
  vesselOwnership: VesselOwnership[]
  vesselOperations: VesselOperation[]
}

export interface AuthorizationList {
  source: string
  startDate: string
  endDate?: string
}

export interface TMTDetail {
  vesselMatchId: string
  valueList: ValueList
  relationList: RelationList
  authorisationList: AuthorizationList[]
}

export type OtherCallsign = FieldValueCounter<string>
export type OtherShipname = FieldValueCounter<string>
export type OtherImo = FieldValueCounter<string>

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
  geartype: string
  normalized_shipname: string
}

export enum Locale {
  en = 'en',
  es = 'es',
  fr = 'fr',
}
