import { Type, UserContextGeneratorConfig } from '../types'
import { isUrlAbsolute } from '../../utils'
import { isConfigVisible } from '../utils'
import { API_GATEWAY } from '../../layer-composer'

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
    return [
      {
        id: generatorId,
        type: 'line',
        source: config.id,
        'source-layer': 'main',
        paint: {
          'line-color': config.color,
          'line-width': 1,
        },
        layout: {
          visibility: isConfigVisible(config),
        },
        metadata: {
          color: config.color,
          generatorId,
          legend: {
            type: 'solid',
            ...config.metadata?.legend,
          },
        },
      },
    ]
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
