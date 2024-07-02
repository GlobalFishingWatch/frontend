import { Feature, FeatureCollection, GeoJsonProperties, Point } from 'geojson'
import { snakeCase } from 'lodash'
import { DatasetSchema, DatasetSchemaItem } from '@globalfishingwatch/api-types'
import { PointColumns } from '../types'
import { parseCoords } from '../coordinates'
import { getUTCDate } from '../list-to-track-segments'

const normalizePropertiesKeys = (object: Record<string, unknown> | null) => {
  return Object.entries(object || {}).reduce((acc, [key, value]) => {
    acc[snakeCase(key)] = value
    return acc
  }, {} as Record<string, unknown>)
}

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
  const features: Feature<Point>[] = data.flatMap((point, index) => {
    const cleanedPoint = normalizePropertiesKeys(point)
    if (!cleanedPoint[latitude] || !cleanedPoint[longitude]) return []
    const coords = parseCoords(cleanedPoint[latitude] as number, cleanedPoint[longitude] as number)
    if (coords) {
      const cleanedProperties = cleanProperties(cleanedPoint, schema)
      return {
        type: 'Feature',
        properties: {
          ...cleanedProperties,
          ...(startTime && {
            [startTime]: getUTCDate(cleanedPoint[startTime] as string).getTime(),
          }),
          ...(endTime && { [endTime]: getUTCDate(cleanedPoint[endTime] as string).getTime() }),
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
