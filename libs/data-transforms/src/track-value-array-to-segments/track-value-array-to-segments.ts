import { Field, Segment, Point } from '@globalfishingwatch/api-types'

export const TRACK_FIELDS = [Field.lonlat, Field.timestamp, Field.speed]
export const DEFAULT_NULL_VALUE = -Math.pow(2, 31)

/**
 * Transformer functions to be applied on every valueArray field
 * to convert the received value (Int32) to the actual value (Float)
 * depending on its precision.
 * This transformations should be the inverse of the formatterValueArray
 * property of every field defined in:
 *  https://github.com/GlobalFishingWatch/api-vessels-service/blob/develop/src/modules/api/v1/vessels/modules/tracks/services/feature.service.ts
 */
const transformerByField: Partial<Record<Field, (value: number) => number>> = {
  [Field.course]: (value: number) => value / Math.pow(10, 6),
  [Field.distanceFromPort]: (value: number) => value,
  // Uncomment when added to new package version
  // [Field.distanceFromShore]: (value: number) => value,
  [Field.elevation]: (value: number) => value,
  // Uncomment when added to new package version
  // [Field.encounter]: (value: number) => value,
  [Field.latitude]: (value: number) => value / Math.pow(10, 6),
  [Field.longitude]: (value: number) => value / Math.pow(10, 6),
  [Field.fishing]: (value: number) => value,
  [Field.night]: (value: number) => value,
  [Field.speed]: (value: number) => value / Math.pow(10, 6),
  [Field.timestamp]: (value: number) => value * Math.pow(10, 3),
}

export const trackValueArrayToSegments = (valueArray: number[], fields_: Field[]) => {
  if (!fields_.length) {
    throw new Error()
  }

  const fields: Field[] = [...fields_]
  if (fields.includes(Field.lonlat)) {
    const llIndex = fields.indexOf(Field.lonlat)
    fields.splice(llIndex, 1, Field.longitude, Field.latitude)
  }
  const numFields = fields.length

  let numSegments: number
  const segmentIndices: number[] = []
  const segments: Point[][] = []

  let nullValue = DEFAULT_NULL_VALUE
  let currentSegment: Point[] = []
  let currentPoint: Point = {}
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

      const field: Field = fields[currentPointFieldIndex]
      const transformer = transformerByField[field]

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

  return segments as Segment[]
}
