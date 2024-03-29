import { Position } from 'geojson'
import {
  DRAW_DATASET_SOURCE,
  Dataset,
  DatasetCategory,
  DatasetConfiguration,
  DatasetTypes,
} from '@globalfishingwatch/api-types'
import type { DrawFeature, DrawPointPosition } from './MapDraw'

export const getCoordinatePrecisionRounded = (coordinate: Position): Position => {
  return coordinate.map((points) => Math.round(points * 100000) / 100000)
}

export const getDrawDatasetDefinition = (name: string): Partial<Dataset> => {
  return {
    name,
    type: DatasetTypes.UserContext,
    category: DatasetCategory.Context,
    subcategory: 'user',
    unit: 'NA',
    source: DRAW_DATASET_SOURCE,
    configuration: {
      propertyToInclude: 'draw_id',
      format: 'geojson',
      geometryType: 'polygons',
    } as DatasetConfiguration,
  }
}

export const getFileWithFeatures = (name: string, features: DrawFeature[]) => {
  const startingIndex = features.reduce((acc, feature) => {
    const featureIndex = feature.properties?.gfw_id
    return featureIndex && featureIndex > acc ? featureIndex : acc
  }, 1)
  return new File(
    [
      JSON.stringify({
        type: 'FeatureCollection',
        features: features.map((feature, index) => ({
          ...feature,
          properties: {
            ...(feature.properties || {}),
            gfw_id: feature.properties.gfw_id || startingIndex + index,
            draw_id: feature.properties.gfw_id || startingIndex + index,
          },
        })),
      }),
    ],
    `${name}.json`,
    {
      type: 'application/json',
    }
  )
}

export const removeFeaturePointByIndex = (
  feature: DrawFeature,
  coordinateIndex: number | undefined
): DrawFeature => {
  if (coordinateIndex === undefined) {
    return feature
  }
  return {
    ...feature,
    geometry: {
      ...feature.geometry,
      coordinates: feature.geometry.coordinates.map((coordinates) => {
        const coordinatesLength = coordinates.length - 1
        const isFirstCoordinate = coordinateIndex === 0
        const isLastCoordinate = coordinateIndex === coordinatesLength
        return coordinates
          .filter((point, index) => {
            return index !== coordinateIndex
          })
          .map((point, index, coordinates) => {
            if (isFirstCoordinate && index === coordinatesLength - 1) {
              return coordinates[1]
            } else if (isLastCoordinate && index === 0) {
              return coordinates[coordinatesLength - 1]
            }
            return point
          })
      }),
    },
  } as DrawFeature
}

export const updateFeaturePointByIndex = (
  feature: DrawFeature,
  coordinateIndex: number | undefined,
  pointPosition: DrawPointPosition
): DrawFeature => {
  if (coordinateIndex === undefined) {
    return feature
  }

  return {
    ...feature,
    geometry: {
      ...feature.geometry,
      coordinates: feature.geometry.coordinates.map((coordinates) => {
        const coordinatesLength = coordinates.length - 1
        const isFirstCoordinate = coordinateIndex === 0
        const isLastCoordinate = coordinateIndex === coordinatesLength
        return coordinates.map((point, index) => {
          if (
            index === coordinateIndex ||
            (isLastCoordinate && index === 0) ||
            (isFirstCoordinate && index === coordinatesLength)
          ) {
            return pointPosition
          }
          return point
        })
      }),
    },
  } as DrawFeature
}
