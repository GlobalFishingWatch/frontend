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

const getDefaultContextInteraction = (): Partial<Layer> => {
  return {
    type: 'fill',
    paint: {
      'fill-color': 'transparent',
      'fill-outline-color': 'transparent',
    },
    layout: {},
    metadata: {
      interactive: true,
      group: Group.OutlinePolygons,
    },
  }
}

const getDefaultContextLine = (color = 'white'): Partial<Layer> => {
  return {
    type: 'line',
    paint: {
      'line-color': color,
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    metadata: {
      interactive: false,
      group: Group.OutlinePolygonsBackground,
    },
  }
}

const getDefaultContextLayersById = (id: string, color: string): Layer[] => {
  return [
    {
      id: `${id}-interaction`,
      ...getDefaultContextInteraction(),
    },
    {
      id: `${id}-line`,
      ...getDefaultContextLine(color),
    },
  ]
}

const CONTEXT_LAYERS: Record<ContextLayerType, Layer[]> = {
  mpa: getDefaultContextLayersById('mpa', '#e5777c'),
  'wpp-nri': getDefaultContextLayersById('wpp-nri', '#AD1457'),
  'tuna-rfmo': getDefaultContextLayersById('tuna-rfmo', '#B39DDB'),
  'eez-areas': [
    {
      id: 'eez-base',
      ...getDefaultContextInteraction(),
    },
  ],
  'eez-boundaries': [
    {
      id: 'eez_rest_lines',
      ...getDefaultContextLine('#33B679'),
      filter: ['match', ['get', 'line_type'], settledBoundaries, true, false],
    },
    {
      id: 'eez_special_lines',
      ...getDefaultContextLine(),
      filter: ['match', ['get', 'line_type'], settledBoundaries, false, true],
      paint: {
        'line-color': '#33B679',
        'line-dasharray': [2, 4],
      },
    },
  ],
}

export default CONTEXT_LAYERS
