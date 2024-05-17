import { TrackPointProperties, UserTrack } from '@globalfishingwatch/api-types'
import { UserTrackData } from './types'

function arrayBufferToJson(arrayBuffer: ArrayBuffer) {
  try {
    const string = new TextDecoder().decode(arrayBuffer)
    const json = JSON.parse(string) as UserTrack
    return json
  } catch (e) {
    console.error(e)
    return null
  }
}

export type ParseUserTrackParams = {
  timestampProperty: string
  workerUrl?: string
}

export const parseUserTrack = (
  arrayBuffer: ArrayBuffer,
  params = {} as ParseUserTrackParams
): UserTrackData => {
  const { timestampProperty = 'times' } = params
  const data = arrayBufferToJson(arrayBuffer)
  if (!data) {
    return {} as UserTrackData
  }
  const track = {
    length: data.features.length,
    startIndices: data.features.map((f) => f.geometry.coordinates.length),
    attributes: {
      getPath: {
        value: new Float32Array(data.features.flatMap((f) => f.geometry.coordinates.flat())),
        size: 2,
      },
      getTimestamp: {
        value: new Float32Array(
          data.features.flatMap((f) => f.properties.coordinateProperties?.[timestampProperty] | 0)
        ),
        size: 1,
      },
    },
  } as UserTrackData
  console.log('🚀 ~ track:', track)
  return track
}
