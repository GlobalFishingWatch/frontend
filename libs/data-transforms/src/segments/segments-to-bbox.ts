import { featureCollection, point, Position } from '@turf/helpers'
import bbox from '@turf/bbox'
import { Segment } from '../track-value-array-to-segments'
import { BBox } from './types'

export function segmentsToBbox(segments: Segment[]): BBox {
  const points = segments.flatMap((segment) =>
    segment.map((p) => {
      return point([p.longitude, p.latitude] as Position)
    })
  )
  const features = featureCollection(points)
  return bbox(features) as BBox
}
