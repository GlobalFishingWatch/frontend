import { UserTrack } from '@globalfishingwatch/api-types'
import { TrackCoordinatesPropertyFilter, filterTrackByCoordinateProperties } from './utils'
import { UserTrackData } from './types'

function isNumeric(str: string | number) {
  if (!str) return false
  if (typeof str == 'number') return true
  return !isNaN(parseFloat(str))
}

function getCoordinatesFilter(filters = {} as Record<string, any>) {
  const coordinateFilters: TrackCoordinatesPropertyFilter[] = Object.entries(filters).map(
    ([id, values]) => {
      if (isNumeric(values[0]) && isNumeric(values[1])) {
        return {
          id,
          min: parseFloat(values[0] as string),
          max: parseFloat(values[1] as string),
        }
      }
      return { id, values }
    }
  )
  return coordinateFilters
}

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
  filters: Record<string, any>
  workerUrl?: string
}

const timestampProperty = 'times'

export const parseUserTrack = (
  arrayBuffer: ArrayBuffer,
  params = {} as ParseUserTrackParams
): UserTrackData => {
  const data = arrayBufferToJson(arrayBuffer)
  if (!data) {
    return {} as UserTrackData
  }

  const filteredTrack = filterTrackByCoordinateProperties(data, {
    filters: getCoordinatesFilter(params.filters),
    includeNonTemporalFeatures: true,
  })

  const length = filteredTrack.features.reduce((acc, feature) => {
    if (feature.geometry.type === 'MultiLineString') {
      return acc + feature.geometry.coordinates.length
    }
    return acc + 1
  }, 0)

  const startIndices = filteredTrack.features.reduce(
    (acc, feature) => {
      const lastIndex = acc[acc.length - 1]
      if (feature.geometry.type === 'MultiLineString') {
        let multiLineIndex = 0
        feature.geometry.coordinates.forEach((line) => {
          acc.push(lastIndex + multiLineIndex + line.length)
          multiLineIndex += line.length
        })
      } else {
        acc.push(lastIndex + feature.geometry.coordinates.length)
      }
      return acc
    },
    [0]
  )

  const track = {
    length,
    startIndices,
    attributes: {
      getPath: {
        value: new Float32Array(
          filteredTrack.features.flatMap((f) => f.geometry.coordinates.flatMap((l) => l.flat()))
        ),
        size: 2,
      },
      getTimestamp: {
        value: new Float32Array(
          filteredTrack.features.flatMap(
            (f) =>
              f.properties?.coordinateProperties?.[timestampProperty] ||
              Array(f.geometry.coordinates.length).fill(0)
          )
        ),
        size: 1,
      },
    },
  } as UserTrackData

  return track
}
