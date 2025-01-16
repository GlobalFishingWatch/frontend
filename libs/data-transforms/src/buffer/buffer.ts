import { polygon } from '@turf/helpers'
import { bbox, buffer } from '@turf/turf'
import type { Feature, GeoJsonProperties, MultiPolygon, Polygon } from 'geojson'

import { BUFFERED_ANTIMERIDIAN_LON, wrapFeatureLongitudes } from '../wrap-longitudes'

type BufferedFeature = Feature<Polygon | MultiPolygon>

export type BufferUnit = 'nauticalmiles' | 'kilometers'
export type BufferOperation = 'dissolve' | 'difference'
export type GetGeometryBufferParams = {
  unit: BufferUnit
  value: number
}

export const getFeatureBuffer = (
  feature: BufferedFeature | BufferedFeature[],
  { value, unit }: GetGeometryBufferParams
) => {
  const features = Array.isArray(feature) ? feature : [feature]
  const bufferedFeatures = features.flatMap((feature) => {
    const featureBuffer = buffer(feature, value, {
      units: unit,
    }) as Feature<Polygon | MultiPolygon>

    if (!featureBuffer) return []

    const [minX, , maxX] = featureBuffer.bbox || bbox(featureBuffer)

    if (featureBuffer.geometry.type === 'MultiPolygon') {
      return featureBuffer.geometry.coordinates.map((coords) => {
        const coordsPolygon = polygon(coords)
        if (minX <= -BUFFERED_ANTIMERIDIAN_LON || maxX >= BUFFERED_ANTIMERIDIAN_LON) {
          return wrapFeatureLongitudes(coordsPolygon)
        }
        return coordsPolygon
      }) as Feature<Polygon, GeoJsonProperties>[]
    } else {
      if (minX <= -BUFFERED_ANTIMERIDIAN_LON || maxX >= BUFFERED_ANTIMERIDIAN_LON) {
        return wrapFeatureLongitudes(featureBuffer) as Feature<Polygon>
      }
      return featureBuffer as Feature<Polygon>
    }
  })
  return bufferedFeatures
}
