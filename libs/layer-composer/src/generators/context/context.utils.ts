import {
  LineLayerSpecification,
  FillLayerSpecification,
  CircleLayerSpecification,
} from '@globalfishingwatch/maplibre-gl'

export const DEFAULT_LINE_COLOR = 'white'
export const HIGHLIGHT_LINE_COLOR = 'white'
export const HIGHLIGHT_FILL_COLOR = 'rgba(0, 0, 0, 0.3)'

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
