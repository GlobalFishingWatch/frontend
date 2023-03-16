import { BaseUrlWorkspace } from '@globalfishingwatch/dataviews-client'
import { DataviewCategory, EventType } from '@globalfishingwatch/api-types'
import {
  REPORT_VESSELS_GRAPH_GEARTYPE,
  REPORT_VESSELS_GRAPH_FLAG,
  REPORT_ACTIVITY_GRAPH_EVOLUTION,
  REPORT_ACTIVITY_GRAPH_BEFORE_AFTER,
  REPORT_ACTIVITY_GRAPH_PERIOD_COMPARISON,
} from 'data/config'
export { Locale } from '@globalfishingwatch/api-types'

export type WorkspaceViewportParam = 'latitude' | 'longitude' | 'zoom'
export type WorkspaceTimeRangeParam = 'start' | 'end'

export type ReportStateProperty =
  | 'reportCategory'
  | 'reportAreaSource'
  | 'reportAreaBounds'
  | 'reportActivityGraph'
  | 'reportVesselGraph'
  | 'reportVesselFilter'
  | 'reportVesselPage'
  | 'reportResultsPerPage'
  | 'reportTimeComparison'

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
export type ReportCategory =
  | DataviewCategory.Activity
  | DataviewCategory.Detections
  | DataviewCategory.Environment

export type ReportVesselGraph =
  | typeof REPORT_VESSELS_GRAPH_GEARTYPE
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

export type QueryParams = Partial<WorkspaceViewport> &
  Partial<WorkspaceTimeRange> &
  WorkspaceState &
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
