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

const getDefaultContexInteraction = (): Partial<Layer> => {
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

const getDefaultContexLine = (color: string): Partial<Layer> => {
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

const getDefaultContexLayersById = (id: string, color: string): Layer[] => {
  return [
    {
      id: `${id}-interaction`,
      ...getDefaultContexInteraction(),
    },
    {
      id: `${id}-line`,
      ...getDefaultContexLine(color),
    },
  ]
}

const CONTEXT_LAYERS: Record<ContextLayerType, Layer[]> = {
  mpa: getDefaultContexLayersById('mpa', '#e5777c'),
  'wpp-nri': getDefaultContexLayersById('wpp-nri', '#AD1457'),
  'tuna-rfmo': getDefaultContexLayersById('tuna-rfmo', '#B39DDB'),
  'eez-areas': [
    {
      id: 'eez-base',
      ...getDefaultContexInteraction(),
    },
  ],
  'eez-boundaries': [
    {
      id: 'eez_rest_lines',
      ...getDefaultContexLine('#33B679'),
      filter: ['match', ['get', 'line_type'], settledBoundaries, true, false],
    },
    {
      id: 'eez_special_lines',
      ...getDefaultContexLine('#33B679'),
      filter: ['match', ['get', 'line_type'], settledBoundaries, true, false],
    },
  ],
}

export default CONTEXT_LAYERS
