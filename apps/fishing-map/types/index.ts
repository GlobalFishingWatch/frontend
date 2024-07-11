import { BaseUrlWorkspace, UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import {
  DatasetSubCategory,
  DataviewCategory,
  EventType,
  GearType,
  VesselIdentitySourceEnum,
  VesselType,
} from '@globalfishingwatch/api-types'
import {
  DrawFeatureType,
  FourwingsVisualizationMode,
  HEATMAP_ID,
  HEATMAP_LOW_RES_ID,
  RulerData,
} from '@globalfishingwatch/deck-layers'
import {
  REPORT_VESSELS_GRAPH_GEARTYPE,
  REPORT_VESSELS_GRAPH_FLAG,
  REPORT_ACTIVITY_GRAPH_EVOLUTION,
  REPORT_ACTIVITY_GRAPH_BEFORE_AFTER,
  REPORT_ACTIVITY_GRAPH_PERIOD_COMPARISON,
  REPORT_VESSELS_GRAPH_VESSELTYPE,
} from 'data/config'
import { SearchType } from 'features/search/search.config'
import { MapAnnotation } from 'features/map/overlays/annotations/annotations.types'
export { Locale } from '@globalfishingwatch/api-types'

type WorkspaceViewportParam = 'latitude' | 'longitude' | 'zoom'
type WorkspaceTimeRangeParam = 'start' | 'end'
export type BufferUnit = 'nauticalmiles' | 'kilometers'
export type BufferOperation = 'dissolve' | 'difference'

type ReportStateProperty =
  | 'reportActivityGraph'
  | 'reportAreaBounds'
  | 'reportCategory'
  | 'reportResultsPerPage'
  | 'reportTimeComparison'
  | 'reportVesselFilter'
  | 'reportVesselGraph'
  | 'reportVesselPage'
  | 'reportBufferValue'
  | 'reportBufferUnit'
  | 'reportBufferOperation'

export type WorkspaceStateProperty = keyof WorkspaceState
type AppStateProperty = keyof AppState

type AnyStateProperty = WorkspaceStateProperty | ReportStateProperty | AppStateProperty

export type WorkspaceParam =
  | WorkspaceViewportParam
  | WorkspaceTimeRangeParam
  | AnyStateProperty
  | VesselProfileStateProperty
  | VesselSearchStateProperty

export type WorkspaceViewport = Record<WorkspaceViewportParam, number>
type WorkspaceTimeRange = Record<WorkspaceTimeRangeParam, string>

type BivariateDataviews = [string, string]
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

export interface WorkspaceState extends BaseUrlWorkspace {
  activityVisualizationMode?: FourwingsVisualizationMode
  detectionsVisualizationMode?: FourwingsVisualizationMode
  environmentVisualizationMode?: typeof HEATMAP_ID | typeof HEATMAP_LOW_RES_ID
  dataviewInstances?: UrlDataviewInstance[]
  bivariateDataviews?: BivariateDataviews
  mapAnnotations?: MapAnnotation[]
  mapAnnotationsVisible?: boolean
  mapRulers?: RulerData[]
  mapRulersVisible?: boolean
  daysFromLatest?: number // use latest day as endAt minus the number of days set here
  readOnly?: boolean
  reportActivityGraph?: ReportActivityGraph
  reportAreaBounds?: Bbox
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

export type VesselSearchState = {
  query?: string
  shipname?: string
  sources?: string[]
  searchOption?: SearchType
  infoSource?: VesselIdentitySourceEnum
  ssvid?: string
  imo?: string
  callsign?: string
  codMarinha?: string
  nationalId?: string
  flag?: string[]
  geartypes?: GearType[]
  shiptypes?: VesselType[]
  targetSpecies?: string
  transmissionDateFrom?: string
  transmissionDateTo?: string
  owner?: string
  fleet?: string[]
  origin?: string
}

export type VesselSearchStateProperty = keyof VesselSearchState
export type VesselSection = 'activity' | 'related_vessels' | 'areas' | 'insights'
export type VesselAreaSubsection = 'fao' | 'eez' | 'mpa' | 'rfmo'
export type VesselRelatedSubsection = 'encounters' | 'owners'
export type VesselProfileActivityMode = 'voyage' | 'type'
export type VesselProfileState = {
  vesselDatasetId: string
  vesselRegistryId?: string
  vesselSelfReportedId?: string
  vesselSection: VesselSection
  vesselArea: VesselAreaSubsection
  vesselRelated: VesselRelatedSubsection
  vesselIdentitySource: VesselIdentitySourceEnum
  vesselActivityMode: VesselProfileActivityMode
  viewOnlyVessel: boolean
}

export type VesselProfileStateProperty = keyof VesselProfileState

type RedirectParam = {
  'access-token'?: string
}

export enum UserTab {
  Info = 'info',
  Workspaces = 'workspaces',
  Datasets = 'datasets',
  Reports = 'reports',
  VesselGroups = 'vesselGroups',
}

export type AppState = {
  userTab?: UserTab
  mapDrawing?: DrawFeatureType | boolean
  mapDrawingEditId?: string
}

export type QueryParams = Partial<WorkspaceViewport> &
  Partial<WorkspaceTimeRange> &
  WorkspaceState &
  Partial<VesselProfileState> &
  AppState &
  RedirectParam &
  VesselSearchState

export enum TimebarVisualisations {
  HeatmapActivity = 'heatmap',
  HeatmapDetections = 'heatmapDetections',
  Vessel = 'vessel',
  Environment = 'environment',
}

type VisibleEvents = EventType[] | 'all' | 'none'

export enum TimebarGraphs {
  Speed = 'speed',
  Depth = 'elevation',
  None = 'none',
}

// minX, minY, maxX, maxY
export type Bbox = [number, number, number, number]

export type MapCoordinates = {
  latitude: number
  longitude: number
  zoom: number
  transitionDuration?: number
}
