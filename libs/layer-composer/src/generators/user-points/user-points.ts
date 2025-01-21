import type { CircleLayerSpecification,LayerSpecification } from '@globalfishingwatch/maplibre-gl'

import { API_GATEWAY } from '../../config'
import { Group } from '../../types'
import { isUrlAbsolute } from '../../utils'
import { DEFAULT_BACKGROUND_COLOR } from '../background/config'
import { DEFAULT_CONTEXT_MAX_ZOOM, DEFAULT_CONTEXT_SOURCE_LAYER } from '../context/config'
import { getCirclePaintWithFeatureState } from '../context/context.utils'
import type { GlobalUserPointsGeneratorConfig } from '../types';
import { GeneratorType } from '../types'
import { getCircleRadiusWithPointSizeProperty } from '../user-points/user-points.utils'
import { getFilterForUserPointsLayer } from '../utils'

class UserPointsGenerator {
  type = GeneratorType.UserPoints

  _getStyleSources = (config: GlobalUserPointsGeneratorConfig) => {
    const tilesUrl = isUrlAbsolute(config.tilesUrl)
      ? config.tilesUrl
      : API_GATEWAY + config.tilesUrl

    const url = new URL(tilesUrl.replace(/{{/g, '{').replace(/}}/g, '}'))
    const isUserContextLayer = tilesUrl.includes('user-context')
    const urlProperties = isUserContextLayer
      ? [
          ...Object.keys(config.filters || {}),
          config.startTimeFilterProperty || '',
          config.endTimeFilterProperty || '',
          config.circleRadiusProperty || '',
        ]
      : []

    if (config.filter && isUserContextLayer) {
      url.searchParams.set('filter', config.filter)
    }
    const properties = [...(config.valueProperties || []), ...urlProperties].filter((p) => !!p)
    if (properties.length) {
      properties.forEach((property, index) => {
        url.searchParams.set(`properties[${index}]`, property)
      })
    }

    return [
      {
        id: config.id,
        type: 'vector',
        promoteId: config.promoteId || 'gfw_id',
        maxzoom: config.maxzoom || DEFAULT_CONTEXT_MAX_ZOOM,
        tiles: [decodeURI(url.toString())],
      },
    ]
  }

  _getStyleLayers = (config: GlobalUserPointsGeneratorConfig): LayerSpecification[] => {
    const generatorId = config.id
    const baseLayer = {
      id: generatorId,
      source: config.id,
      'source-layer': DEFAULT_CONTEXT_SOURCE_LAYER,
    }
    const filters = getFilterForUserPointsLayer(config)
    const circleLayer: CircleLayerSpecification = {
      ...baseLayer,
      type: 'circle',
      paint: {
        'circle-stroke-color': DEFAULT_BACKGROUND_COLOR,
        'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 3, 0.1, 5, 0.5],
        'circle-stroke-opacity': 0.5,
        ...getCirclePaintWithFeatureState(config.color, 0.7),
        ...getCircleRadiusWithPointSizeProperty(config),
      },
      ...(filters && { filter: filters }),
      metadata: {
        color: config.color,
        interactive: !config.disableInteraction,
        valueProperties: config.valueProperties,
        generatorId,
        uniqueFeatureInteraction: true,
        datasetId: config.datasetId,
        legend: {
          ...config.metadata?.legend,
          group: Group.OutlinePolygonsHighlighted,
        },
      },
    }

    return [circleLayer]
  }

  getStyle = (config: GlobalUserPointsGeneratorConfig) => {
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default UserPointsGenerator
