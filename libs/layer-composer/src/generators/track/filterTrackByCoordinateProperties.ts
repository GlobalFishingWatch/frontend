import {
  FeatureCollection,
  Feature,
  Geometry,
  GeoJsonProperties,
  LineString,
  Position,
  MultiLineString,
} from 'geojson'
import { isEqual } from 'lodash'

export type TrackCoordinatesPropertyFilter = {
  id: string
  min?: number
  max?: number
  values?: (string | number)[]
}

export type FilterTrackByCoordinatePropertiesParams = {
  filters: TrackCoordinatesPropertyFilter[]
  includeNonTemporalFeatures?: boolean
}

type FilterTrackByCoordinatePropertiesArgs = Parameters<
  (data: FeatureCollection, params: FilterTrackByCoordinatePropertiesParams) => void
>

type FilterTrackByCoordinatePropertiesFn = (
  ...args: FilterTrackByCoordinatePropertiesArgs
) => FeatureCollection

// TODO TS types wont work with MultiPoint geoms
export const filterTrackByCoordinateProperties: FilterTrackByCoordinatePropertiesFn = (
  geojson,
  {
    filters = [],
    includeNonTemporalFeatures = false,
  } = {} as FilterTrackByCoordinatePropertiesParams
): FeatureCollection => {
  if (!geojson || !geojson.features)
    return {
      type: 'FeatureCollection',
      features: [],
    }
  let leadingPoint = true

  const featuresFiltered: Feature<Geometry, GeoJsonProperties>[] = geojson.features.reduce(
    (filteredFeatures: Feature<Geometry, GeoJsonProperties>[], feature) => {
      // TODO review if this check of other properties really works
      const hasValues = filters
        .map((p) => p.id)
        .some((id) => feature?.properties?.coordinateProperties?.[id]?.length > 0)
      if (hasValues) {
        const filteredLines = (feature.geometry as LineString).coordinates.reduce(
          (filteredCoordinates, coordinate, index) => {
            const matchesPropertyFilters = filters.every(({ id, min, max, values }) => {
              const currentValue: number = feature.properties?.coordinateProperties?.[id][index]
              if (min !== undefined && max !== undefined) {
                return currentValue >= min && currentValue <= max
              }
              if (values?.length) {
                return values.includes(currentValue)
              }
              return true
            })
            // TODO generate a new segment when false so we can cut by properties without generating non existing lines
            if (matchesPropertyFilters) {
              const coordinatesIndex = filteredCoordinates.coordinates.length
                ? filteredCoordinates.coordinates.length - 1
                : 0
              if (leadingPoint && index > 0) {
                leadingPoint = false
                const leadingIndex = index - 1
                const leadingCoordinatePoint = (feature.geometry as LineString).coordinates[
                  leadingIndex
                ]
                if (!filteredCoordinates.coordinates[coordinatesIndex]) {
                  filteredCoordinates.coordinates[coordinatesIndex] = []
                }
                filteredCoordinates.coordinates[coordinatesIndex].push(leadingCoordinatePoint)
                filters.forEach(({ id }) => {
                  const leadingCoordinateValue: string | number =
                    feature.properties?.coordinateProperties?.[id][leadingIndex]
                  if (!filteredCoordinates.coordinateProperties[id]) {
                    filteredCoordinates.coordinateProperties[id] = []
                  }
                  filteredCoordinates.coordinateProperties[id].push(leadingCoordinateValue)
                })
              }
              if (!filteredCoordinates.coordinates[coordinatesIndex]) {
                filteredCoordinates.coordinates[coordinatesIndex] = []
              }
              filteredCoordinates.coordinates[coordinatesIndex].push(coordinate)
              filters.forEach(({ id }) => {
                const coordinateValue: string | number =
                  feature.properties?.coordinateProperties?.[id][index]
                if (!filteredCoordinates.coordinateProperties[id]) {
                  filteredCoordinates.coordinateProperties[id] = []
                }
                filteredCoordinates.coordinateProperties[id].push(coordinateValue)
              })
            } else {
              filteredCoordinates.coordinates.push([])
            }

            return filteredCoordinates
          },
          {
            coordinates: [] as Position[][],
            coordinateProperties: {} as Record<string, (string | number)[]>,
          }
        )

        if (!filteredLines.coordinates.length) return filteredFeatures

        const geometry: MultiLineString = {
          type: 'MultiLineString',
          coordinates: filteredLines.coordinates.filter((c) => c.length > 1),
        }

        const properties: GeoJsonProperties = {
          ...feature.properties,
          coordinateProperties: filteredLines.coordinateProperties,
        }

        const filteredFeature: Feature = {
          ...feature,
          geometry,
          properties,
        }
        filteredFeatures.push(filteredFeature)
      } else if (includeNonTemporalFeatures) {
        filteredFeatures.push(feature)
      }
      return filteredFeatures
    },
    []
  )
  const geojsonFiltered: FeatureCollection = {
    ...geojson,
    features: featuresFiltered,
  }
  return geojsonFiltered
}

export const filterByTimerangeMemoizeEqualityCheck = (
  newArgs: FilterTrackByCoordinatePropertiesArgs,
  lastArgs: FilterTrackByCoordinatePropertiesArgs
) => {
  const newData = newArgs[0]
  const lastData = lastArgs[0]
  const newFilters = newArgs[1].filters
  const lastFilters = lastArgs[1].filters
  return newData.features.length === lastData.features.length && isEqual(newFilters, lastFilters)
}
