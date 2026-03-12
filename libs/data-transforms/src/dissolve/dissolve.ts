import { bbox } from '@turf/bbox'
import { dissolve } from '@turf/dissolve'
import { featureCollection, point, polygon } from '@turf/helpers'
import type { Feature, GeoJsonProperties, MultiPolygon, Point, Polygon, Position } from 'geojson'

import { BUFFERED_ANTIMERIDIAN_LON, wrapFeatureLongitudes } from '../wrap-longitudes'

export const getGeometryDissolved = (geometry?: Point | Polygon | MultiPolygon) => {
  try {
    if (!geometry) {
      return undefined
    }

    if (geometry.type === 'Point') return featureCollection([point(geometry.coordinates)])

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
  } catch (e) {
    console.error('Error dissolving geometry', e)
    return undefined
  }
}
