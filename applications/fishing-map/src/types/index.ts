import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

export enum Locale {
  en = 'en',
  es = 'es',
  fr = 'fr',
}

export type WorkspaceViewportParam = 'latitude' | 'longitude' | 'zoom'
export type WorkspaceTimeRangeParam = 'start' | 'end'
export type WorkspaceStateProperty =
  | 'query'
  | 'analysis'
  | 'sidebarOpen'
  | 'dataviewInstances'
  | 'timebarVisualisation'
  | 'timebarEvents'
  | 'timebarGraph'
  | 'bivariate'
  | 'version'
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
export type WorkspaceState = {
  query?: string
  sidebarOpen?: boolean
  analysis?: WorkspaceAnalysis
  dataviewInstances?: Partial<UrlDataviewInstance[]>
  timebarVisualisation?: TimebarVisualisations
  timebarEvents?: TimebarEvents
  timebarGraph?: TimebarGraphs
  bivariate?: boolean
  version?: string
}
export type QueryParams = Partial<WorkspaceViewport> & Partial<WorkspaceTimeRange> & WorkspaceState

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

export enum TimebarEvents {
  All = 'all',
  Fishing = 'fishing',
  Encounters = 'encounters',
  Loitering = 'loitering',
  Ports = 'ports',
  None = 'none',
}

export enum TimebarGraphs {
  Speed = 'speed',
  Depth = 'depth',
  None = 'none',
}

// minX, minY, maxX, maxY
export type Bbox = [number, number, number, number]
