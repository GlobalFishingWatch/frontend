import type { LineLayerSpecification } from '@globalfishingwatch/maplibre-gl'
import { Group } from '../../types'
import { GeneratorType, MergedGeneratorConfig, PolygonsGeneratorConfig } from '../types'
import { isConfigVisible } from '../utils'

const DEFAULT_COLOR = 'rgba(0, 193, 231, 1)'

export type GlobalPolygonsConfig = MergedGeneratorConfig<PolygonsGeneratorConfig>

class PolygonsGenerator {
  type = GeneratorType.Polygons

  _getStyleSources = (config: GlobalPolygonsConfig) => {
    if (!config.data) {
      throw new Error(`Polygon layer should specify data ${config}`)
    }

    return [
      {
        id: config.id,
        type: 'geojson',
        data: config.data,
      },
    ]
  }

  _getStyleLayers = (config: GlobalPolygonsConfig): LineLayerSpecification[] => {
    const paint = {
      'line-color': config.color || DEFAULT_COLOR,
      'line-width': 0.5,
      'line-opacity': config.opacity || 1,
    }

    const visibility = isConfigVisible(config)
    const layer: LineLayerSpecification = {
      id: config.id,
      source: config.id,
      type: 'line',
      layout: { visibility },
      paint,
      metadata: {
        group: Group.Track,
      },
    }
    return [layer]
  }

  getStyle = (config: GlobalPolygonsConfig) => {
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default PolygonsGenerator
