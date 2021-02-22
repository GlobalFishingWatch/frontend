import { DataviewInstance } from '@globalfishingwatch/api-types'
import { Generators } from '@globalfishingwatch/layer-composer'

export enum Locale {
  en = 'en',
  es = 'es',
  fr = 'fr',
}

export type UrlDataviewInstance = Omit<DataviewInstance<Generators.Type>, 'dataviewId'> & {
  dataviewId?: number // making this optional as sometimes we just need to reference the id
  deleted?: boolean // needed when you want to override from url an existing workspace config
}

export type WorkspaceViewportParam = 'latitude' | 'longitude' | 'zoom'
export type WorkspaceTimeRangeParam = 'start' | 'end'
export type WorkspaceStateProperty =
  | 'query'
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
export type WorkspaceState = {
  query?: string
  sidebarOpen?: boolean
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
