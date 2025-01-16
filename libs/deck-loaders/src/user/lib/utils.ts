import type { FeatureCollection, LineString, MultiLineString,Position } from 'geojson'

import type { UserTrackFeature, UserTrackFeatureProperties, UserTrackRawData } from './types'

// Originally duplicated from data-transforms libs to avoid circular dependencies
// TODO define types for this filter so we can avoid the buggy isNumeric approach
// to extract when using min or max or the list of values
export type TrackCoordinatesPropertyFilter = {
  id: string
  min?: number
  max?: number
  values?: (string | number)[]
}

export type FilterTrackByCoordinatePropertiesParams = {
  filters: TrackCoordinatesPropertyFilter[]
  includeNonTemporalFeatures?: boolean
  includeCoordinateProperties?: string[]
}

type FilterTrackByCoordinatePropertiesArgs = Parameters<
  (data: FeatureCollection, params: FilterTrackByCoordinatePropertiesParams) => void
>

type FilterTrackByCoordinatePropertiesFn = (
  ...args: FilterTrackByCoordinatePropertiesArgs
) => UserTrackRawData

type LineCoordinateProperties = Record<string, (string | number)[]>
type MultiLineCoordinateProperties = Record<string, [(string | number)[]]>
type CoordinateProperties = LineCoordinateProperties | MultiLineCoordinateProperties
type CoordinatesAccumulator = {
  coordinates: Position[][]
  coordinateProperties: CoordinateProperties
}

type GetCoordinatePropertyValueParams = {
  coordinateProperties: CoordinateProperties
  coordinateIndex: number
  multiLineStringIndex?: number
  id: string
}
const getCoordinatePropertyValue = ({
  id,
  coordinateProperties,
  coordinateIndex,
  multiLineStringIndex,
}: GetCoordinatePropertyValueParams) => {
  return multiLineStringIndex !== undefined
    ? (coordinateProperties as MultiLineCoordinateProperties)?.[id][multiLineStringIndex]?.[
        coordinateIndex
      ]
    : (coordinateProperties as LineCoordinateProperties)?.[id]?.[coordinateIndex]
}

type AddPropertyIndexToCoordinateParams = {
  id: string
  coordinateIndex: number
  coordinateValue: string | number
  coordinates: CoordinatesAccumulator
}
const addCoordinatePropertyToCoordinate = ({
  id,
  coordinateIndex,
  coordinateValue,
  coordinates,
}: AddPropertyIndexToCoordinateParams) => {
  if (!coordinates.coordinateProperties[id]) {
    coordinates.coordinateProperties[id] = []
  }
  if (!coordinates.coordinateProperties[id][coordinateIndex]) {
    coordinates.coordinateProperties[id][coordinateIndex] = []
  }
  ;(coordinates.coordinateProperties as MultiLineCoordinateProperties)[id][coordinateIndex].push(
    coordinateValue
  )
}

type GetFilteredCoordinatesParams = {
  coordinates: Position[]
  filters: TrackCoordinatesPropertyFilter[]
  coordinateProperties: CoordinateProperties
  multiLineStringIndex?: number
  includeCoordinateProperties?: string[]
}
const getFilteredCoordinates = ({
  coordinates,
  filters,
  coordinateProperties,
  multiLineStringIndex,
  includeCoordinateProperties = [],
}: GetFilteredCoordinatesParams) => {
  let leadingPoint = true
  const filteredLines = coordinates.reduce(
    (filteredCoordinates, coordinate, index) => {
      const matchesPropertyFilters = filters.every(({ id, min, max, values }) => {
        const currentValue = getCoordinatePropertyValue({
          id,
          coordinateProperties,
          coordinateIndex: index,
          multiLineStringIndex,
        })
        if (currentValue === undefined) {
          // This means the property is not defined for this coordinate so we can't filter by it
          return true
        }
        if (min !== undefined && max !== undefined) {
          return (currentValue as number) >= min && (currentValue as number) <= max
        }
        return values?.includes(currentValue)
      })
      const coordinatesIndex = filteredCoordinates.coordinates.length
        ? filteredCoordinates.coordinates.length - 1
        : 0
      if (matchesPropertyFilters) {
        const properties = [...filters.map(({ id }) => id), ...includeCoordinateProperties]
        if (leadingPoint && index > 0) {
          leadingPoint = false
          const leadingIndex = index - 1
          const leadingCoordinatePoint = coordinates[leadingIndex]
          if (!filteredCoordinates.coordinates[coordinatesIndex]) {
            filteredCoordinates.coordinates[coordinatesIndex] = []
          }
          filteredCoordinates.coordinates[coordinatesIndex].push(leadingCoordinatePoint)
          properties.forEach((property) => {
            const leadingCoordinateValue = getCoordinatePropertyValue({
              id: property,
              coordinateProperties,
              coordinateIndex: leadingIndex,
              multiLineStringIndex,
            })
            addCoordinatePropertyToCoordinate({
              id: property,
              coordinates: filteredCoordinates,
              coordinateIndex: coordinatesIndex,
              coordinateValue: leadingCoordinateValue,
            })
          })
        }
        if (!filteredCoordinates.coordinates[coordinatesIndex]) {
          filteredCoordinates.coordinates[coordinatesIndex] = []
        }
        filteredCoordinates.coordinates[coordinatesIndex].push(coordinate)
        properties.forEach((property) => {
          const coordinateValue = getCoordinatePropertyValue({
            id: property,
            coordinateProperties,
            coordinateIndex: index,
            multiLineStringIndex,
          })
          addCoordinatePropertyToCoordinate({
            id: property,
            coordinates: filteredCoordinates,
            coordinateIndex: coordinatesIndex,
            coordinateValue,
          })
        })
      } else if (filteredCoordinates.coordinates[coordinatesIndex]?.length) {
        filteredCoordinates.coordinates.push([])
        leadingPoint = true
      }

      return filteredCoordinates
    },
    { coordinates: [], coordinateProperties: {} } as CoordinatesAccumulator
  )
  return filteredLines
}

const getFilteredLines = (
  feature: UserTrackFeature,
  filters: TrackCoordinatesPropertyFilter[],
  includeCoordinateProperties: string[] = []
) => {
  const isMultiLineString = feature.geometry.type === 'MultiLineString'
  const coordinateProperties = feature.properties?.coordinateProperties
  const lines = isMultiLineString
    ? (feature.geometry as MultiLineString).coordinates.map((coordinates, multiLineStringIndex) =>
        getFilteredCoordinates({
          coordinates,
          filters,
          coordinateProperties,
          multiLineStringIndex,
          includeCoordinateProperties,
        })
      )
    : [
        getFilteredCoordinates({
          coordinates: (feature.geometry as LineString).coordinates,
          filters,
          coordinateProperties,
          includeCoordinateProperties,
        }),
      ]
  return lines.filter((l) => l.coordinates.length)
}

export const filterTrackByCoordinateProperties: FilterTrackByCoordinatePropertiesFn = (
  geojson,
  {
    filters = [],
    includeNonTemporalFeatures = false,
    includeCoordinateProperties = [],
  } = {} as FilterTrackByCoordinatePropertiesParams
) => {
  if (!geojson || !geojson.features) {
    return {
      type: 'FeatureCollection',
      features: [],
    }
  }

  const featuresFiltered: UserTrackFeature[] = geojson.features.reduce(
    (filteredFeatures: UserTrackFeature[], feature) => {
      // TODO review if this check of other properties really works
      const hasValues = filters
        .map((p) => p.id)
        .some((id) => feature?.properties?.coordinateProperties?.[id]?.length > 0)
      if (hasValues) {
        const filteredLines = getFilteredLines(
          feature as UserTrackFeature,
          filters,
          includeCoordinateProperties
        )

        if (!filteredLines.length) {
          return filteredFeatures
        }

        const coordinateProperties = [
          ...filters.map(({ id }) => id),
          ...includeCoordinateProperties,
        ].reduce((acc, property) => {
          acc[property] = filteredLines.flatMap(
            (line) => (line.coordinateProperties as MultiLineCoordinateProperties)[property]
          )
          return acc
        }, {} as Record<string, (string | number)[][]>)

        filteredFeatures.push({
          type: 'Feature',
          geometry: {
            type: 'MultiLineString',
            coordinates: filteredLines.flatMap((line) => {
              if (!line.coordinates) {
                return []
              }
              return line.coordinates.filter((c) => c.length > 1)
            }),
          } as MultiLineString,
          properties: {
            ...feature.properties,
            coordinateProperties,
          } as UserTrackFeatureProperties,
        })
      } else if (includeNonTemporalFeatures) {
        filteredFeatures.push(feature as UserTrackFeature)
      }
      return filteredFeatures
    },
    []
  )
  const geojsonFiltered = {
    ...geojson,
    features: featuresFiltered,
  }
  return geojsonFiltered
}
