import { bbox, featureCollection, point } from '@turf/turf'
import type { Feature, Point, Position } from 'geojson'

import type { TrackSegment } from '@globalfishingwatch/api-types'

import type { Bbox } from '../types'
import { wrapPointLongitudes } from '../wrap-longitudes'

export function getBboxFromPoints(points: Feature<Point>[]): Bbox {
  const wrappedPoints = featureCollection(wrapPointLongitudes(points))
  return bbox(wrappedPoints) as Bbox
}

export function segmentsToBbox(segments: TrackSegment[]): Bbox {
  const points = segments.flatMap((segment) =>
    segment.flatMap((p) => {
      if (p.longitude && p.latitude) return point([p.longitude, p.latitude] as Position)
      return []
    })
  )
  return getBboxFromPoints(points)
}
