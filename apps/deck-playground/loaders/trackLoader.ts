import Pbf from 'pbf'
import { LoaderWithParser } from '@loaders.gl/loader-utils'

export const trackLoader: LoaderWithParser = {
  name: 'Tracks',
  module: 'tracks',
  options: {},
  id: 'Tracks-pbf',
  version: 'latest',
  extensions: ['pbf'],
  mimeTypes: ['application/x-protobuf', 'application/octet-stream', 'application/protobuf'],
  worker: false,
  parse: async (arrayBuffer) => parseTrack(arrayBuffer),
  parseSync: async (arrayBuffer) => parseTrack(arrayBuffer),
}

function readData(_, data, pbf) {
  data.push(pbf.readPackedSVarint())
}

const parseTrack = (arrayBuffer) => {
  // read
  const data = new Pbf(arrayBuffer).readFields(readData, [])[0]
  const segments = trackValueArrayToSegments(data, ['lonlat', 'timestamp'])
  const formattedSegments = [
    segments.map((segment) => ({
      waypoints: segment.map((point) => ({
        coordinates: [point.longitude, point.latitude],
        timestamp: point.timestamp,
      })),
    })),
  ]
  return formattedSegments[0]
}

export const DEFAULT_NULL_VALUE = -Math.pow(2, 31)

const transformerByField = {
  latitude: (value) => value / Math.pow(10, 6),
  longitude: (value) => value / Math.pow(10, 6),
  timestamp: (value) => value * Math.pow(10, 3),
}

export const trackValueArrayToSegments = (valueArray, fields_) => {
  if (!fields_.length) {
    throw new Error()
  }

  const fields = [...fields_]
  if (fields.includes('lonlat')) {
    const llIndex = fields.indexOf('lonlat')
    fields.splice(llIndex, 1, 'longitude', 'latitude')
  }
  const numFields = fields.length

  let numSegments
  const segmentIndices = []
  const segments = []

  let nullValue = DEFAULT_NULL_VALUE
  let currentSegment = []
  let currentPoint = {}
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

  // close last open point and open segment
  if (Object.keys(currentPoint).length) {
    currentSegment.push(currentPoint)
  }

  if (currentSegment.length) {
    segments.push(currentSegment)
  }

  return segments
}

// const getDate = (day) => {
//   return new Date(day * 1000 * 60 * 60 * 24).toDateString();
// };
