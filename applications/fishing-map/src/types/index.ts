export type WorkspaceParam = 'zoom' | 'latitude' | 'longitude' | 'start' | 'end' | 'dataviews'

export type QueryParams = {
  zoom?: number
  latitude?: number
  longitude?: number
  start?: string
  end?: string
  dataviews?: any[]
}

export type MapCoordinates = {
  latitude: number
  longitude: number
  zoom: number
}

export type AsyncReducerStatus = 'idle' | 'loading' | 'finished' | 'error'
