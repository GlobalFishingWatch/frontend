import type { CircleLayerSpecification } from '@globalfishingwatch/maplibre-gl'

import type { GlobalUserPointsGeneratorConfig } from '../../generators/types'

import { POINT_SIZES_DEFAULT_RANGE } from './config'

export const getCircleRadiusWithPointSizeProperty = (
  config: GlobalUserPointsGeneratorConfig
): CircleLayerSpecification['paint'] => {
  const { circleRadiusProperty, circleRadiusRange, minPointSize, maxPointSize } = config
  const sizes =
    minPointSize && maxPointSize ? [minPointSize, maxPointSize] : POINT_SIZES_DEFAULT_RANGE
  // Check that no range value is undefined
  return circleRadiusProperty && circleRadiusRange?.every((v: number) => v)
    ? {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', `${circleRadiusProperty}`],
          ...circleRadiusRange.flatMap((b: number, i: number) => [b, sizes[i]]),
        ],
      }
    : { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 2, 5, 4] }
}
