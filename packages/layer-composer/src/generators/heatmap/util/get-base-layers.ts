import { SymbolLayout, Expression } from '@globalfishingwatch/mapbox-gl'
import { ExtendedLayer, Group } from '../../../types'
import { Type } from '../../types'
import { HEATMAP_MODE_LAYER_TYPE } from '../config'
import {
  GlobalHeatmapAnimatedGeneratorConfig,
  TEMPORALGRID_SOURCE_LAYER,
  TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
} from '../heatmap-animated'

function getBaseLayer(
  config: GlobalHeatmapAnimatedGeneratorConfig,
  id: string,
  source: string
): ExtendedLayer {
  return {
    id,
    source,
    'source-layer': TEMPORALGRID_SOURCE_LAYER,
    type: HEATMAP_MODE_LAYER_TYPE[config.mode] as any,
    metadata: {
      group: config.group || Group.Heatmap,
      generatorType: Type.HeatmapAnimated,
      generatorId: config.id,
    },
  }
}

export function getBaseInteractionLayer(
  config: GlobalHeatmapAnimatedGeneratorConfig,
  id: string,
  source: string
): ExtendedLayer {
  return {
    id,
    source,
    'source-layer': TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
    type: 'fill',
    paint: {
      'fill-color': 'pink',
      'fill-opacity': config.debug ? 0.5 : 0,
    },
    metadata: {
      group: config.group || Group.Heatmap,
      generatorType: Type.HeatmapAnimated,
      generatorId: config.id,
      interactive: true,
      uniqueFeatureInteraction: true,
    },
  }
}

export function getBaseInteractionHoverLayer(
  config: GlobalHeatmapAnimatedGeneratorConfig,
  id: string,
  source: string
): ExtendedLayer {
  return {
    id,
    source,
    'source-layer': TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
    type: 'line',
    paint: {
      'line-color': 'white',
      'line-width': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        4,
        ['boolean', ['feature-state', 'click'], false],
        4,
        0,
      ],
      'line-offset': -2,
    },
    metadata: {
      interactive: false,
      group: config.group || Group.Heatmap,
    },
  }
}

export function getBaseDebugLabelsLayer(exprPick: Expression, id: string, source: string) {
  const exprDebugText = ['case', ['>', exprPick, 0], ['to-string', exprPick], '']
  return {
    id,
    source,
    type: 'symbol',
    'source-layer': TEMPORALGRID_SOURCE_LAYER,
    layout: {
      'text-field': exprDebugText,
      'text-font': ['Roboto Mono Light'],
      'text-size': 8,
      'text-allow-overlap': true,
    } as SymbolLayout,
    paint: {
      'text-halo-color': 'hsl(320, 0%, 100%)',
      'text-halo-width': 2,
    },
    metadata: {
      group: Group.Label,
    },
  }
}

export default getBaseLayer
