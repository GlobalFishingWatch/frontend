import type { DataviewCategory, EventType } from '@globalfishingwatch/api-types'
import type { BaseUrlWorkspace, UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type {
  FOOTPRINT_HIGH_RES_ID,
  FOOTPRINT_ID,
  FourwingsVisualizationMode,
  HEATMAP_ID,
  HEATMAP_LOW_RES_ID,
  RulerData,
  VesselsColorByProperty,
} from '@globalfishingwatch/deck-layers'
import type { DrawFeatureType } from '@globalfishingwatch/deck-layers/draw'

import type { MapAnnotation } from 'features/_map/map/overlays/annotations/annotations.types'
import type { ReportState, ReportStateProperty } from 'features/_reports/reports.types'
import type {
  VesselSearchState,
  VesselSearchStateProperty,
} from 'features/_vessels/search/search.types'
import type {
  VesselProfileState,
  VesselProfileStateProperty,
} from 'features/_vessels/vessel/vessel.types'

export { Locale } from '@globalfishingwatch/api-types'

type WorkspaceViewportParam = 'latitude' | 'longitude' | 'zoom'
type WorkspaceTimeRangeParam = 'start' | 'end'
export const BUFFER_UNITS = ['nauticalmiles', 'kilometers'] as const
export type BufferUnit = (typeof BUFFER_UNITS)[number]
export const BUFFER_OPERATIONS = ['dissolve', 'difference'] as const
export type BufferOperation = (typeof BUFFER_OPERATIONS)[number]

export type WorkspaceStateProperty = keyof WorkspaceState
type AppStateProperty = keyof AppState

type AnyStateProperty = WorkspaceStateProperty | AppStateProperty

export type WorkspaceParam =
  | WorkspaceViewportParam
  | WorkspaceTimeRangeParam
  | AnyStateProperty
  | ReportStateProperty
  | VesselProfileStateProperty
  | VesselSearchStateProperty

export type WorkspaceViewport = Record<WorkspaceViewportParam, number>
type WorkspaceTimeRange = Record<WorkspaceTimeRangeParam, string>

type BivariateDataviews = [string, string] | null

export type TimeMode = 'historical' | 'realTime'

/** URL query params to setup the workspace state (map, timebar, sidebar).
 * Default values for each field below are set in DEFAULT_WORKSPACE (data/config.ts) */
export interface WorkspaceState extends BaseUrlWorkspace {
  /** Render mode (heatmap resolution or positions) for activity layers on the map */
  activityVisualizationMode?: FourwingsVisualizationMode
  /** Pair of dataview ids compared with a bivariate (two-color) heatmap legend, null when off */
  bivariateDataviews?: BivariateDataviews
  /** Dataview categories collapsed in the sidebar layer panel to leave more space for others */
  collapsedSections?: DataviewCategory[]
  /** Dataview instances added on top of the default workspace ones (layers added by the user or via URL)
   * used to allow users to customize the workspace with their own layers, colors, etc...
   */
  dataviewInstances?: UrlDataviewInstance[]
  /** Sets endAt as latest available data day minus this many days, used to keep the time range pinned to "now" */
  daysFromLatest?: number
  /** Render mode (heatmap res or positions) for detections layers on the map */
  detectionsVisualizationMode?: FourwingsVisualizationMode
  /** Render mode (heatmap res) for environmental layers on the map (no high res supported) */
  environmentVisualizationMode?: typeof HEATMAP_ID | typeof HEATMAP_LOW_RES_ID
  /** User text annotations placed on the map */
  mapAnnotations?: MapAnnotation[]
  /** Toggles visibility of map annotations without removing them (e.g. for screenshots) */
  mapAnnotationsVisible?: boolean
  /** User drawn ruler measurements on the map */
  mapRulers?: RulerData[]
  /** Toggles visibility of map rulers without removing them */
  mapRulersVisible?: boolean
  /** Disables editing UI, used for shared/embedded read-only workspace views */
  readOnly?: boolean
  /** Hides interactive actions like buttons, sidebar, etc... for clean screenshots/exports */
  screenshotMode?: boolean
  /** One-shot flag:
   * when true, triggers loading vessels for an events/activity report on load
   * when false, vessels are loaded on demand when user requests it
   */
  reportLoadVessels?: boolean
  /** Sidebar panel open/closed */
  sidebarOpen?: boolean
  /** Secondary graph (speed/depth) drawn on the timebar */
  timebarGraph?: TimebarGraphs
  /** Id of the environmental dataview rendered in the timebar */
  timebarSelectedEnvId?: string
  /** Id of the user points dataview rendered in the timebar */
  timebarSelectedUserId?: string
  /** Id of the vessel group dataview rendered in the timebar */
  timebarSelectedVGId?: string
  /** What the timebar is currently showing (heatmap, events, vessel track, environment, etc)
   * changes automatically based on:
   * - user interaction to render the latest layers
   * - fallback to the first available layer type when only one layer type is available
   */
  timebarVisualisation?: TimebarVisualisation
  /** UI switch between historical or real-time mode */
  timeMode?: TimeMode
  /** Render mode (footprint res) for vessel group layers on the map */
  vesselGroupsVisualizationMode?: typeof FOOTPRINT_ID | typeof FOOTPRINT_HIGH_RES_ID
  /** Property used to color vessel tracks/points (e.g. by track, by speed) */
  vesselsColorBy?: VesselsColorByProperty
  /** Event types shown on the map/timebar, or 'all'/'none'
   * or see EventType in @globalfishingwatch/api-types for the list of available event types
   */
  visibleEvents?: VisibleEvents
  /** Skips sampling when computing heatmap color domain, used to obtain always the same results in debug
   * @default false
   */
  skipColorDomainSampling?: boolean
  // Feature flags (internal only, don't even expose to users externally)
  migramarLayer?: boolean
  longlineSetsInsight?: boolean
}

export type AnyWorkspaceState = Partial<WorkspaceState & ReportState & VesselProfileState>

type RedirectParam = {
  isPopup?: boolean
  'access-token'?: string
}

export enum UserTab {
  /** User email, groups and logout */
  Info = 'info',
  /** List of workspaces saved by user */
  Workspaces = 'workspaces',
  /** List of datasets uploaded by user */
  Datasets = 'datasets',
  /** List of reports generated by user */
  Reports = 'reports',
  /** List of vessel groups created by user */
  VesselGroups = 'vesselGroups',
}

export type SidePanelContent =
  /** Feature and role based guides and articules explaining how to use the tool */
  | 'userGuide'
  /** Dataset description by id and caveats */
  | 'datasets'
  /** User uploaded datasets description */
  | 'userDataset'
  /** Data terminology explaining concepts and fields */
  | 'dataTerminology'
  /** Conversational assistant backed by gfw-agent */
  | 'chat'

/**
 * Track correction identifier
 * @remarks 'new' represents a new track correction
 * @remarks 'issueId' as string shows a existing correction
 */
export type TrackCorrectionId = 'new' | string

/** State of the main application. */
export type AppState = {
  /** User tab section shown in user profile UI */
  userTab?: UserTab
  /** Enables the user feature to draw polygons or points
   * boolean is legacy, use always DrawFeatureType or false
   */
  mapDrawing?: DrawFeatureType | boolean
  /** Used when editing a drawn feature */
  mapDrawingEditId?: string
  trackCorrectionId?: TrackCorrectionId
  /** Id of the content type like:
   * Dataset['id'] (libs/api-types/src/datasets.ts)
   * UserGuideSlug (apps/platform/features/cms/loaders/user-guide.types.ts)
   * */
  sidePanelId?: string
  sidePanelSubcontentId?: string
  /** Sidebar panel with aditional documentation */
  sidePanelContent?: SidePanelContent
}

export type QueryParams = Partial<WorkspaceViewport> &
  WorkspaceState &
  Partial<WorkspaceTimeRange> &
  Partial<VesselProfileState> &
  Partial<ReportState> &
  AppState &
  RedirectParam &
  VesselSearchState

export type QueryParam = keyof QueryParams

export enum TimebarVisualisations {
  HeatmapActivity = 'heatmap',
  HeatmapDetections = 'heatmapDetections',
  Events = 'events',
  Vessel = 'vessel',
  VesselGroup = 'vesselGroup',
  Environment = 'environment',
  Points = 'points',
}
export type TimebarVisualisation = `${TimebarVisualisations}`

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
}
