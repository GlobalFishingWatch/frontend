import type {
  DataDrivenPropertyValueSpecification,
  ExpressionSpecification,
  FillExtrusionLayerSpecification,
  FillLayerSpecification,
  FormattedSpecification,
  HeatmapLayerSpecification,
  LineLayerSpecification,
  SymbolLayerSpecification,
} from '@globalfishingwatch/maplibre-gl'

import type { ExtendedLayerMeta} from '../../../types';
import { Group } from '../../../types'
import { GeneratorType } from '../../types'
import {
  HEATMAP_MODE_LAYER_TYPE,
  TEMPORALGRID_SOURCE_LAYER,
  TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
} from '../config'
import type { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'
import type { GlobalHeatmapStaticGeneratorConfig } from '../heatmap-static'

function getBaseLayer(
  config: GlobalHeatmapAnimatedGeneratorConfig,
  id: string,
  source: string
): FillLayerSpecification | FillExtrusionLayerSpecification | HeatmapLayerSpecification {
  return {
    id,
    source,
    'source-layer': TEMPORALGRID_SOURCE_LAYER,
    type: HEATMAP_MODE_LAYER_TYPE[config.mode] as any,
    metadata: {
      group: config.group || Group.Heatmap,
      generatorType: GeneratorType.HeatmapAnimated,
      generatorId: config.id,
    } as ExtendedLayerMeta,
  }
}

export function getBaseInteractionLayer(
  config: GlobalHeatmapAnimatedGeneratorConfig,
  id: string,
  source: string
): FillLayerSpecification {
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
      generatorType: GeneratorType.HeatmapAnimated,
      generatorId: config.id,
      interactive: true,
      uniqueFeatureInteraction: true,
    } as ExtendedLayerMeta,
  }
}

export const hoverInteractionPaint = {
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
} as LineLayerSpecification['paint']

export function getBaseInteractionHoverLayer(
  config: GlobalHeatmapAnimatedGeneratorConfig | GlobalHeatmapStaticGeneratorConfig,
  id: string,
  source: string
): LineLayerSpecification {
  return {
    id,
    source,
    'source-layer': TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
    type: 'line',
    paint: hoverInteractionPaint,
    metadata: {
      interactive: false,
      group: config.group || Group.Heatmap,
    } as ExtendedLayerMeta,
  }
}

export function getBaseDebugLabelsLayer(
  exprPick: ExpressionSpecification,
  id: string,
  source: string
): SymbolLayerSpecification {
  const exprDebugText: DataDrivenPropertyValueSpecification<FormattedSpecification> = [
    'case',
    ['>', exprPick, 0],
    ['to-string', exprPick],
    '',
  ]
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
    } as SymbolLayerSpecification['layout'],
    paint: {
      'text-halo-color': 'hsl(320, 0%, 100%)',
      'text-halo-width': 2,
    },
    metadata: {
      group: Group.Label,
    } as ExtendedLayerMeta,
  }
}

export default getBaseLayer
