import type { Feature, FeatureCollection, GeoJsonProperties, Point } from 'geojson'

import type { DatasetFilter, DatasetFilters } from '@globalfishingwatch/api-types'
import { getFlattenDatasetFilters } from '@globalfishingwatch/datasets-client'

import { parseCoords } from '../coordinates'
import { createCachedDateParser, getUTCDate } from '../dates'
import { normalizePropertiesKeys } from '../schema'
import type { PointColumns } from '../types'

const buildFilterLookup = (filters: DatasetFilters | undefined): Record<string, DatasetFilter> => {
  const flatFilters = getFlattenDatasetFilters(filters)
  return Object.fromEntries(flatFilters.map((filter) => [filter.id, filter])) as Record<
    string,
    DatasetFilter
  >
}

const applyFilterCoercions = (
  result: Record<string, any>,
  filterLookup: Record<string, DatasetFilter>
): Record<string, any> => {
  for (const property in result) {
    const propertySchema = filterLookup[property]
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

export const cleanProperties = (object: GeoJsonProperties, filters: DatasetFilters | undefined) => {
  const result = normalizePropertiesKeys(object)
  return applyFilterCoercions(result, buildFilterLookup(filters))
}

export const pointsListToGeojson = (
  data: Record<string, any>[],
  { latitude, longitude, id, startTime, endTime, filters, dateFormat }: PointColumns
) => {
  const parseDate = createCachedDateParser({ dateFormat })
  const filterLookup = buildFilterLookup(filters)
  let hasDatesError = false
  const features: Feature<Point>[] = []
  for (let index = 0; index < data.length; index++) {
    const cleanedPoint = normalizePropertiesKeys(data[index])
    if (!cleanedPoint[latitude] || !cleanedPoint[longitude]) continue
    const coords = parseCoords(cleanedPoint[latitude] as number, cleanedPoint[longitude] as number)
    if (!coords) continue

    const cleanedProperties = applyFilterCoercions(cleanedPoint, filterLookup)
    const startTimeMs = startTime
      ? parseDate(cleanedPoint[startTime] as string).getTime()
      : undefined
    if (startTimeMs !== undefined && isNaN(startTimeMs)) {
      hasDatesError = true
    }
    const endTimeMs = endTime ? parseDate(cleanedPoint[endTime] as string).getTime() : undefined
    if (endTimeMs !== undefined && isNaN(endTimeMs)) {
      hasDatesError = true
    }

    cleanedProperties.id = id && cleanedPoint[id] ? cleanedPoint[id] : index
    if (startTime) {
      cleanedProperties[startTime] = startTimeMs
    }
    if (endTime) {
      cleanedProperties[endTime] = endTimeMs
    }

    features.push({
      type: 'Feature',
      properties: cleanedProperties,
      geometry: {
        type: 'Point',
        coordinates: [coords.longitude, coords.latitude],
      },
    })
  }
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
