import { Field, Segment, Point } from './types'

export const TRACK_FIELDS = [Field.lonlat, Field.timestamp, Field.speed]
export const DEFAULT_NULL_VALUE = -Math.pow(2, 31)

export const trackValueArrayToSegments = (valueArray: number[], fields_: Field[]) => {
  if (!fields_.length) {
    throw new Error()
  }

  const fields = fields_
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

      // values by default must be / 1000000 in order to convert ints to floats
      // except for timestamp that mmust be converted from s to ms
      if (value === nullValue) {
        currentPoint[field] = null
      } else {
        currentPoint[field] = field === Field.timestamp ? value * 1000 : value / 1000000
      }

      pointsFieldIndex++
    }
  })

  // close last open point and open segment
  currentSegment.push(currentPoint)
  segments.push(currentSegment)

  return segments as Segment[]
}
