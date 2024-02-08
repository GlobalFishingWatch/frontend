import { Feature, FeatureCollection, GeoJsonProperties, Point } from 'geojson'
import { DatasetSchema, DatasetSchemaItem } from '@globalfishingwatch/api-types'
import { PointColumns } from '../types'
import { parseCoords } from '../coordinates'
import { getUTCDate } from '../list-to-track-segments'

export const cleanProperties = (
  object: GeoJsonProperties,
  schema: Record<string, DatasetSchema | DatasetSchemaItem> | undefined
) => {
  const result = Object.entries(object || {}).reduce(
    (acc, [key, value]) => {
      if (acc) {
        acc[key.toLowerCase()] = value
      }
      return acc
    },
    {} as Record<string, any>
  )
  for (const property in result) {
    const propertySchema = schema?.[property]
    if (result[property] !== null) {
      if (propertySchema?.type === 'string') {
        result[property] = result[property].toString()
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
    if (!point[latitude] || !point[longitude]) return []
    const coords = parseCoords(point[latitude] as number, point[longitude] as number)
    if (coords) {
      const cleanedProperties = cleanProperties(point, schema)
      return {
        type: 'Feature',
        properties: {
          ...cleanedProperties,
          ...(startTime && { [startTime]: getUTCDate(point[startTime]).getTime() }),
          ...(endTime && { [endTime]: getUTCDate(point[endTime]).getTime() }),
          id: id && point[id] ? point[id] : index,
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
