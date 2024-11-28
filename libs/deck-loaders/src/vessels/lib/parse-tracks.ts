import type { VesselTrackData } from './types'
import { DeckTrack } from './vessel-track-proto'

export const DEFAULT_NULL_VALUE = -Math.pow(2, 31)

export const parseTrack = (arrayBuffer: ArrayBuffer): VesselTrackData => {
  const track = DeckTrack.decode(new Uint8Array(arrayBuffer)) as any
  if (!track.attributes.getPath.value.length) {
    return {} as VesselTrackData
  }
  const defaultAttributesLength =
    track.attributes.getPath.value.length / track.attributes.getPath.size
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
        value: track.attributes.getSpeed.value?.length
          ? new Float32Array(track.attributes.getSpeed.value)
          : new Float32Array(defaultAttributesLength),
        size: track.attributes.getSpeed.size,
      },
      getElevation: {
        value: track.attributes.getElevation.value?.length
          ? new Float32Array(track.attributes.getElevation.value)
          : new Float32Array(defaultAttributesLength),
        size: track.attributes.getElevation.size,
      },
      // TODO
      // getCourse
    },
  } as VesselTrackData
}
