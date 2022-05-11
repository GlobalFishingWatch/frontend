export enum Locale {
  en = 'en',
}

export type WorkspaceParam =
  | 'zoom'
  | 'latitude'
  | 'longitude'
  | 'start'
  | 'end'
  | 'sidebarOpen'
  | 'satellite'

export type QueryParams = {
  [query in WorkspaceParam]?: string | number | boolean | null
}

export type MapCoordinates = {
  latitude: number
  longitude: number
  zoom: number
  transitionDuration?: number
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

export declare type PortAreaFeature = {
  type: string
  geometry: {
    type: string
    coordinates: [number, number][][]
  }
}

export interface PortPositionsGeneratorConfig {
  type: 'geojson'
  data: {
    features: PortPositionFeature[]
    type: 'FeatureCollection'
  }
}

export interface AreaGeneratorConfig {
  type: 'geojson'
  data: {
    features: PortAreaFeature[]
    type: 'FeatureCollection'
  }
}

export interface PortSubarea {
  id: string
  name: string
  color?: string
}

export interface PortPosition {
  s2id: string
  lat: number
  lon: number
  top_destination: string
  port_label: string
  community_label: string
  point_label: string
  iso3: string
  distance_from_shore_m: string
  community_iso3: string
  port_iso3: string
}
