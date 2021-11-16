import type { AnyLayer, CircleLayer } from '@globalfishingwatch/mapbox-gl'
import { DEFAULT_BACKGROUND_COLOR } from '@globalfishingwatch/layer-composer'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '../context/context'
import { GeneratorType, UserContextGeneratorConfig } from '../types'
import { isUrlAbsolute } from '../../utils'
import { Group } from '../../types'
import { API_GATEWAY } from '../../config'
import { getCirclePaintWithFeatureState } from '../context/context.utils'

class UserContextGenerator {
  type = GeneratorType.UserContext

  _getStyleSources = (config: UserContextGeneratorConfig) => {
    const tilesUrl = isUrlAbsolute(config.tilesUrl)
      ? config.tilesUrl
      : API_GATEWAY + config.tilesUrl
    return [
      {
        id: config.id,
        type: 'vector',
        promoteId: 'gfw_id',
        tiles: [tilesUrl.replace(/{{/g, '{').replace(/}}/g, '}')],
      },
    ]
  }

  _getStyleLayers = (config: UserContextGeneratorConfig): AnyLayer[] => {
    const generatorId = config.id
    const baseLayer = {
      id: generatorId,
      source: config.id,
      'source-layer': DEFAULT_CONTEXT_SOURCE_LAYER,
    }

    const interactive = !config.disableInteraction

    // if (config.steps?.length && config.colorRamp) {
    //   const originalColorRamp = HEATMAP_COLOR_RAMPS[config.colorRamp]
    //   const legendRamp = zip(config.steps, originalColorRamp)
    //   const valueExpression = ['to-number', ['get', config.pickValueAt || 'value']]
    //   const colorRamp = [
    //     'interpolate',
    //     ['linear'],
    //     valueExpression,
    //     ...flatten(legendRamp),
    //   ] as Expression
    //   const stepsLayer: FillLayer = {
    //     ...baseLayer,
    //     type: 'fill' as const,
    //     paint: {
    //       'fill-outline-color': 'transparent',
    //       'fill-color': colorRamp,
    //     },
    //     metadata: {
    //       color: config.color,
    //       interactive,
    //       generatorId,
    //       group: Group.CustomLayer,
    //       uniqueFeatureInteraction: true,
    //       legend: {
    //         type: 'colorramp',
    //         ...config.metadata?.legend,
    //         ramp: legendRamp,
    //       },
    //     },
    //   }
    //   return [stepsLayer]
    // }

    const cirlceLayer: CircleLayer = {
      ...baseLayer,
      type: 'circle',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 1, 5, 5],
        'circle-stroke-color': DEFAULT_BACKGROUND_COLOR,
        'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 3, 0, 5, 1],
        ...getCirclePaintWithFeatureState(config.color),
      },
      metadata: {
        color: config.color,
        interactive,
        generatorId,
        uniqueFeatureInteraction: true,
        legend: {
          ...config.metadata?.legend,
          group: Group.OutlinePolygonsHighlighted,
        },
      },
    }

    return [cirlceLayer]
  }

  getStyle = (config: UserContextGeneratorConfig) => {
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default UserContextGenerator
