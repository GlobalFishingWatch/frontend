import type {
  FillLayerSpecification,
  LayerSpecification,
  LineLayerSpecification,
} from '@globalfishingwatch/maplibre-gl'
import { ExtendedLayer, ExtendedLayerMeta, Group } from '../../types'
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

const getDefaultContextInteraction = (): Partial<FillLayerSpecification> => {
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
    } as ExtendedLayerMeta,
  }
}

const getDefaultContextLine = (color = 'white'): Partial<LineLayerSpecification> => {
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
    } as ExtendedLayerMeta,
  }
}

const getDefaultContextHighlight = (): Partial<LineLayerSpecification> => {
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
    } as ExtendedLayerMeta,
  }
}

const getDefaultContextLayersById = (
  id: string,
  color: string
): (LineLayerSpecification | FillLayerSpecification)[] => {
  return [
    {
      id: `${id}_interaction`,
      ...getDefaultContextInteraction(),
    } as FillLayerSpecification,
    {
      id: `${id}_line`,
      ...getDefaultContextLine(color),
    } as LineLayerSpecification,
    {
      id: `${id}${HIGHLIGHT_SUFIX}`,
      ...getDefaultContextHighlight(),
    } as LineLayerSpecification,
  ]
}

const CONTEXT_LAYERS: Record<ContextLayerType, LayerSpecification[]> = {
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
    } as FillLayerSpecification,
    {
      id: `eez${HIGHLIGHT_SUFIX}_`,
      ...getDefaultContextHighlight(),
    } as LineLayerSpecification,
  ],
  [ContextLayerType.EEZBoundaries]: [
    {
      id: 'eez_rest_lines_',
      ...getDefaultContextLine('#33B679'),
      filter: ['match', ['get', 'line_type'], settledBoundaries, true, false],
    } as LineLayerSpecification,
    {
      id: 'eez_special_lines_',
      ...getDefaultContextLine(),
      filter: ['match', ['get', 'line_type'], settledBoundaries, false, true],
      paint: {
        'line-color': '#33B679',
        'line-dasharray': [2, 4],
      },
    } as LineLayerSpecification,
  ],
}

export default CONTEXT_LAYERS
