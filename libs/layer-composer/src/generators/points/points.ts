import type { CircleLayerSpecification } from '@globalfishingwatch/maplibre-gl'
import { Group } from '../../types'
import { isUrlAbsolute } from '../../utils'
import { API_GATEWAY } from '../../config'
import { GeneratorType, MergedGeneratorConfig, PointsGeneratorConfig } from '../types'
import { isConfigVisible } from '../utils'
import { DEFAULT_BACKGROUND_COLOR } from '../background/config'

const DEFAULT_COLOR = 'rgba(0, 193, 231, 1)'

export type GlobalPointsConfig = MergedGeneratorConfig<PointsGeneratorConfig>

class PointsGenerator {
  type = GeneratorType.Points

  _getStyleSources = (config: GlobalPointsConfig) => {
    if (!config.data && !config.url) {
      throw new Error(`Points layer should specify data or url ${config}`)
    }

    const data = config.url
      ? isUrlAbsolute(config.url)
        ? config.url
        : API_GATEWAY + config.url
      : config.data

    return [
      {
        id: config.id,
        type: 'geojson',
        data,
      },
    ]
  }

  _getStyleLayers = (config: GlobalPointsConfig): CircleLayerSpecification[] => {
    const paint: CircleLayerSpecification['paint'] = {
      'circle-color': config.color || DEFAULT_COLOR,
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 4, 8, 8],
      'circle-opacity': config.opacity || 1,
      'circle-stroke-width': 1,
      'circle-stroke-color': DEFAULT_BACKGROUND_COLOR,
    }

    const visibility = isConfigVisible(config)
    const layer: CircleLayerSpecification = {
      id: config.id,
      source: config.id,
      type: 'circle',
      layout: { visibility },
      paint,
      metadata: {
        group: Group.Point,
        interactive: true,
      },
    }
    return [layer]
  }

  getStyle = (config: GlobalPointsConfig) => {
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default PointsGenerator
