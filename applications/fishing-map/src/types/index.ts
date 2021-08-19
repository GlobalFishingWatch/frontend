import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { EventType } from '@globalfishingwatch/api-types'

export enum Locale {
  en = 'en',
  es = 'es',
  fr = 'fr',
  id = 'id',
}

export type WorkspaceViewportParam = 'latitude' | 'longitude' | 'zoom'
export type WorkspaceTimeRangeParam = 'start' | 'end'
export type WorkspaceStateProperty =
  | 'query'
  | 'analysis'
  | 'readOnly'
  | 'daysFromLatest'
  | 'sidebarOpen'
  | 'dataviewInstances'
  | 'timebarVisualisation'
  | 'visibleEvents'
  | 'timebarGraph'
  | 'bivariateDataviews'
  | 'version'
  | 'activityCategory'

export type WorkspaceParam =
  | WorkspaceViewportParam
  | WorkspaceTimeRangeParam
  | WorkspaceStateProperty

export type WorkspaceViewport = Record<WorkspaceViewportParam, number>
export type WorkspaceTimeRange = Record<WorkspaceTimeRangeParam, string>
export type WorkspaceAnalysis = {
  areaId: string
  sourceId: string
  bounds?: [number, number, number, number]
}
export type WorkspaceActivityCategory = 'fishing' | 'presence'
export type BivariateDataviews = [string, string]

export type WorkspaceState = {
  query?: string
  version?: string
  readOnly?: boolean
  daysFromLatest?: number // use latest day as endAt minus the number of days set here
  sidebarOpen?: boolean
  analysis?: WorkspaceAnalysis
  dataviewInstances?: Partial<UrlDataviewInstance[]>
  timebarVisualisation?: TimebarVisualisations
  visibleEvents?: VisibleEvents
  timebarGraph?: TimebarGraphs
  bivariateDataviews?: BivariateDataviews
  activityCategory?: WorkspaceActivityCategory
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
  Heatmap = 'heatmap',
  Vessel = 'vessel',
}

export type VisibleEvents = EventType[] | 'all' | 'none'

export enum TimebarGraphs {
  Speed = 'speed',
  Depth = 'depth',
  None = 'none',
}

// minX, minY, maxX, maxY
export type Bbox = [number, number, number, number]
