import { featureCollection, polygon } from '@turf/helpers'
import { bbox, dissolve } from '@turf/turf'
import { Feature, GeoJsonProperties, MultiPolygon, Polygon, Position } from 'geojson'
import {
  BUFFERED_ANTIMERIDIAN_LON,
  wrapFeatureLongitudes,
} from '@globalfishingwatch/data-transforms'

export const getGeometryDissolved = (geometry?: Polygon | MultiPolygon) => {
  if (!geometry) {
    console.warn('No geometry to dissolve')
    return undefined
  }
  const [minX, , maxX] = geometry.bbox || bbox(geometry)

  let wrappedFeatures: Feature<Polygon, GeoJsonProperties>[]
  if (minX <= -BUFFERED_ANTIMERIDIAN_LON || maxX >= BUFFERED_ANTIMERIDIAN_LON) {
    if (geometry?.type === 'MultiPolygon') {
      wrappedFeatures = geometry.coordinates.flatMap((coords) => {
        return wrapFeatureLongitudes(polygon(coords))
      }) as Feature<Polygon, GeoJsonProperties>[]
    } else {
      wrappedFeatures = [
        wrapFeatureLongitudes(polygon(geometry.coordinates as Position[][])),
      ] as Feature<Polygon, GeoJsonProperties>[]
    }
  } else {
    if (geometry?.type === 'MultiPolygon') {
      wrappedFeatures = geometry.coordinates.flatMap((coords) => {
        return polygon(coords)
      }) as Feature<Polygon, GeoJsonProperties>[]
    } else {
      wrappedFeatures = [polygon(geometry.coordinates as Position[][])]
    }
  }
  return dissolve(featureCollection(wrappedFeatures))
}
