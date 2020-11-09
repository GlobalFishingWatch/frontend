import type { Layer } from 'mapbox-gl'
import { Group } from '../../types'
import { ContextLayerType } from '../types'

const settledBoundaries = [
  '200 NM',
  'Treaty',
  'Median line',
  'Joint regime',
  'Connection Line',
  'Unilateral claim (undisputed)',
]

const CONTEXT_LAYERS: Record<ContextLayerType, Layer[]> = {
  'eez-areas': [
    {
      id: 'eez-base',
      type: 'fill',
      paint: {
        'fill-color': 'transparent',
        'fill-outline-color': 'transparent',
      },
      layout: {},
      metadata: {
        interactive: true,
        group: Group.OutlinePolygonsBackground,
      },
    },
  ],
  'eez-boundaries': [
    {
      id: 'eez_rest_lines',
      type: 'line',
      filter: ['match', ['get', 'line_type'], settledBoundaries, true, false],
      layout: {},
      paint: {
        'line-color': '#93c96c',
      },
      metadata: {
        interactive: false,
        group: Group.OutlinePolygonsBackground,
      },
    },
    {
      id: 'eez_special_lines',
      type: 'line',
      filter: ['match', ['get', 'line_type'], settledBoundaries, false, true],
      layout: {},
      paint: {
        'line-color': '#93c96c',
        'line-dasharray': [2, 4],
      },
      metadata: {
        interactive: false,
        group: Group.OutlinePolygonsBackground,
      },
    },
  ],
}

export default CONTEXT_LAYERS
