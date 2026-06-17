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
  // Whether to compute the per-point time gaps (in hours). Skipped entirely when the
  // gap-segment feature is off so we don't pay the cost on every track parse.
  computeGaps?: boolean
}

export const parseTrack = (
  arrayBuffer: ArrayBuffer,
  { computeGaps = false } = {} as VesselTrackLoaderParams
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

  const speedExtent = getExtent(getSpeedValues as any, 'speed')
  const elevationExtent = getExtent(getElevationValues as any, 'elevation')

  const timestamps = track.attributes.getTimestamp.value?.length
    ? new Float32Array(track.attributes.getTimestamp.value)
    : new Float32Array(defaultAttributesLength)

  // getGap stores, per point, the time gap (in hours) to the next point in the same path.
  // The shader and the segment helper compare it against gapSegmentThreshold at render time, so
  // the threshold is no longer baked into the parsed data (no reparse when it changes).
  // Boundaries between paths and the last point have no outgoing segment -> 0.
  // Computed only when the gap-segment feature is on (computeGaps).
  let gaps: Float32Array | undefined
  if (computeGaps) {
    const segmentStartIndices = new Set(track.startIndices || [0])
    gaps = new Float32Array(defaultAttributesLength)
    for (let i = 0; i < defaultAttributesLength - 1; i++) {
      const nextStartsNewPath = segmentStartIndices.has(i + 1)
      if (nextStartsNewPath) continue
      const current = timestamps[i * timestampSize]
      const next = timestamps[(i + 1) * timestampSize]
      gaps[i] = (next - current) / 3600000
    }
  }

  return {
    ...track,
    attributes: {
      getPath: {
        value: new Float32Array(track.attributes.getPath.value),
        size: pathSize,
      },
      getTimestamp: {
        value: timestamps,
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
      ...(gaps && {
        getGap: {
          value: gaps,
          size: 1,
        },
      }),
      // TODO getCourse
    },
  } as VesselTrackData
}
