import type { FillLayer, Layer, LineLayer } from '@globalfishingwatch/mapbox-gl'
import { Group } from '../../types'
import { ContextLayerType } from '../types'

export const HIGHLIGHT_SUFIX = '_highlight'

const settledBoundaries = [
  '200 NM',
  'Treaty',
  'Median line',
  'Joint regime',
  'Connection Line',
  'Unilateral claim (undisputed)',
]

const getDefaultContextInteraction = (): Partial<FillLayer> => {
  return {
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
  }
}

const getDefaultContextLine = (color = 'white'): Partial<LineLayer> => {
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
      group: Group.OutlinePolygons,
    },
  }
}

const getDefaultContextHighlight = (): Partial<LineLayer> => {
  return {
    type: 'line',
    paint: {
      'line-color': 'transparent',
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    metadata: {
      interactive: false,
      group: Group.OutlinePolygonsHighlighted,
    },
  }
}

const getDefaultContextLayersById = (id: string, color: string): (LineLayer | FillLayer)[] => {
  return [
    {
      id: `${id}_interaction`,
      ...getDefaultContextInteraction(),
    } as FillLayer,
    {
      id: `${id}_line`,
      ...getDefaultContextLine(color),
    } as LineLayer,
    {
      id: `${id}${HIGHLIGHT_SUFIX}`,
      ...getDefaultContextHighlight(),
    } as LineLayer,
  ]
}

const CONTEXT_LAYERS: Record<ContextLayerType, Layer[]> = {
  [ContextLayerType.MPA]: getDefaultContextLayersById(ContextLayerType.MPA, '#1AFF6B'),
  [ContextLayerType.MPANoTake]: getDefaultContextLayersById(ContextLayerType.MPANoTake, '#F4511F'),
  [ContextLayerType.MPARestricted]: getDefaultContextLayersById(
    ContextLayerType.MPARestricted,
    '#F09300'
  ),
  [ContextLayerType.WPPNRI]: getDefaultContextLayersById(ContextLayerType.WPPNRI, '#AD1457'),
  [ContextLayerType.HighSeas]: getDefaultContextLayersById(ContextLayerType.HighSeas, '#4184F4'),
  [ContextLayerType.TunaRfmo]: getDefaultContextLayersById(ContextLayerType.TunaRfmo, '#B39DDB'),
  [ContextLayerType.EEZ]: [
    {
      id: 'eez_interaction_',
      ...getDefaultContextInteraction(),
    } as FillLayer,
    {
      id: `eez${HIGHLIGHT_SUFIX}_`,
      ...getDefaultContextHighlight(),
    } as LineLayer,
  ],
  [ContextLayerType.EEZBoundaries]: [
    {
      id: 'eez_rest_lines_',
      ...getDefaultContextLine('#33B679'),
      filter: ['match', ['get', 'line_type'], settledBoundaries, true, false],
    } as LineLayer,
    {
      id: 'eez_special_lines_',
      ...getDefaultContextLine(),
      filter: ['match', ['get', 'line_type'], settledBoundaries, false, true],
      paint: {
        'line-color': '#33B679',
        'line-dasharray': [2, 4],
      },
    } as LineLayer,
  ],
}

export default CONTEXT_LAYERS
