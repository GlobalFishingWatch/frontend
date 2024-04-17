import Pbf from 'pbf'
import { TrackField } from '@globalfishingwatch/api-types'
import { VesselTrackData } from './types'

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

export const trackValueArrayToDeckBinary = (valueArray: number[], fields_: TrackField[]) => {
  if (!fields_.length || !valueArray?.length) {
    throw new Error()
  }

  const fields = [...fields_]
  if (fields.includes(TrackField.lonlat)) {
    const llIndex = fields.indexOf('lonlat' as TrackField)
    fields.splice(llIndex, 1, TrackField.longitude, TrackField.latitude)
  }
  const numFields = fields.length

  const nullValue = valueArray[0]
  const numSegments = valueArray[1]
  const segmentStartOffset = 2 + numSegments

  const track: VesselTrackData = {
    // Number of geometries
    length: 0,
    // Indices into positions where each path starts
    startIndices: valueArray.slice(2, segmentStartOffset) as number[],
    // Flat coordinates array
    attributes: {
      getPath: { value: new Float32Array(), size: 2 },
      getTimestamps: { value: new Float32Array(), size: 1 },
    },
  }

  const trackPositionsAttributeSize = track.attributes.getPath.size
  track.startIndices.forEach((startIndex, i) => {
    const endIndex = track.startIndices[i + 1] || valueArray.length
    const segment = valueArray.slice(startIndex + segmentStartOffset, endIndex + segmentStartOffset)
    const positions = new Float32Array((segment.length / numFields) * trackPositionsAttributeSize)

    const timestamps = new Float32Array(segment.length / numFields)
    // TODO add speed and depth
    // const speed = new Float32Array(segment.length)
    let pointIndex = 0
    segment.forEach((value, j) => {
      const fieldIndex = j % numFields
      const field = fields[fieldIndex]
      const transformer = transformerByField[field]
      // TODO: add speed and depth
      if (value !== nullValue && transformer !== undefined) {
        if (field === TrackField.longitude) {
          positions[trackPositionsAttributeSize * pointIndex] = transformer(value)
        } else if (field === TrackField.latitude) {
          positions[trackPositionsAttributeSize * pointIndex + 1] = transformer(value)
        } else if (field === TrackField.timestamp) {
          timestamps[pointIndex] = transformer(value)
        }
        // TODO add speed and depth
        // } else if (field === TrackField.speed) {
        //   speed[pointIndex] = transformer(value)
        // }
      }
      if (j > 0 && (j + 1) % numFields === 0) {
        pointIndex++
      }
    })
    track.length += segment.length
    track.attributes.getPath.value = new Float32Array([
      ...track.attributes.getPath.value,
      ...positions,
    ])
    track.attributes.getTimestamps.value = new Float32Array([
      ...track.attributes.getTimestamps.value,
      ...timestamps,
    ])
  })

  return track
}

function readValueArrayData(_: any, data: any, pbf: any) {
  data.push(pbf.readPackedSVarint())
}

export const parseTrack = (arrayBuffer: ArrayBuffer): VesselTrackData => {
  const data = new Pbf(arrayBuffer).readFields(readValueArrayData, [])[0]
  // TODO:deck make this fields dynamic from request
  return trackValueArrayToDeckBinary(data, [TrackField.lonlat, TrackField.timestamp])
}
