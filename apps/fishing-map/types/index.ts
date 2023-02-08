import { BaseUrlWorkspace } from '@globalfishingwatch/dataviews-client'
import { EventType } from '@globalfishingwatch/api-types'
import { REPORT_VESSELS_GRAPH_GEARTYPE, REPORT_VESSELS_GRAPH_FLAG } from 'data/config'
export { Locale } from '@globalfishingwatch/api-types'

export type WorkspaceViewportParam = 'latitude' | 'longitude' | 'zoom'
export type WorkspaceTimeRangeParam = 'start' | 'end'
export type WorkspaceStateProperty =
  | 'query'
  | 'analysis'
  | 'analysisType'
  | 'analysisTimeComparison'
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
  | 'reportVesselGraph'

export type WorkspaceParam =
  | WorkspaceViewportParam
  | WorkspaceTimeRangeParam
  | WorkspaceStateProperty

export type WorkspaceViewport = Record<WorkspaceViewportParam, number>
export type WorkspaceTimeRange = Record<WorkspaceTimeRangeParam, string>
export type WorkspaceAnalysis = {
  areaId: string
  sourceId: string
  datasetId: string
  bounds?: [number, number, number, number]
}
export type WorkspaceAnalysisType = 'evolution' | 'correlation' | 'periodComparison' | 'beforeAfter'
export type WorkspaceAnalysisTimeComparison = {
  start: string
  compareStart: string
  duration: number
  durationType: string
}

export type BivariateDataviews = [string, string]
export type ReportVesselGraph =
  | typeof REPORT_VESSELS_GRAPH_GEARTYPE
  | typeof REPORT_VESSELS_GRAPH_FLAG

export type WorkspaceActivityCategory = 'fishing' | 'presence'
export interface WorkspaceState extends BaseUrlWorkspace {
  query?: string
  readOnly?: boolean
  daysFromLatest?: number // use latest day as endAt minus the number of days set here
  sidebarOpen?: boolean
  analysis?: WorkspaceAnalysis
  analysisType?: WorkspaceAnalysisType
  analysisTimeComparison?: WorkspaceAnalysisTimeComparison
  timebarVisualisation?: TimebarVisualisations
  visibleEvents?: VisibleEvents
  timebarGraph?: TimebarGraphs
  timebarSelectedEnvId?: string
  bivariateDataviews?: BivariateDataviews
  reportVesselGraph?: ReportVesselGraph
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
