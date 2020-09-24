import zip from 'lodash/zip'
import flatten from 'lodash/flatten'
import { Type, UserContextGeneratorConfig } from '../types'
import { isUrlAbsolute } from '../../utils'
import { isConfigVisible } from '../utils'
import { API_GATEWAY } from '../../layer-composer'
import { HEATMAP_COLOR_RAMPS } from '..'

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
        tiles: [tilesUrl.replace(/{{/g, '{').replace(/}}/g, '}')],
      },
    ]
  }
  _getStyleLayers = (config: UserContextGeneratorConfig) => {
    const generatorId = `user-context-${config.id}`

    let paint: any = {
      'line-color': config.color,
      'line-width': 1,
    }
    let legendRamp
    if (config.steps?.length && config.colorRamp) {
      const originalColorRamp = HEATMAP_COLOR_RAMPS[config.colorRamp]
      legendRamp = zip(config.steps, originalColorRamp)
      const valueExpression = ['to-number', ['get', config.pickValueAt || 'value']]
      const colorRamp = ['interpolate', ['linear'], valueExpression, ...flatten(legendRamp)]
      paint = {
        'fill-outline-color': 'transparent',
        'fill-color': colorRamp,
      }
    }
    const baseStyle = {
      id: generatorId,
      type: config.steps ? 'fill' : 'line',
      source: config.id,
      'source-layer': 'main',
      paint,
      layout: {
        visibility: isConfigVisible(config),
      },
      metadata: {
        color: config.color,
        generatorId,
        legend: {
          type: config.steps ? 'colorramp' : 'solid',
          ...config.metadata?.legend,
          ...(legendRamp && {
            ramp: legendRamp,
          }),
        },
      },
    }
    return [baseStyle]
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
