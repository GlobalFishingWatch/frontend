import Pbf from 'pbf'
import { VesselTrackData } from './types'

export const DEFAULT_NULL_VALUE = -Math.pow(2, 31)

const transformerByField = {
  latitude: (value: number) => value / Math.pow(10, 6),
  longitude: (value: number) => value / Math.pow(10, 6),
  timestamp: (value: number) => value * Math.pow(10, 3),
}

type Point = Record<string, number | null>
export const trackValueArrayToSegments = (valueArray: number[], fields_: string[]) => {
  if (!fields_.length) {
    throw new Error()
  }

  const fields = [...fields_]
  if (fields.includes('lonlat')) {
    const llIndex = fields.indexOf('lonlat')
    fields.splice(llIndex, 1, 'longitude', 'latitude')
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

function readValueArrayData(_: any, data: any, pbf: any) {
  data.push(pbf.readPackedSVarint())
}

export const parseTrack = (arrayBuffer: ArrayBuffer): VesselTrackData => {
  const track: VesselTrackData = {
    // Number of geometries
    length: 0,
    // Indices into positions where each path starts
    startIndices: [] as number[],
    // Flat coordinates array
    attributes: {
      getPath: { value: new Float32Array(), size: 2 },
      getTimestamps: { value: new Float32Array(), size: 1 },
    },
  }

  let index = 0
  const segmentIndexes = [0] as number[]
  const data = new Pbf(arrayBuffer).readFields(readValueArrayData, [])[0]
  // TODO make the fields dynamic to support speed or depth
  const segments = trackValueArrayToSegments(data, ['lonlat', 'timestamp'])
  const dataLength = segments.reduce((acc, data) => data.length + acc, 0)
  const positions = new Float32Array(dataLength * track.attributes.getPath.size)
  const timestamps = new Float32Array(dataLength)

  segments.forEach((segment, i) => {
    if (i > 0) {
      segmentIndexes.push(index * track.attributes.getPath.size)
    }
    segment.forEach((point, j) => {
      positions[track.attributes.getPath.size * index] = point.longitude as number
      positions[track.attributes.getPath.size * index + 1] = point.latitude as number
      timestamps[index] = Number(point.timestamp)
      index++
    })
  })
  track.length = segmentIndexes.length
  track.startIndices = segmentIndexes
  track.attributes.getPath.value = positions
  track.attributes.getTimestamps.value = timestamps

  return track
}
