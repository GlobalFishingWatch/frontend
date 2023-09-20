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
export { Locale } from '@globalfishingwatch/api-types'

export type WorkspaceViewportParam = 'latitude' | 'longitude' | 'zoom'
export type WorkspaceTimeRangeParam = 'start' | 'end'
export type BufferUnit = 'nauticalmiles' | 'kilometers'
export type BufferOperation = 'dissolve' | 'difference'

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
  | 'reportBufferValue'
  | 'reportBufferUnit'
  | 'reportBufferOperation'

export type WorkspaceStateProperty =
  | 'query'
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
  | ReportStateProperty
  | keyof AppParams

export type WorkspaceParam =
  | WorkspaceViewportParam
  | WorkspaceTimeRangeParam
  | WorkspaceStateProperty

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
  query?: string
  readOnly?: boolean
  reportActivityGraph?: ReportActivityGraph
  reportAreaBounds?: Bbox
  reportAreaSource?: string
  reportCategory?: ReportCategory
  reportTimeComparison?: ReportActivityTimeComparison
  reportVesselFilter?: string
  reportVesselGraph?: ReportVesselGraph
  reportVesselPage?: number
  reportBufferValue?: number
  reportBufferUnit?: BufferUnit
  reportBufferOperation?: BufferOperation
  reportResultsPerPage?: number
  sidebarOpen?: boolean
  timebarGraph?: TimebarGraphs
  timebarSelectedEnvId?: string
  timebarVisualisation?: TimebarVisualisations
  visibleEvents?: VisibleEvents
}

export type RedirectParam = {
  'access-token'?: string
}

export enum UserTab {
  Info = 'info',
  Workspaces = 'workspaces',
  Datasets = 'datasets',
  Reports = 'reports',
  VesselGroups = 'vesselGroups',
}

export type AppParams = {
  userTab?: UserTab
}

export type QueryParams = Partial<WorkspaceViewport> &
  Partial<WorkspaceTimeRange> &
  WorkspaceState &
  AppParams &
  RedirectParam

export type MapCoordinates = {
  latitude: number
  longitude: number
  zoom: number
  transitionDuration?: number
}

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
