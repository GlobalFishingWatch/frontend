import { DataviewInstance } from '@globalfishingwatch/api-types'

export type UrlDataviewInstance = Omit<DataviewInstance, 'dataviewId'> & {
  dataviewId?: number // making this optional as sometimes we just need to reference the id
  deleted?: boolean // needed when you want to override from url an existing workspace config
}

export type WorkspaceParam =
  | 'zoom'
  | 'latitude'
  | 'longitude'
  | 'start'
  | 'end'
  | 'query'
  | 'sidebarOpen'
  | 'dataviewInstances'
  | 'timebarVisualisation'
  | 'timebarEvents'
  | 'timebarGraph'
  | 'fishingFilters' // TODO embed in dataviewInstances config

export type QueryParams = {
  zoom?: number
  latitude?: number
  longitude?: number
  start?: string
  end?: string
  query?: string
  sidebarOpen?: boolean
  dataviewInstances?: Partial<UrlDataviewInstance[]>
  timebarVisualisation?: TimebarVisualisations
  timebarEvents?: TimebarEvents
  timebarGraph?: TimebarGraphs
}

export type MapCoordinates = {
  latitude: number
  longitude: number
  zoom: number
  transitionDuration?: number
}

export enum AsyncReducerStatus {
  Idle = 'idle',
  Loading = 'loading',
  Finished = 'finished',
  Error = 'error',
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
