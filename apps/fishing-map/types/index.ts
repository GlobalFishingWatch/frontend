import { BaseUrlWorkspace } from '@globalfishingwatch/dataviews-client'
import { DatasetSubCategory, DataviewCategory, EventType } from '@globalfishingwatch/api-types'
import {
  REPORT_VESSELS_GRAPH_GEARTYPE,
  REPORT_VESSELS_GRAPH_FLAG,
  REPORT_ACTIVITY_GRAPH_EVOLUTION,
  REPORT_ACTIVITY_GRAPH_BEFORE_AFTER,
  REPORT_ACTIVITY_GRAPH_PERIOD_COMPARISON,
  REPORT_VESSELS_GRAPH_VESSELTYPE,
} from 'data/config'
import { SearchType, VesselIdentitySourceEnum } from 'features/search/search.config'
export { Locale } from '@globalfishingwatch/api-types'

export type WorkspaceViewportParam = 'latitude' | 'longitude' | 'zoom'
export type WorkspaceTimeRangeParam = 'start' | 'end'

export type ReportStateProperty =
  | 'reportActivityGraph'
  | 'reportAreaBounds'
  | 'reportAreaSource'
  | 'reportCategory'
  | 'reportResultsPerPage'
  | 'reportTimeComparison'
  | 'reportVesselFilter'
  | 'reportVesselGraph'
  | 'reportVesselPage'

export type WorkspaceStateProperty =
  | 'searchOption'
  | 'report'
  | 'readOnly'
  | 'daysFromLatest'
  | 'sidebarOpen'
  | 'dataviewInstances'
  | 'dataviewInstancesOrder'
  | 'timebarVisualisation'
  | 'visibleEvents'
  | 'timebarGraph'
  | 'timebarSelectedEnvId'
  | 'bivariateDataviews'
  | 'activityCategory'
  | 'infoSource'
  | ReportStateProperty

export type WorkspaceParam =
  | WorkspaceViewportParam
  | WorkspaceTimeRangeParam
  | WorkspaceStateProperty
  | VesselProfileStateProperty
  | VesselSearchStateProperty

export type WorkspaceViewport = Record<WorkspaceViewportParam, number>
export type WorkspaceTimeRange = Record<WorkspaceTimeRangeParam, string>

export type BivariateDataviews = [string, string]
export type ReportActivityGraph =
  | typeof REPORT_ACTIVITY_GRAPH_EVOLUTION
  | typeof REPORT_ACTIVITY_GRAPH_BEFORE_AFTER
  | typeof REPORT_ACTIVITY_GRAPH_PERIOD_COMPARISON

export type ReportActivityTimeComparison = {
  start: string
  compareStart: string
  duration: number
  durationType: 'days' | 'months'
}

export enum ReportCategory {
  Fishing = DatasetSubCategory.Fishing,
  Presence = DatasetSubCategory.Presence,
  Detections = DataviewCategory.Detections,
  Environment = DataviewCategory.Environment,
}

export type ReportVesselGraph =
  | typeof REPORT_VESSELS_GRAPH_GEARTYPE
  | typeof REPORT_VESSELS_GRAPH_VESSELTYPE
  | typeof REPORT_VESSELS_GRAPH_FLAG

export type WorkspaceActivityCategory = 'fishing' | 'presence'

export interface WorkspaceState extends BaseUrlWorkspace {
  bivariateDataviews?: BivariateDataviews
  daysFromLatest?: number // use latest day as endAt minus the number of days set here
  readOnly?: boolean
  reportActivityGraph?: ReportActivityGraph
  reportAreaBounds?: Bbox
  reportAreaSource?: string
  reportCategory?: ReportCategory
  reportTimeComparison?: ReportActivityTimeComparison
  reportVesselFilter?: string
  reportVesselGraph?: ReportVesselGraph
  reportVesselPage?: number
  reportResultsPerPage?: number
  sidebarOpen?: boolean
  timebarGraph?: TimebarGraphs
  timebarSelectedEnvId?: string
  timebarVisualisation?: TimebarVisualisations
  visibleEvents?: VisibleEvents
}

export type VesselSearchState = {
  query?: string
  sources?: string[]
  searchOption?: SearchType
  infoSource?: VesselIdentitySourceEnum
  ssvid?: string
  imo?: string
  callsign?: string
  codMarinha?: string
  flag?: string[]
  geartype?: string[]
  targetSpecies?: string
  lastTransmissionDate?: string
  firstTransmissionDate?: string
  owner?: string
  fleet?: string[]
  origin?: string
}

export type VesselSearchStateProperty = keyof VesselSearchState

export type VesselProfileActivityMode = 'voyage' | 'type'
export type VesselProfileState = {
  vesselDatasetId: string
  vesselIdentityIndex: number
  vesselActivityMode: VesselProfileActivityMode
  viewOnlyVessel: boolean
}

export type VesselProfileStateProperty = keyof VesselProfileState

export type RedirectParam = {
  'access-token'?: string
}

export type QueryParams = Partial<WorkspaceViewport> &
  Partial<WorkspaceTimeRange> &
  WorkspaceState &
  Partial<VesselProfileState> &
  RedirectParam &
  VesselSearchState

export enum TimebarVisualisations {
  HeatmapActivity = 'heatmap',
  HeatmapDetections = 'heatmapDetections',
  Vessel = 'vessel',
  Environment = 'environment',
}

export type VisibleEvents = EventType[] | 'all' | 'none'

export enum TimebarGraphs {
  Speed = 'speed',
  Depth = 'elevation',
  None = 'none',
}

// minX, minY, maxX, maxY
export type Bbox = [number, number, number, number]

export type CoordinatePosition = {
  latitude: number
  longitude: number
}

export interface MapCoordinates extends CoordinatePosition {
  zoom: number
  transitionDuration?: number
}
export interface TrackPosition extends CoordinatePosition {
  timestamp: number
}
