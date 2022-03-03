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
  color: string
}

export interface PortPosition {
  lat: number;
  lon: number;
  total_visits: number;
  drift_radius: number;
  top_destination: string;
  unique_stationary_ssvid: number;
  unique_stationary_fishing_ssvid: number;
  unique_active_ssvid: number;
  unique_total_ssvid: number;
  active_ssvid_days: number;
  stationary_ssvid_days: number;
  stationary_fishing_ssvid_days: string;
  s2id: string;
  label: string;
  sublabel: string;
  label_source: string;
  iso3: string;
  distance_from_shore_m: string;
  dock: string;
  community: string;
  comm_type: string;
  community_iso3: string;
}