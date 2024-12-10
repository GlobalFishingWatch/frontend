import { extent } from 'simple-statistics'
import type { VesselTrackData, VesselTrackGraphExtent } from './types'
import { DeckTrack } from './vessel-track-proto'

export const DEFAULT_NULL_VALUE = -Math.pow(2, 31)

export const MIN_SPEED_VALUE = 0
export const MAX_SPEED_VALUE = 25
export const MIN_DEPTH_VALUE = 0
export const MAX_DEPTH_VALUE = -6000

export function getVesselGraphExtentClamped(
  domain: VesselTrackGraphExtent,
  colorBy: 'speed' | 'elevation'
) {
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
  const speedExtent = getVesselGraphExtentClamped(extent(getSpeedValues as any), 'speed')
  const elevationExtent = getVesselGraphExtentClamped(
    extent(getElevationValues as any),
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
