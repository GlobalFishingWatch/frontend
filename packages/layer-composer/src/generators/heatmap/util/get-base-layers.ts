import { ExtendedLayer, Group } from '../../../types'
import { Type } from '../../types'
import { HEATMAP_MODE_LAYER_TYPE } from '../config'
import {
  GlobalHeatmapAnimatedGeneratorConfig,
  TEMPORALGRID_SOURCE_LAYER,
  TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
} from '../heatmap-animated'

function getBaseLayer(config: GlobalHeatmapAnimatedGeneratorConfig): ExtendedLayer {
  return {
    id: '_',
    source: '_',
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
  config: GlobalHeatmapAnimatedGeneratorConfig
): ExtendedLayer {
  return {
    id: '_',
    source: '_',
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
  config: GlobalHeatmapAnimatedGeneratorConfig
): ExtendedLayer {
  return {
    id: '_',
    source: '_',
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

export default getBaseLayer
