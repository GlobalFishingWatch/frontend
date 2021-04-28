import zip from 'lodash/zip'
import flatten from 'lodash/flatten'
import type { AnyLayer, FillLayer, LineLayer, Expression } from '@globalfishingwatch/mapbox-gl'
import { Type, UserContextGeneratorConfig } from '../types'
import { isUrlAbsolute } from '../../utils'
import { Group } from '../../types'
import { API_GATEWAY } from '../../layer-composer'
import { DEFAULT_CONTEXT_SOURCE_LAYER, HEATMAP_COLOR_RAMPS } from '..'
import {
  getFillPaintWithFeatureState,
  getLinePaintWithFeatureState,
} from '../context/context.utils'

class UserContextGenerator {
  type = Type.UserContext

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

    if (config.steps?.length && config.colorRamp) {
      const originalColorRamp = HEATMAP_COLOR_RAMPS[config.colorRamp]
      const legendRamp = zip(config.steps, originalColorRamp)
      const valueExpression = ['to-number', ['get', config.pickValueAt || 'value']]
      const colorRamp = [
        'interpolate',
        ['linear'],
        valueExpression,
        ...flatten(legendRamp),
      ] as Expression
      const stepsLayer: FillLayer = {
        ...baseLayer,
        type: 'fill' as const,
        paint: {
          'fill-outline-color': 'transparent',
          'fill-color': colorRamp,
        },
        metadata: {
          color: config.color,
          interactive: true,
          generatorId,
          uniqueFeatureInteraction: true,
          legend: {
            type: 'colorramp',
            ...config.metadata?.legend,
            ramp: legendRamp,
          },
        },
      }
      return [stepsLayer]
    }

    const lineLayer: LineLayer = {
      ...baseLayer,
      type: 'line',
      paint: {
        'line-width': 1,
        ...getLinePaintWithFeatureState(config.color),
      },
      metadata: {
        color: config.color,
        interactive: false,
        generatorId,
        legend: {
          type: 'solid',
          ...config.metadata?.legend,
          group: Group.OutlinePolygons,
        },
      },
    }

    const interactionLayer: FillLayer = {
      ...baseLayer,
      id: `${generatorId}_interaction`,
      type: 'fill',
      paint: {
        'fill-outline-color': 'transparent',
        ...getFillPaintWithFeatureState('transparent'),
      },
      metadata: {
        interactive: true,
        generatorId: generatorId,
        group: Group.OutlinePolygonsBackground,
      },
    }
    return [lineLayer, interactionLayer]
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
