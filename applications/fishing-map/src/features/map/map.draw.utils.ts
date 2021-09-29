import { RENDER_STATE, SHAPE } from 'react-map-gl-draw'
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

export type FeatureStyle = {
  feature: DrawFeature
  index: number
  state: RENDER_STATE
}

const CIRCLE_RADIUS = 8

const SELECTED_STYLE = {
  stroke: 'rgb(38, 181, 242)',
  strokeWidth: 2,
  fill: 'rgb(189,189,189)',
  fillOpacity: 0.3,
}

const HOVERED_STYLE = {
  stroke: 'rgb(38, 181, 242)',
  strokeWidth: 2,
  fill: 'rgb(122,202,67)',
  fillOpacity: 0.3,
}

const UNCOMMITTED_STYLE = {
  stroke: 'rgb(189,189,189)',
  strokeDasharray: '4,2',
  strokeWidth: 2,
  fill: 'rgb(189,189,189)',
  fillOpacity: 0.1,
}

const INACTIVE_STYLE = UNCOMMITTED_STYLE

const DEFAULT_STYLE = {
  stroke: '#000000',
  strokeWidth: 2,
  fill: '#a9a9a9',
  fillOpacity: 0.1,
}

export function featureStyle({ feature, state }: FeatureStyle) {
  const type = feature?.properties?.shape || feature.geometry.type
  let style: any = null

  switch (state) {
    case RENDER_STATE.SELECTED:
      style = { ...SELECTED_STYLE }
      break

    case RENDER_STATE.HOVERED:
      style = { ...HOVERED_STYLE }
      break

    case RENDER_STATE.UNCOMMITTED:
    case RENDER_STATE.CLOSING:
      style = { ...UNCOMMITTED_STYLE }
      break

    case RENDER_STATE.INACTIVE:
      style = { ...INACTIVE_STYLE }
      break

    default:
      style = { ...DEFAULT_STYLE }
  }

  switch (type) {
    case SHAPE.POINT:
      style.r = CIRCLE_RADIUS
      break
    case SHAPE.LINE_STRING:
      style.fill = 'none'
      break
    case SHAPE.POLYGON:
      if (state === RENDER_STATE.CLOSING) {
        style.strokeDasharray = '4,2'
      }

      break
    case SHAPE.RECTANGLE:
      if (state === RENDER_STATE.UNCOMMITTED) {
        style.strokeDasharray = '4,2'
      }

      break
    default:
  }

  return style
}
