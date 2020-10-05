export type FishingFilter = { id: string; label: string }

export type WorkspaceParam =
  | 'zoom'
  | 'latitude'
  | 'longitude'
  | 'start'
  | 'end'
  | 'dataviews'
  | 'fishingFilters'

export type QueryParams = {
  zoom?: number
  latitude?: number
  longitude?: number
  start?: string
  end?: string
  dataviews?: any[]
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
