import {
  LineLayerSpecification,
  FillLayerSpecification,
  CircleLayerSpecification,
} from '@globalfishingwatch/maplibre-gl'

export const DEFAULT_LINE_COLOR = 'white'
export const HIGHLIGHT_LINE_COLOR = 'white'
export const HIGHLIGHT_FILL_COLOR = 'rgba(0, 0, 0, 0.3)'
export const POINT_SIZES_DEFAULT_RANGE = [1, 10]

export const getLinePaintWithFeatureState = (
  color = DEFAULT_LINE_COLOR,
  opacity = 1
): LineLayerSpecification['paint'] => {
  return {
    'line-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      HIGHLIGHT_LINE_COLOR,
      ['boolean', ['feature-state', 'click'], false],
      HIGHLIGHT_LINE_COLOR,
      ['boolean', ['feature-state', 'highlight'], false],
      HIGHLIGHT_LINE_COLOR,
      color,
    ],
  }
}

export const getCirclePaintWithFeatureState = (
  color = DEFAULT_LINE_COLOR,
  opacity = 1
): CircleLayerSpecification['paint'] => {
  return {
    'circle-opacity': opacity,
    'circle-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      HIGHLIGHT_LINE_COLOR,
      ['boolean', ['feature-state', 'click'], false],
      HIGHLIGHT_LINE_COLOR,
      ['boolean', ['feature-state', 'highlight'], false],
      HIGHLIGHT_LINE_COLOR,
      color,
    ],
  }
}

export const getCircleRadiusWithPointSizeProperty = (
  property: string | undefined,
  range: number[] | undefined
): CircleLayerSpecification['paint'] => {
  // Check that no range value is undefined
  return property && range?.every((v) => v)
    ? {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', `${property}`],
          ...range.flatMap((b, i) => [b, POINT_SIZES_DEFAULT_RANGE[i]]),
        ],
      }
    : { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 2, 5, 4] }
}

export const getFillPaintWithFeatureState = (
  color = DEFAULT_LINE_COLOR,
  opacity = 1
): FillLayerSpecification['paint'] => {
  return {
    'fill-opacity': opacity,
    'fill-color': [
      'case',
      ['boolean', ['feature-state', 'click'], false],
      HIGHLIGHT_FILL_COLOR,
      ['boolean', ['feature-state', 'highlight'], false],
      HIGHLIGHT_FILL_COLOR,
      color,
    ],
  }
}
