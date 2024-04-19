import { VesselTrackData } from './types'
import { DeckTrack } from './vessel-track-proto'

export const DEFAULT_NULL_VALUE = -Math.pow(2, 31)

export const parseTrack = (arrayBuffer: ArrayBuffer): VesselTrackData => {
  const track = DeckTrack.decode(new Uint8Array(arrayBuffer)) as any
  return {
    ...track,
    attributes: {
      getPath: {
        value: new Float32Array(track.attributes.getPath.value),
        size: track.attributes.getPath.size,
      },
      getTimestamp: {
        value: new Float32Array(track.attributes.getTimestamp.value),
        size: track.attributes.getTimestamp.size,
      },
      getSpeed: {
        value: new Float32Array(track.attributes.getSpeed.value),
        size: track.attributes.getSpeed.size,
      },
      // TODO
      // getElevation
      // getCourse
    },
  } as VesselTrackData
}
