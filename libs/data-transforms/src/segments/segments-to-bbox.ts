import { bbox, featureCollection, point } from '@turf/turf'
import type { Feature, Point, Position } from 'geojson'

import type { TrackSegment } from '@globalfishingwatch/api-types'

import type { BBox } from '../types'
import { wrapPointLongitudes } from '../wrap-longitudes'

export function getBboxFromPoints(points: Feature<Point>[]): BBox {
  const wrappedPoints = featureCollection(wrapPointLongitudes(points))
  return bbox(wrappedPoints) as BBox
}

export function segmentsToBbox(segments: TrackSegment[]): BBox {
  const points = segments.flatMap((segment) =>
    segment.flatMap((p) => {
      if (p.longitude && p.latitude) return point([p.longitude, p.latitude] as Position)
      return []
    })
  )
  return getBboxFromPoints(points)
}
