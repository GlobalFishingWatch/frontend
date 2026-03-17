import type { MultiPolygon, Point, Polygon } from 'geojson'

export type TileContextAreaFeatureProperties = {
  gfw_id: string
  [key: string]: string
}

export type TileContextAreaFeature<
  Geometry = Polygon | MultiPolygon | Point,
  Properties = TileContextAreaFeatureProperties,
> = {
  id: string
  value?: string
  bbox?: [number, number, number, number] | undefined
  type: string
  geometry: Geometry
  properties: Properties
}
