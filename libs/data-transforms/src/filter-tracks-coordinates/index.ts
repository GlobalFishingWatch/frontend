import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  LineString,
  MultiLineString,
  Position,
} from 'geojson'
import isEqual from 'lodash/isEqual'

import { COORDINATE_PROPERTY_TIMESTAMP } from '../segments/segments-to-geojson'

import { isNumeric } from './utils'

export { isNumeric }

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
) => FilteredTrackData

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
}
const getFilteredCoordinates = ({
  coordinates,
  filters,
  coordinateProperties,
  multiLineStringIndex,
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
        if (leadingPoint && index > 0) {
          leadingPoint = false
          const leadingIndex = index - 1
          const leadingCoordinatePoint = coordinates[leadingIndex]
          if (!filteredCoordinates.coordinates[coordinatesIndex]) {
            filteredCoordinates.coordinates[coordinatesIndex] = []
          }
          filteredCoordinates.coordinates[coordinatesIndex].push(leadingCoordinatePoint)
          filters.forEach(({ id }) => {
            const leadingCoordinateValue = getCoordinatePropertyValue({
              id,
              coordinateProperties,
              coordinateIndex: leadingIndex,
              multiLineStringIndex,
            })
            addCoordinatePropertyToCoordinate({
              id,
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
        filters.forEach(({ id }) => {
          const coordinateValue = getCoordinatePropertyValue({
            id,
            coordinateProperties,
            coordinateIndex: index,
            multiLineStringIndex,
          })
          addCoordinatePropertyToCoordinate({
            id,
            coordinates: filteredCoordinates,
            coordinateIndex: coordinatesIndex,
            coordinateValue,
          })
        })
      } else if (filteredCoordinates.coordinates[coordinatesIndex]?.length) {
        filteredCoordinates.coordinates.push([])
      }

      return filteredCoordinates
    },
    { coordinates: [], coordinateProperties: {} } as CoordinatesAccumulator
  )
  return filteredLines
}

const getFilteredLines = (
  feature: Feature<Geometry, GeoJsonProperties>,
  filters: TrackCoordinatesPropertyFilter[]
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
        })
      )
    : [
        getFilteredCoordinates({
          coordinates: (feature.geometry as LineString).coordinates,
          filters,
          coordinateProperties,
        }),
      ]
  return lines.filter((l) => l.coordinates.length)
}

type FilteredTrackData = FeatureCollection<LineString | MultiLineString>
export const filterTrackByCoordinateProperties: FilterTrackByCoordinatePropertiesFn = (
  geojson,
  {
    filters = [],
    includeNonTemporalFeatures = false,
  } = {} as FilterTrackByCoordinatePropertiesParams
) => {
  if (!geojson || !geojson.features) {
    return {
      type: 'FeatureCollection',
      features: [],
    }
  }

  const featuresFiltered: Feature<LineString | MultiLineString, GeoJsonProperties>[] =
    geojson.features.reduce(
      (filteredFeatures: Feature<LineString | MultiLineString, GeoJsonProperties>[], feature) => {
        // TODO review if this check of other properties really works
        const hasValues = filters
          .map((p) => p.id)
          .some((id) => feature?.properties?.coordinateProperties?.[id]?.length > 0)
        if (hasValues) {
          const filteredLines = getFilteredLines(feature, filters)

          if (!filteredLines.length) {
            return filteredFeatures
          }

          const coordinateProperties = filters.reduce((acc, { id }) => {
            const properties = filteredLines.flatMap(
              (line) => (line.coordinateProperties as MultiLineCoordinateProperties)[id]
            )
            acc[id] = properties
            return acc
          }, {} as Record<string, (string | number)[][]>)

          filteredFeatures.push({
            type: 'Feature',
            geometry: {
              type: 'MultiLineString',
              coordinates: filteredLines.flatMap((line) => line.coordinates),
            } as MultiLineString,
            properties: {
              ...feature.properties,
              coordinateProperties,
            } as GeoJsonProperties,
          })
        } else if (includeNonTemporalFeatures) {
          filteredFeatures.push(feature as Feature<LineString | MultiLineString, GeoJsonProperties>)
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

export const getTrackFilters = (
  dataviewFilters: Record<string, (string | number)[]> | undefined
): TrackCoordinatesPropertyFilter[] => {
  if (!dataviewFilters) return []
  return Object.entries(dataviewFilters || {}).map(([id, values]) => {
    if (isNumeric(values[0]) && isNumeric(values[1])) {
      return {
        id,
        min: parseFloat(values[0] as string),
        max: parseFloat(values[1] as string),
      }
    }
    return { id, values }
  })
}

export const getTimeFilter = (start?: string, end?: string): TrackCoordinatesPropertyFilter[] => {
  if (!start || !end) {
    return []
  }
  return [
    {
      id: COORDINATE_PROPERTY_TIMESTAMP,
      min: new Date(start).getTime(),
      max: new Date(end).getTime(),
    },
  ]
}
