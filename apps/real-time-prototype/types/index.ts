export type WorkspaceParam = 'zoom' | 'latitude' | 'longitude' | 'start' | 'end' | 'sidebarOpen'

export type QueryParams = {
  [query in WorkspaceParam]?: string | number | boolean | null
}

export type MapCoordinates = {
  latitude: number
  longitude: number
  zoom: number
}
