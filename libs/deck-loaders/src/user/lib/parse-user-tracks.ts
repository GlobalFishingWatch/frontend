import type { UserTrack } from '@globalfishingwatch/api-types'

import type { UserTrackBinaryData, UserTrackData } from './types'
import type { TrackCoordinatesPropertyFilter} from './utils';
import { filterTrackByCoordinateProperties } from './utils'

export function isNumeric(str: string | number) {
  if (!str) return false
  if (typeof str == 'number') return true
  return !isNaN(parseFloat(str))
}

function getCoordinatesFilter(filters = {} as Record<string, any>) {
  const coordinateFilters: TrackCoordinatesPropertyFilter[] = Object.entries(filters).map(
    ([id, values]) => {
      if (values.length === 2 && isNumeric(values[0]) && isNumeric(values[1])) {
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

const COORDINATE_PROPERTY_TIMESTAMP = 'times'

export const parseUserTrack = (
  arrayBuffer: ArrayBuffer,
  params = {} as ParseUserTrackParams
): UserTrackData => {
  const rawData = arrayBufferToJson(arrayBuffer)
  if (!rawData) {
    return {} as UserTrackData
  }

  const data = filterTrackByCoordinateProperties(rawData, {
    filters: getCoordinatesFilter(params.filters),
    includeNonTemporalFeatures: true,
    includeCoordinateProperties: [COORDINATE_PROPERTY_TIMESTAMP],
  })

  const length = data.features.reduce((acc, feature) => {
    if (feature.geometry.type === 'MultiLineString') {
      return acc + feature.geometry.coordinates.length
    }
    return acc + 1
  }, 0)

  const startIndices = data.features.reduce(
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

  const binary = {
    length,
    startIndices,
    attributes: {
      getPath: {
        value: new Float32Array(
          data.features.flatMap((f) => f.geometry.coordinates.flatMap((l) => l.flat()))
        ),
        size: 2,
      },
      getTimestamp: {
        value: new Float32Array(
          data.features.flatMap((f) => {
            const timestampsLength =
              f.geometry.type === 'MultiLineString'
                ? f.geometry.coordinates.reduce((acc, next) => {
                    return acc + next.length
                  }, 0)
                : f.geometry.coordinates.length
            return f.geometry.type === 'MultiLineString'
              ? f.properties?.coordinateProperties?.[COORDINATE_PROPERTY_TIMESTAMP]?.flat()
              : f.properties?.coordinateProperties?.[COORDINATE_PROPERTY_TIMESTAMP] ||
                  Array(timestampsLength).fill(0)
          })
        ),
        size: 1,
      },
    },
  } as UserTrackBinaryData

  return { data, binary }
}
