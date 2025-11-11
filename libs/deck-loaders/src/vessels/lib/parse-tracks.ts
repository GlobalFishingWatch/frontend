import type { VesselTrackData, VesselTrackGraphExtent } from './types'
import { DeckTrack } from './vessel-track-proto'

export const DEFAULT_NULL_VALUE = -Math.pow(2, 31)

export const MIN_SPEED_VALUE = 0
export const MAX_SPEED_VALUE = 25
export const MIN_DEPTH_VALUE = 0
export const MAX_DEPTH_VALUE = -6000

function getExtent(array: number[], colorBy: 'speed' | 'elevation') {
  let q1
  let q3
  const values = array.filter(Boolean).sort((a, b) => a - b)

  if (colorBy === 'elevation') {
    // Elevation values are negative, so we need to invert min and max
    return [
      Math.min(values[values.length - 1], MIN_DEPTH_VALUE),
      Math.max(values[0], MAX_DEPTH_VALUE),
    ]
  }
  const filteredValues = values
  // important values were missing in the speed legend, so removing outlier filtering for now

  // Remove speed outliers
  // if (values.length > 4) {
  //   // find quartiles
  //   if ((values.length / 4) % 1 === 0) {
  //     q1 = (1 / 2) * (values[values.length / 4] + values[values.length / 4 + 1])
  //     q3 = (1 / 2) * (values[values.length * (3 / 4)] + values[values.length * (3 / 4) + 1])
  //   } else {
  //     q1 = values[Math.floor(values.length / 4 + 1)]
  //     q3 = values[Math.ceil(values.length * (3 / 4) + 1)]
  //   }

  //   const iqr = q3 - q1
  //   const minValue = q1 - iqr * 1.25
  //   const maxValue = q3 + iqr * 1.25
  //   filteredValues = values.filter((x) => x >= minValue && x <= maxValue)
  // }

  return [
    Math.max(filteredValues[0], MIN_SPEED_VALUE),
    Math.min(filteredValues[filteredValues.length - 1], MAX_SPEED_VALUE),
  ]
}

export function getVesselGraphExtentClamped(
  domain: VesselTrackGraphExtent,
  colorBy: 'speed' | 'elevation'
) {
  if (isNaN(domain[0]) || isNaN(domain[1])) {
    return colorBy === 'elevation'
      ? [MIN_DEPTH_VALUE, MAX_DEPTH_VALUE]
      : [MIN_SPEED_VALUE, MAX_SPEED_VALUE]
  }
  if (colorBy === 'elevation') {
    // Elevation values are negative, so we need to invert min and max
    return [Math.min(domain[1], MIN_DEPTH_VALUE), Math.max(domain[0], MAX_DEPTH_VALUE)]
  }
  return [Math.max(domain[0], MIN_SPEED_VALUE), Math.min(domain[1], MAX_SPEED_VALUE)]
}

export type VesselTrackLoaderParams = {
  maxTimeGapHours?: number
}
export const parseTrack = (
  arrayBuffer: ArrayBuffer,
  { maxTimeGapHours } = {} as VesselTrackLoaderParams
): VesselTrackData => {
  const track = DeckTrack.decode(new Uint8Array(arrayBuffer)) as unknown as VesselTrackData
  if (!track.attributes.getPath.value.length) {
    return {} as VesselTrackData
  }
  const defaultAttributesLength =
    track.attributes.getPath.value.length / track.attributes.getPath.size

  const getSpeedValues = track.attributes.getSpeed.value?.length
    ? new Float32Array(track.attributes.getSpeed.value)
    : new Float32Array(defaultAttributesLength)
  const getElevationValues = track.attributes.getElevation.value?.length
    ? new Float32Array(track.attributes.getElevation.value)
    : new Float32Array(defaultAttributesLength)

  const pathSize = track.attributes.getPath.size
  const timestampSize = track.attributes.getTimestamp.size
  const speedSize = track.attributes.getSpeed.size
  const elevationSize = track.attributes.getElevation.size

  if (!maxTimeGapHours) {
    const speedExtent = getExtent(getSpeedValues as any, 'speed')
    const elevationExtent = getExtent(getElevationValues as any, 'elevation')

    return {
      ...track,
      attributes: {
        getPath: {
          value: new Float32Array(track.attributes.getPath.value),
          size: pathSize,
        },
        getTimestamp: {
          value: track.attributes.getTimestamp.value?.length
            ? new Float32Array(track.attributes.getTimestamp.value)
            : new Float32Array(defaultAttributesLength),
          size: timestampSize,
        },
        getSpeed: {
          value: getSpeedValues,
          size: speedSize,
          extent: speedExtent,
        },
        getElevation: {
          value: getElevationValues,
          size: elevationSize,
          extent: elevationExtent,
        },
        // TODO getCourse
      },
    } as VesselTrackData
  }

  const maxTimeGapMs = maxTimeGapHours * 3600000
  const originalStartIndices = track.startIndices || [0]
  const originalPath = new Float32Array(track.attributes.getPath.value)
  const originalTimestamps = track.attributes.getTimestamp.value?.length
    ? new Float32Array(track.attributes.getTimestamp.value)
    : new Float32Array(defaultAttributesLength)

  const newPath: number[] = []
  const newTimestamps: number[] = []
  const newSpeeds: number[] = []
  const newElevations: number[] = []
  const newGaps: number[] = []
  const newStartIndices: number[] = [0]

  function addPoint(pointIdx: number, timestamp: number, isGap: boolean) {
    for (let i = 0; i < pathSize; i++) {
      newPath.push(originalPath[pointIdx * pathSize + i])
    }
    newTimestamps.push(timestamp)
    if (speedSize > 0) {
      newSpeeds.push(getSpeedValues[pointIdx * speedSize] || 0)
    }
    if (elevationSize > 0) {
      newElevations.push(getElevationValues[pointIdx * elevationSize] || 0)
    }
    newGaps.push(isGap ? 1 : 0)
  }

  function startNewSegment() {
    if (newPath.length > 0) {
      newStartIndices.push(newPath.length / pathSize)
    }
  }

  for (let segIdx = 0; segIdx < originalStartIndices.length; segIdx++) {
    const segmentStart = originalStartIndices[segIdx]
    const segmentEnd =
      segIdx < originalStartIndices.length - 1
        ? originalStartIndices[segIdx + 1]
        : defaultAttributesLength

    // Add start index for new original segment (except first one)
    if (segIdx > 0) {
      startNewSegment()
    }

    let segmentPointCount = 0
    let lastTimestamp: number | undefined

    // Process points within this segment
    for (let pointIdx = segmentStart; pointIdx < segmentEnd; pointIdx++) {
      const timestamp = originalTimestamps[pointIdx * timestampSize]
      const shouldSplit = lastTimestamp !== undefined && timestamp - lastTimestamp > maxTimeGapMs

      if (shouldSplit) {
        // End current segment
        if (segmentPointCount > 0) {
          startNewSegment()
        }

        // Gap segment strategy: When a time gap exceeds maxTimeGapHours, we create a gap segment
        // that visually represents the discontinuity. The strategy involves:
        // 1. Duplicate the last point of the previous segment as the start of the gap segment
        // 2. Mark the current point as the end of the gap segment (both marked as gap points)
        // 3. Duplicate the current point again as the start of the new normal segment
        // This ensures proper rendering boundaries while clearly marking the gap region.
        const boundaryPointIdx = pointIdx - 1
        addPoint(boundaryPointIdx, originalTimestamps[boundaryPointIdx * timestampSize], true)

        // Add current point as the end of gap segment
        addPoint(pointIdx, timestamp, true)

        // End gap segment, start new normal segment
        startNewSegment()

        // Add current point as first point of new normal segment (duplicate for normal segment)
        addPoint(pointIdx, timestamp, false)

        segmentPointCount = 1
      } else {
        // Add point normally
        addPoint(pointIdx, timestamp, false)
        segmentPointCount++
      }

      lastTimestamp = timestamp
    }
  }

  const newPathArray = new Float32Array(newPath)
  const newTimestampsArray = new Float32Array(newTimestamps)
  const newSpeedsArray = newSpeeds.length > 0 ? new Float32Array(newSpeeds) : getSpeedValues
  const newElevationsArray =
    newElevations.length > 0 ? new Float32Array(newElevations) : getElevationValues
  const newGapsArray = new Float32Array(newGaps)

  const speedExtent = getExtent(Array.from(newSpeedsArray) as any, 'speed')
  const elevationExtent = getExtent(Array.from(newElevationsArray) as any, 'elevation')

  const data = {
    length: newStartIndices.length,
    startIndices: newStartIndices,
    attributes: {
      getPath: {
        value: newPathArray,
        size: pathSize,
      },
      getTimestamp: {
        value: newTimestampsArray,
        size: timestampSize,
      },
      getSpeed: {
        value: newSpeedsArray,
        size: speedSize,
        extent: speedExtent,
      },
      getElevation: {
        value: newElevationsArray,
        size: elevationSize,
        extent: elevationExtent,
      },
      getGap: {
        value: newGapsArray,
        size: 1,
      },
      // TODO getCourse
    },
  } as VesselTrackData
  return data
}
