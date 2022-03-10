import type { MultiPolygon, Polygon } from 'geojson'

export interface ContextAreaGeometryProperties {
  gfw_id: string
  [key: string]: string
}

export type ContextAreaGeometryGeom = Polygon | MultiPolygon
export interface ContextAreaGeometry<P = ContextAreaGeometryProperties> {
  id: string
  type: string
  geometry: ContextAreaGeometryGeom
  properties: P
}
