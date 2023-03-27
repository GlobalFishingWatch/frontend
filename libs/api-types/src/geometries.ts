import type { MultiPolygon, Polygon } from 'geojson'

export interface ContextAreaFeatureProperties {
  gfw_id: string
  [key: string]: string
}

export type ContextAreaFeatureGeom = Polygon | MultiPolygon
export interface ContextAreaFeature<P = ContextAreaFeatureProperties> {
  id: string
  type: string
  geometry: ContextAreaFeatureGeom
  properties: P
}
