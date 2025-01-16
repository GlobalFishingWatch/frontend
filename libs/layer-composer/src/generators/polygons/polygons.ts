import type {
  FillLayerSpecification,
  LineLayerSpecification,
} from '@globalfishingwatch/maplibre-gl'

import { API_GATEWAY } from '../../config'
import { Group } from '../../types'
import { isUrlAbsolute } from '../../utils'
import { getFillPaintWithFeatureState } from '../context/context.utils'
import type { MergedGeneratorConfig, PolygonsGeneratorConfig } from '../types';
import { GeneratorType } from '../types'
import { isConfigVisible } from '../utils'

const DEFAULT_COLOR = 'rgba(0, 193, 231, 1)'

export type GlobalPolygonsConfig = MergedGeneratorConfig<PolygonsGeneratorConfig>

class PolygonsGenerator {
  type = GeneratorType.Polygons

  _getStyleSources = (config: GlobalPolygonsConfig) => {
    if (!config.data && !config.url) {
      throw new Error(`Polygon layer should specify data or url ${config}`)
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
        promoteId: 'id',
        generateId: true,
      },
    ]
  }

  _getStyleLayers = (
    config: GlobalPolygonsConfig
  ): (LineLayerSpecification | FillLayerSpecification)[] => {
    const generatorId = config.id
    const baseLayer = {
      id: generatorId,
      source: config.id,
    }
    const interactive = config.metadata?.interactive

    const paint = {
      'line-color': config.color || DEFAULT_COLOR,
      'line-width': 1,
      'line-opacity': config.opacity || 1,
    }

    const visibility = isConfigVisible(config)
    const lineLayer: LineLayerSpecification = {
      ...baseLayer,
      type: 'line',
      layout: { visibility },
      paint,
      metadata: {
        group: config.group || Group.OutlinePolygons,
        ...(config.metadata || {}),
      },
    }

    if (!interactive) {
      return [lineLayer]
    }
    const interactionLayer: FillLayerSpecification = {
      ...baseLayer,
      id: `${generatorId}_interaction`,
      type: 'fill',
      paint: {
        'fill-outline-color': 'transparent',
        ...getFillPaintWithFeatureState('transparent'),
      },
      metadata: {
        interactive,
        generatorId: generatorId,
        group: config.group || Group.CustomLayer,
      },
    }
    return [lineLayer, interactionLayer]
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
