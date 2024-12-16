import { extent } from 'simple-statistics'
import type { VesselTrackData, VesselTrackGraphExtent } from './types'
import { DeckTrack } from './vessel-track-proto'

export const DEFAULT_NULL_VALUE = -Math.pow(2, 31)

export const MIN_SPEED_VALUE = 0
export const MAX_SPEED_VALUE = 25
export const MIN_DEPTH_VALUE = 0
export const MAX_DEPTH_VALUE = -6000

function filterOutliers(array: number[]) {
  if (array.length < 4) return array

  let q1
  let q3
  const values = array.slice().sort((a, b) => a - b)

  //find quartiles
  if ((values.length / 4) % 1 === 0) {
    q1 = (1 / 2) * (values[values.length / 4] + values[values.length / 4 + 1])
    q3 = (1 / 2) * (values[values.length * (3 / 4)] + values[values.length * (3 / 4) + 1])
  } else {
    q1 = values[Math.floor(values.length / 4 + 1)]
    q3 = values[Math.ceil(values.length * (3 / 4) + 1)]
  }

  const iqr = q3 - q1
  const minValue = q1 - iqr * 1.5
  const maxValue = q3 + iqr * 1.5

  return values.filter((x) => x >= minValue && x <= maxValue)
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

export const parseTrack = (arrayBuffer: ArrayBuffer): VesselTrackData => {
  const track = DeckTrack.decode(new Uint8Array(arrayBuffer)) as any
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

  const speedExtent = getVesselGraphExtentClamped(
    extent(filterOutliers(getSpeedValues as any)),
    'speed'
  )
  const elevationExtent = getVesselGraphExtentClamped(
    extent(filterOutliers(getElevationValues as any)),
    'elevation'
  )
  return {
    ...track,
    attributes: {
      getPath: {
        value: new Float32Array(track.attributes.getPath.value),
        size: track.attributes.getPath.size,
      },
      getTimestamp: {
        value: track.attributes.getTimestamp.value?.length
          ? new Float32Array(track.attributes.getTimestamp.value)
          : new Float32Array(defaultAttributesLength),
        size: track.attributes.getTimestamp.size,
      },
      getSpeed: {
        value: getSpeedValues,
        size: track.attributes.getSpeed.size,
        extent: speedExtent,
      },
      getElevation: {
        value: getElevationValues,
        size: track.attributes.getElevation.size,
        extent: elevationExtent,
      },
      // TODO getCourse
    },
  } as VesselTrackData
}
