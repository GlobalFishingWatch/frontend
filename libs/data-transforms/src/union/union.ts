import { featureCollection, intersect, multiPolygon, polygon, union } from '@turf/turf'
import type { Feature, MultiPolygon, Polygon } from 'geojson'

type PolygonCoords = Polygon['coordinates']
type MultiPolygonCoords = MultiPolygon['coordinates']
export type PolygonGeomCoords = PolygonCoords | MultiPolygonCoords

// Polygon coords are Position[][] (coords[0][0][0] is a number); MultiPolygon coords are Position[][][]
const toPolygonFeature = (coords: PolygonGeomCoords): Feature<Polygon | MultiPolygon> =>
  typeof (coords as any)[0]?.[0]?.[0] === 'number'
    ? polygon(coords as PolygonCoords)
    : multiPolygon(coords as MultiPolygonCoords)

const toMultiPolygonCoords = (
  geometry: Polygon | MultiPolygon | null | undefined
): MultiPolygonCoords => {
  if (!geometry) return []
  return geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
}

export function getPolygonsUnion(geoms: PolygonGeomCoords[]): MultiPolygonCoords {
  if (!geoms.length) return []
  const merged = union(featureCollection(geoms.map(toPolygonFeature)))
  return toMultiPolygonCoords(merged?.geometry)
}

export function getPolygonsIntersection(
  a: PolygonGeomCoords,
  b: PolygonGeomCoords
): MultiPolygonCoords {
  const clipped = intersect(featureCollection([toPolygonFeature(a), toPolygonFeature(b)]))
  return toMultiPolygonCoords(clipped?.geometry)
}
