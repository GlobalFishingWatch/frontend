import type { MultiPolygon, Polygon } from 'geojson'

export interface ContextAreaGeometryProperties {
  fid: string
  mrgid: string
  gfw_id: string
  geoname: string
}

export type ContextAreaGeometryGeom = Polygon | MultiPolygon
export interface ContextAreaGeometry<P = ContextAreaGeometryProperties> {
  id: string
  type: string
  geometry: ContextAreaGeometryGeom
  properties: P
}
