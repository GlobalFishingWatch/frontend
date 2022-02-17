export enum Locale {
  en = 'en',
}

export type WorkspaceParam = 'zoom' | 'latitude' | 'longitude' | 'start' | 'end' | 'sidebarOpen' | 'satellite'

export type QueryParams = {
  [query in WorkspaceParam]?: string | number | boolean | null
}

export type MapCoordinates = {
  latitude: number
  longitude: number
  zoom: number
}

export declare type PortPositionFeature = {
  id: number
  type: string
  geometry: {
    type: string
    coordinates: [number, number]
  }
  properties: {
    id: string
    color: string
  }
}

export interface PortPositionsGeneratorConfig {
  type: 'geojson'
  data: {
    features: PortPositionFeature[]
    type: 'FeatureCollection'
  }
}