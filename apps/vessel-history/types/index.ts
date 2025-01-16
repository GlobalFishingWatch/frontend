import type {
  Authorization,
  EventType,
  Vessel,
  VesselSearch,
  Workspace as BaseWorkspace,
} from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

export type WorkspaceViewportParam = 'latitude' | 'longitude' | 'zoom'
export type WorkspaceTimeRangeParam = 'start' | 'end'
export type WorkspaceStateProperty =
  | 'q'
  | 'dataviewInstances'
  | 'version'
  | 'vessel'
  | 'timebarGraph'
export type WorkspaceOfflineOptions = 'offline'
export type WorkspaceAdvancedSearchParam =
  | 'imo'
  | 'mmsi'
  | 'callsign'
  | 'flags'
  | 'lastTransmissionDate'
  | 'firstTransmissionDate'
export type WorkspaceMergeVesselsParam = 'aka'

export type WorkspaceParam =
  | WorkspaceViewportParam
  | WorkspaceTimeRangeParam
  | WorkspaceStateProperty
  | WorkspaceAdvancedSearchParam
  | WorkspaceMergeVesselsParam
  | WorkspaceOfflineOptions

export type WorkspaceViewport = Record<WorkspaceViewportParam, number>
export type WorkspaceTimeRange = Record<WorkspaceTimeRangeParam, string>
export type WorkspaceMergeVessels = {
  aka?: string[]
}

export type BivariateDataviews = [string, string]

export type WorkspaceProfileViewParam = 'port-inspector' | 'insurance-underwriter' | 'standalone'
export interface Workspace<T> extends BaseWorkspace<T> {
  profileView?: WorkspaceProfileViewParam
}

export type WorkspaceState = {
  q?: string
  version?: string
  dataviewInstances?: Partial<UrlDataviewInstance[]>
  vessel?: string
  timebarGraph?: TimebarGraphs
}

export type RedirectParam = {
  'access-token'?: string
}

export type QueryParams = Partial<WorkspaceViewport> &
  Partial<WorkspaceTimeRange> &
  Partial<WorkspaceMergeVessels> &
  WorkspaceState &
  RedirectParam

export type CoordinatePosition = {
  latitude: number
  longitude: number
}

export interface MapCoordinates extends CoordinatePosition {
  zoom: number
}
export interface TrackPosition extends CoordinatePosition {
  timestamp: number
}
export interface FieldValueCounter<T = string> {
  counter: number
  name: T
  source?: VesselAPISource
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
  iuuListing?: VesselFieldHistory<string>
}

export interface ForcedLaborRisk {
  confidence: boolean
  score: boolean
  year: number
  reported: boolean
}

export enum RiskLevel {
  high = 'high',
  low = 'low',
  unknown = 'unknown',
}

export interface RiskOutput {
  levels: RiskLevel[]
  year: number
  highrisk: boolean
  reportedCases: boolean
  highestRisk: RiskLevel
}

export enum IuuStatus {
  notListed = 0,
  previouslyListed = 1,
  currentlyListed = 2,
}

export interface VesselWithHistory extends Omit<Vessel, 'vesselType'> {
  history: VesselFieldsHistory
  iuuStatus?: number
  iuuListing?: Iuu
  vesselType?: VesselType | string
  forcedLabour?: ForcedLaborRisk[]
}

export enum VesselAPISource {
  TMT = 'TMT',
  GFW = 'GFW',
}
export interface ValueItem<T = string> {
  value: T
  firstSeen?: string
  endDate?: string
  originalFirstSeen?: number
  originalEndDate?: number
  source?: VesselAPISource
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
export type Iuu = ValueItem

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
export interface TMTDetail {
  vesselMatchId: string
  valueList: ValueList
  iuuStatus: number
  iuuListing: Iuu[]
  relationList: RelationList
  authorisationList: Authorization[]
  imageList: string[]
}

export type OtherCallsign = FieldValueCounter<string>
export type OtherShipname = FieldValueCounter<string>
export type OtherImo = FieldValueCounter<string>

export type AnyHistoricValue = OtherCallsign | OtherShipname | OtherImo

export type GFWDetail = {
  callsign: string
  firstTransmissionDate: string
  flag: string
  forcedLabour?: ForcedLaborRisk[]
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
  vesselType: string
  years: number[]
  posCount?: number
}

export enum Locale {
  en = 'en',
  es = 'es',
  fr = 'fr',
}

export type ContextLayer = {
  id: string
  label: string
  color: string
  active?: boolean
  visible?: boolean
  description?: string
  disabled?: boolean
}

export type Range = {
  start: string
  end: string
}

// minX, minY, maxX, maxY
export type Bbox = [number, number, number, number]

export interface SearchResults {
  vessels: VesselSearch[]
  query: string
  offset: number
  total: number
  searching: boolean
}

export type VisibleEvents = EventType[] | 'all' | 'none'

export enum TimebarGraphs {
  Speed = 'speed',
  Depth = 'elevation',
  None = 'none',
}
