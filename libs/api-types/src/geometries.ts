import type { MultiPolygon, Point, Polygon } from 'geojson'

export interface TileContextAreaFeatureProperties {
  gfw_id: string
  [key: string]: string
}

export interface TileContextAreaFeature<
  Geometry = Polygon | MultiPolygon | Point,
  Properties = TileContextAreaFeatureProperties,
> {
  id: string
  value?: string
  bbox?: [number, number, number, number] | undefined
  type: string
  geometry: Geometry
  properties: Properties
}
