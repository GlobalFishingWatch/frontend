import { zip, flatten } from 'lodash'
import type { AnyLayer, FillLayer, Expression, CircleLayer } from '@globalfishingwatch/mapbox-gl'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '../context/context'
import { GeneratorType, UserContextGeneratorConfig } from '../types'
import { isUrlAbsolute } from '../../utils'
import { Group } from '../../types'
import { API_GATEWAY } from '../../config'
import { HEATMAP_COLOR_RAMPS } from '../heatmap/colors'
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

    const cirlceLayer: CircleLayer = {
      ...baseLayer,
      type: 'circle',
      paint: {
        'circle-radius': 5,
        ...getCirclePaintWithFeatureState(config.color),
      },
      metadata: {
        color: config.color,
        interactive,
        generatorId,
        legend: {
          type: 'solid',
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
