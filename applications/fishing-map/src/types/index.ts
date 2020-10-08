import { Dataview, WorkspaceDataviewConfig } from '@globalfishingwatch/dataviews-client'

export type FishingFilter = { id: string; label: string }

export type WorkspaceDataview = Dataview & { configId: string }
export type UrlWorkspaceDataviewConfig = Omit<WorkspaceDataviewConfig, 'dataviewId'> & {
  dataviewId?: number // making this optional as sometimes we just need to reference the id
  deleted?: boolean // needed when you want to override from url an existing workspace config
}

export type WorkspaceParam =
  | 'zoom'
  | 'latitude'
  | 'longitude'
  | 'start'
  | 'end'
  | 'dataviewsConfig'
  | 'fishingFilters'

export type QueryParams = {
  zoom?: number
  latitude?: number
  longitude?: number
  start?: string
  end?: string
  dataviewsConfig?: any[]
  fishingFilters?: FishingFilter[]
}

export type MapCoordinates = {
  latitude: number
  longitude: number
  zoom: number
}

export enum AsyncReducerStatus {
  Idle = 'idle',
  Loading = 'loading',
  Finished = 'finished',
  Error = 'error',
}
