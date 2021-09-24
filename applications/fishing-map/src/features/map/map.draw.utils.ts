import {
  Dataset,
  DatasetCategory,
  DatasetConfiguration,
  DatasetTypes,
} from '@globalfishingwatch/api-types'
import { DrawFeature, DrawPointPosition } from './MapDraw'

export const getDrawDatasetDefinition = (name: string): Partial<Dataset> => {
  return {
    name,
    type: DatasetTypes.Context,
    category: DatasetCategory.Context,
    configuration: {
      format: 'geojson',
      geometryType: 'draw',
    } as DatasetConfiguration,
  }
}

export const getFileWithFeatures = (name: string, features: DrawFeature[]) => {
  return new File(
    [
      JSON.stringify({
        type: 'FeatureCollection',
        features: features,
      }),
    ],
    `${name}.json`,
    {
      type: 'application/json',
    }
  )
}

export const getFeaturesPrecisionRounded = (features: DrawFeature[]): DrawFeature[] => {
  return features.map(
    (feature) =>
      ({
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: feature.geometry.coordinates.map((coordinate) =>
            coordinate.map((points) => points.map((point) => Math.round(point * 100000) / 100000))
          ),
        },
      } as DrawFeature)
  )
}

export const updateFeaturePointByIndex = (
  features: DrawFeature[],
  featureIndex: number | undefined,
  coordinateIndex: number | undefined,
  pointPosition: DrawPointPosition
): DrawFeature[] => {
  if (featureIndex === undefined || coordinateIndex === undefined) {
    return features
  }
  return features?.map((feature, index) => {
    if (index !== featureIndex) {
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
  })
}
