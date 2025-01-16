import type { TrackPoint,TrackSegment } from '@globalfishingwatch/api-types';
import { TrackField } from '@globalfishingwatch/api-types'

export const TRACK_FIELDS = [TrackField.lonlat, TrackField.timestamp, TrackField.speed]
export const DEFAULT_NULL_VALUE = -Math.pow(2, 31)

/**
 * Transformer functions to be applied on every valueArray field
 * to convert the received value (Int32) to the actual value (Float)
 * depending on its precision.
 * This transformations should be the inverse of the formatterValueArray
 * property of every field defined in:
 *  https://github.com/GlobalFishingWatch/api-vessels-service/blob/develop/src/modules/api/v1/vessels/modules/tracks/services/feature.service.ts
 */
const transformerByField: Partial<Record<TrackField, (value: number) => number>> = {
  [TrackField.course]: (value: number) => value / Math.pow(10, 6),
  [TrackField.distanceFromPort]: (value: number) => value,
  // Uncomment when added to new package version
  // [Field.distanceFromShore]: (value: number) => value,
  [TrackField.elevation]: (value: number) => value,
  // Uncomment when added to new package version
  // [Field.encounter]: (value: number) => value,
  [TrackField.latitude]: (value: number) => value / Math.pow(10, 6),
  [TrackField.longitude]: (value: number) => value / Math.pow(10, 6),
  [TrackField.fishing]: (value: number) => value,
  [TrackField.night]: (value: number) => value,
  [TrackField.speed]: (value: number) => value / Math.pow(10, 6),
  [TrackField.timestamp]: (value: number) => value * Math.pow(10, 3),
}

export const trackValueArrayToSegments = (valueArray: number[], fields_: TrackField[]) => {
  if (!fields_.length) {
    throw new Error()
  }

  const fields: TrackField[] = [...fields_].map((f) => f.toLowerCase() as TrackField)
  if (fields.includes(TrackField.lonlat)) {
    const llIndex = fields.indexOf(TrackField.lonlat)
    fields.splice(llIndex, 1, TrackField.longitude, TrackField.latitude)
  }

  const numFields = fields.length

  let numSegments: number
  const segmentIndices: number[] = []
  const segments: TrackPoint[][] = []

  let nullValue = DEFAULT_NULL_VALUE
  let currentSegment: TrackPoint[] = []
  let currentPoint: TrackPoint = {}
  let pointsFieldIndex = 0
  let currentPointFieldIndex = 0
  let currentSegmentIndex = 0
  let currentSegPointIndex = 0
  valueArray.forEach((value, index) => {
    if (index === 0) {
      nullValue = value
    } else if (index === 1) {
      numSegments = value
    } else if (index < 2 + numSegments) {
      segmentIndices.push(value)
    } else {
      // a segment starts
      if (segmentIndices.includes(pointsFieldIndex)) {
        // close previous segment, only if needed (it's not the first segment)
        if (currentSegmentIndex !== 0) {
          currentSegment.push(currentPoint)
          segments.push(currentSegment)
        }
        currentSegPointIndex = 0
        currentSegmentIndex++
        // create new segment
        currentSegment = []
        currentPoint = {}
      }

      // get what is the current field for current point
      currentPointFieldIndex = pointsFieldIndex % numFields

      // a point starts
      if (currentPointFieldIndex === 0) {
        // close previous point, only if needed (it's not the first point of this seg)
        if (currentSegPointIndex !== 0) {
          currentSegment.push(currentPoint)
        }
        currentSegPointIndex++
        // create new point
        currentPoint = {}
      }

      const field: TrackField = fields[currentPointFieldIndex]
      const transformer =
        transformerByField[field] || transformerByField[field.toLowerCase() as TrackField]

      if (value === nullValue || transformer === undefined) {
        currentPoint[field] = null
      } else {
        currentPoint[field] = transformer(value)
      }

      pointsFieldIndex++
    }
  })

  // close last open point and open segment
  if (Object.keys(currentPoint).length) {
    currentSegment.push(currentPoint)
  }

  if (currentSegment.length) {
    segments.push(currentSegment)
  }

  return segments as TrackSegment[]
}
