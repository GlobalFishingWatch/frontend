import { TrackField } from '@globalfishingwatch/api-types'
import { VesselTrackData } from './types'
import { deckTrackDecoder } from './vessel-track-proto'

export const DEFAULT_NULL_VALUE = -Math.pow(2, 31)

const transformerByField: Partial<Record<TrackField, (number: number) => number>> = {
  latitude: (value: number) => value / Math.pow(10, 6),
  longitude: (value: number) => value / Math.pow(10, 6),
  timestamp: (value: number) => value * Math.pow(10, 3),
}

type Point = Record<string, number | null>
export const trackValueArrayToSegments = (valueArray: number[], fields_: TrackField[]) => {
  if (!fields_.length) {
    throw new Error()
  }

  const fields = [...fields_]
  if (fields.includes(TrackField.lonlat)) {
    const llIndex = fields.indexOf('lonlat' as TrackField)
    fields.splice(llIndex, 1, TrackField.longitude, TrackField.latitude)
  }
  const numFields = fields.length

  let numSegments: number
  const segmentIndices = [] as number[]
  const segments = [] as Point[][]

  let nullValue = DEFAULT_NULL_VALUE
  let currentSegment = [] as Point[]
  let currentPoint = {} as Point
  let pointsFieldIndex = 0
  let currentPointFieldIndex = 0
  let currentSegmentIndex = 0
  let currentSegPointIndex = 0
  if (valueArray && valueArray?.length) {
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

        const field = fields[currentPointFieldIndex]
        const transformer = transformerByField[field]

        if (value === nullValue || transformer === undefined) {
          currentPoint[field] = null
        } else {
          currentPoint[field] = transformer(value)
        }

        pointsFieldIndex++
      }
    })
  }

  // close last open point and open segment
  if (Object.keys(currentPoint).length) {
    currentSegment.push(currentPoint)
  }

  if (currentSegment.length) {
    segments.push(currentSegment)
  }

  return segments
}

export const parseTrack = (arrayBuffer: ArrayBuffer): VesselTrackData => {
  return deckTrackDecoder(arrayBuffer)
}
