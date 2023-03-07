import type { MultiPolygon, Polygon } from 'geojson'

export interface ContextAreaFeatureProperties {
  gfw_id: string
  [key: string]: string
}

export type ContextAreaFeatureGeom = Polygon | MultiPolygon
export interface ContextAreaFeature<P = ContextAreaFeatureProperties> {
  id: string
  value?: string
  bbox?: [number, number, number, number] | undefined
  type: string
  geometry: ContextAreaFeatureGeom
  properties: P
}
