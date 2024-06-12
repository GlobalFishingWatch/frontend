import { FeatureCollection, Position } from '@deck.gl-community/editable-layers'
import { Feature, Point, Polygon } from 'geojson'

function updateFeaturePointByIndex(
  feature: Feature<Polygon> | Feature<Point>,
  coordinateIndex: number,
  pointPosition: Position
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

export const updateFeaturePointByIndexex = (
  features: (Feature<Point> | Feature<Polygon>)[],

  featureIndex: number | undefined,
  coordinateIndex: number | undefined,
  pointPosition: Position
): FeatureCollection['features'] => {
  if (featureIndex === undefined || coordinateIndex === undefined) {
    return features as FeatureCollection['features']
  }
  return features.map((feature, index) => {
    if (index === featureIndex) {
      return updateFeaturePointByIndex(
        feature as Feature<Point> | Feature<Polygon>,
        coordinateIndex,
        pointPosition
      )
    }
    return feature
  }) as FeatureCollection['features']
}
