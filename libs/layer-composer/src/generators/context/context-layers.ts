import type {
  FillLayerSpecification,
  LayerSpecification,
  LineLayerSpecification,
  SymbolLayerSpecification,
} from '@globalfishingwatch/maplibre-gl'
import { ExtendedLayerMeta, Group } from '../../types'
import { ContextLayerType } from '../types'
import { DEFAULT_BACKGROUND_COLOR } from '../background/config'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from './config'

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
      sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER,
    } as ExtendedLayerMeta,
  }
}

const getDefaultContextLine = (color = 'white'): Partial<LineLayerSpecification> => {
  return {
    type: 'line',
    paint: {
      'line-color': color,
      'line-opacity': 1,
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    metadata: {
      interactive: false,
      group: Group.OutlinePolygons,
      sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER,
    } as ExtendedLayerMeta,
  }
}

const getDefaultContextLineLabels = (): Partial<SymbolLayerSpecification> => {
  return {
    type: 'symbol',
    layout: {
      'symbol-placement': 'line',
      'text-font': ['Roboto Medium'],
      'text-field': ['get', 'display'],
      'text-size': 12,
    },
    paint: {
      'text-color': '#fff',
      // 'text-opacity': ['interpolate', ['linear'], ['zoom'], 2, 0.3, 3, 0],
    },
    metadata: {
      interactive: false,
      group: Group.OutlinePolygons,
      sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER,
    } as ExtendedLayerMeta,
  }
}

const getDefaultContextHighlight = (): Partial<LineLayerSpecification> => {
  return {
    type: 'line',
    paint: {
      'line-color': 'transparent',
      'line-opacity': 1,
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    metadata: {
      interactive: false,
      group: Group.OutlinePolygonsHighlighted,
      sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER,
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
        'line-opacity': 1,
      },
    } as LineLayerSpecification,
  ],
  [ContextLayerType.Graticules]: [
    {
      id: 'graticules_30',
      ...getDefaultContextLine(),
      filter: ['match', ['get', 'scalerank'], 1, true, false],
      maxzoom: 3,
      paint: {
        'line-opacity': ['interpolate', ['linear'], ['zoom'], 2, 0.3, 3, 0],
      },
    } as LineLayerSpecification,
    {
      id: 'graticules_30_labels',
      ...getDefaultContextLineLabels(),
      source: 'context-layer-graticules__graticules-graticules',
      filter: ['match', ['get', 'scalerank'], 1, true, false],
      maxzoom: 3,
      paint: {
        'text-color': '#fff',
        'text-halo-color': DEFAULT_BACKGROUND_COLOR,
        'text-opacity': ['interpolate', ['linear'], ['zoom'], 2, 0.3, 3, 0],
      },
    } as SymbolLayerSpecification,
    {
      id: 'graticules_10',
      ...getDefaultContextLine(),
      filter: ['match', ['get', 'scalerank'], 4, true, false],
      minzoom: 2,
      maxzoom: 5,
      paint: {
        'line-opacity': ['interpolate', ['linear'], ['zoom'], 2, 0, 3, 0.3, 4, 0.3, 5, 0],
      },
    } as LineLayerSpecification,
    {
      id: 'graticules_10_labels',
      ...getDefaultContextLineLabels(),
      source: 'context-layer-graticules__graticules-graticules',
      filter: ['match', ['get', 'scalerank'], 4, true, false],
      minzoom: 2,
      maxzoom: 5,
      paint: {
        'text-color': '#fff',
        'text-halo-color': DEFAULT_BACKGROUND_COLOR,
        'text-opacity': ['interpolate', ['linear'], ['zoom'], 2, 0, 3, 0.3, 4, 0.3, 5, 0],
      },
    } as SymbolLayerSpecification,
    {
      id: 'graticules_5',
      ...getDefaultContextLine(),
      filter: ['match', ['get', 'scalerank'], 5, true, false],
      minzoom: 4,
      maxzoom: 7,
      paint: {
        'line-opacity': ['interpolate', ['linear'], ['zoom'], 4, 0, 5, 0.3, 6, 0.3, 7, 0],
      },
    } as LineLayerSpecification,
    {
      id: 'graticules_5_labels',
      ...getDefaultContextLineLabels(),
      source: 'context-layer-graticules__graticules-graticules',
      filter: ['match', ['get', 'scalerank'], 5, true, false],
      minzoom: 4,
      maxzoom: 7,
      paint: {
        'text-color': '#fff',
        'text-halo-color': DEFAULT_BACKGROUND_COLOR,
        'text-opacity': ['interpolate', ['linear'], ['zoom'], 4, 0, 5, 0.3, 6, 0.3, 7, 0],
      },
    } as SymbolLayerSpecification,
    {
      id: 'graticules_1',
      ...getDefaultContextLine(),
      filter: ['match', ['get', 'scalerank'], 6, true, false],
      minzoom: 6,
      paint: {
        'line-opacity': ['interpolate', ['linear'], ['zoom'], 6, 0, 7, 0.3],
      },
    } as LineLayerSpecification,
    {
      id: 'graticules_1_labels',
      ...getDefaultContextLineLabels(),
      source: 'context-layer-graticules__graticules-graticules',
      filter: ['match', ['get', 'scalerank'], 6, true, false],
      minzoom: 6,
      paint: {
        'text-color': '#fff',
        'text-halo-color': DEFAULT_BACKGROUND_COLOR,
        'text-opacity': ['interpolate', ['linear'], ['zoom'], 6, 0, 7, 0.3],
      },
    } as SymbolLayerSpecification,
  ],
}

export default CONTEXT_LAYERS
