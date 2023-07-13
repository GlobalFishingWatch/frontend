import { Feature, featureCollection, Point, point, Position } from '@turf/helpers'
import bbox from '@turf/bbox'
import { Segment } from '@globalfishingwatch/api-types'
import { BBox } from '../types'

export function getBboxFromPoints(points: Feature<Point>[]): BBox {
  const features = featureCollection(points)
  return bbox(features) as BBox
}

export function segmentsToBbox(segments: Segment[]): BBox {
  const points = segments.flatMap((segment) =>
    segment.flatMap((p) => {
      if (p.longitude && p.latitude) return point([p.longitude, p.latitude] as Position)
      return []
    })
  )
  return getBboxFromPoints(points)
}
