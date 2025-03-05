import type { Feature, FeatureCollection, GeoJsonProperties, Point } from 'geojson'

import type { DatasetSchema, DatasetSchemaItem } from '@globalfishingwatch/api-types'

import { parseCoords } from '../coordinates'
import { getUTCDate } from '../dates'
import { normalizePropertiesKeys } from '../schema'
import type { PointColumns } from '../types'

export const cleanProperties = (
  object: GeoJsonProperties,
  schema: Record<string, DatasetSchema | DatasetSchemaItem> | undefined
) => {
  const result = normalizePropertiesKeys(object)
  for (const property in result) {
    const propertySchema = schema?.[property]
    if (result[property] !== null) {
      if (propertySchema?.type === 'string') {
        result[property] = String(result[property])
      } else if (
        (propertySchema?.type === 'coordinate' || propertySchema?.type === 'range') &&
        isNaN(Number(result[property]))
      ) {
        delete result[property]
      }
    }
  }
  return result
}

export const pointsListToGeojson = (
  data: Record<string, any>[],
  { latitude, longitude, id, startTime, endTime, schema }: PointColumns
) => {
  let hasDatesError = false
  const features: Feature<Point>[] = data.flatMap((point, index) => {
    const cleanedPoint = normalizePropertiesKeys(point)
    if (!cleanedPoint[latitude] || !cleanedPoint[longitude]) return []
    const coords = parseCoords(cleanedPoint[latitude] as number, cleanedPoint[longitude] as number)
    if (coords) {
      const cleanedProperties = cleanProperties(cleanedPoint, schema)
      const startTimeMs = startTime
        ? getUTCDate(cleanedPoint[startTime] as string).getTime()
        : undefined
      if (startTimeMs !== undefined && isNaN(startTimeMs)) {
        hasDatesError = true
      }
      const endTimeMs = endTime ? getUTCDate(cleanedPoint[endTime] as string).getTime() : undefined
      if (endTimeMs !== undefined && isNaN(endTimeMs)) {
        hasDatesError = true
      }
      return {
        type: 'Feature',
        properties: {
          ...cleanedProperties,
          ...(startTime && {
            [startTime]: startTimeMs,
          }),
          ...(endTime && { [endTime]: endTimeMs }),
          id: id && cleanedPoint[id] ? cleanedPoint[id] : index,
        },
        geometry: {
          type: 'Point',
          coordinates: [coords.longitude, coords.latitude],
        },
      }
    } else {
      return []
    }
  })
  return {
    type: 'FeatureCollection',
    features,
    metadata: { hasDatesError },
  } as FeatureCollection
}

export const pointsGeojsonToNormalizedGeojson = (
  data: FeatureCollection,
  { startTime, endTime }: Partial<PointColumns>
) => {
  return {
    type: 'FeatureCollection',
    features: data.features.map((feature) => ({
      ...feature,
      ...(feature?.properties && {
        properties: {
          ...feature.properties,
          ...(startTime && { [startTime]: getUTCDate(feature.properties[startTime]).getTime() }),
          ...(endTime && { [endTime]: getUTCDate(feature.properties[endTime]).getTime() }),
        },
      }),
    })),
  } as FeatureCollection
}
