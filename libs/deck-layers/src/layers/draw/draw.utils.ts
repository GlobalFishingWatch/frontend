import { FeatureCollection, Position } from '@deck.gl-community/editable-layers'
import { Feature, Point, Polygon } from 'geojson'

type UpdateFeatureCoordinateParams = {
  featureIndex: number | undefined
  coordinateIndex: number | undefined
  pointPosition: Position
}

function updateFeaturePointByIndex(
  feature: Feature<Polygon> | Feature<Point>,
  {
    coordinateIndex,
    pointPosition,
  }: Pick<UpdateFeatureCoordinateParams, 'coordinateIndex' | 'pointPosition'>
): Feature {
  if (feature.geometry?.type === 'Point') {
    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: pointPosition,
      },
    }
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
  }
}

export const updateFeatureCoordinateByIndex = (
  features: FeatureCollection['features'],
  { featureIndex, coordinateIndex, pointPosition }: UpdateFeatureCoordinateParams
): FeatureCollection['features'] => {
  if (featureIndex === undefined || coordinateIndex === undefined) {
    return features as FeatureCollection['features']
  }
  return features.map((feature, index) => {
    if (index === featureIndex) {
      return updateFeaturePointByIndex(feature as Feature<Point> | Feature<Polygon>, {
        coordinateIndex,
        pointPosition,
      })
    }
    return feature
  }) as FeatureCollection['features']
}

export const removeFeaturePointByIndex = (
  feature: Feature<Polygon>,
  coordinateIndex: number | undefined
): Feature<Polygon> => {
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
  } as Feature<Polygon>
}
