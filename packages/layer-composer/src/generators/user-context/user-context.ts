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
    return [
      {
        id: `user-context-${config.id}`,
        type: 'line',
        source: config.id,
        'source-layer': config.sourceLayer,
        paint: {
          'line-color': config.color,
          'line-width': 1,
        },
        layout: {
          visibility: isConfigVisible(config),
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
