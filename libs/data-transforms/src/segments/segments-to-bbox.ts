import { Segment } from '../track-value-array-to-segments'
import { BBox } from './types'

export function segmentsToBbox(segments: Segment[]): BBox {
  const result: BBox = [90, 180, -90, -180]
  segments.forEach((segment) => {
    if (segment.length > 1) {
      segment.forEach((point) => {
        if (point.longitude && result[0] > point.longitude) {
          result[0] = point.longitude
        }
        if (point.latitude && result[1] > point.latitude) {
          result[1] = point.latitude
        }
        if (point.longitude && result[2] < point.longitude) {
          result[2] = point.longitude
        }
        if (point.latitude && result[3] < point.latitude) {
          result[3] = point.latitude
        }
      })
    }
  })
  return result
}
