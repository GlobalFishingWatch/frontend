import { Type, UserContextGeneratorConfig } from '../types'
import { isUrlAbsolute } from '../../utils'
import { isConfigVisible } from '../utils'

const API_GATEWAY =
  process.env.API_GATEWAY ||
  process.env.REACT_APP_API_GATEWAY ||
  'https://gateway.api.dev.globalfishingwatch.org'

class UserContextGenerator {
  type = Type.UserContext

  _getStyleSources = (config: UserContextGeneratorConfig) => {
    const tiles = isUrlAbsolute(config.tilesUrl) ? config.tilesUrl : API_GATEWAY + config.tilesUrl
    return [
      {
        id: config.id,
        type: 'vector',
        tiles: [tiles.replace(/{{/g, '{').replace(/}}/g, '}')],
      },
    ]
  }
  _getStyleLayers = (config: UserContextGeneratorConfig) => {
    return [
      {
        id: `user-context-${config.id}`,
        type: 'line',
        source: config.id,
        'source-layer': config.id,
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
