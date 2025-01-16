import type {
  CircleLayerSpecification,
  FillLayerSpecification,
  LayerSpecification,
  LineLayerSpecification,
} from '@globalfishingwatch/maplibre-gl'

import { API_GATEWAY } from '../../config'
import type { ExtendedLayerMeta } from '../../types'
import { isUrlAbsolute } from '../../utils'
import type { ContextGeneratorConfig } from '../types';
import { GeneratorType } from '../types'

import {
  DEFAULT_CONTEXT_MAX_ZOOM,
  DEFAULT_CONTEXT_PROMOTE_ID,
  DEFAULT_CONTEXT_SOURCE_LAYER,
} from './config'
import {
  DEFAULT_LINE_COLOR,
  getFillPaintWithFeatureState,
  getLinePaintWithFeatureState,
} from './context.utils'
import LAYERS, { HIGHLIGHT_SUFIX, INTERACTION_SUFIX } from './context-layers'

const getPaintPropertyByType = (layer: LayerSpecification, config: any) => {
  const opacity = config.opacity !== undefined ? config.opacity : 1
  if (layer.type === 'line') {
    const color = layer.id?.includes(HIGHLIGHT_SUFIX)
      ? 'transparent'
      : config.color ||
        (layer.paint as LineLayerSpecification['paint'])?.['line-color'] ||
        DEFAULT_LINE_COLOR
    const linePaint: LineLayerSpecification['paint'] = {
      ...layer.paint,
      ...getLinePaintWithFeatureState(color, opacity),
    }
    return linePaint
  } else if (layer.type === 'fill') {
    const fillColor =
      config.fillColor || (layer.paint as FillLayerSpecification['paint'])?.['fill-color']

    const fillPaint: FillLayerSpecification['paint'] = {
      ...layer.paint,
      ...getFillPaintWithFeatureState(fillColor, opacity),
    }
    return fillPaint
  } else if (layer.type === 'circle') {
    const circleColor = config.color || '#99eeff'
    const circleStrokeColor = config.strokeColor || 'hsla(190, 100%, 45%, 0.5)'
    const circleStrokeWidth = config.strokeWidth || 2
    const circleRadius = config.radius || 5
    const circlePaint: CircleLayerSpecification['paint'] = {
      ...layer.paint,
      'circle-color': circleColor,
      'circle-opacity': opacity,
      'circle-stroke-width': circleStrokeWidth,
      'circle-radius': circleRadius,
      'circle-stroke-color': circleStrokeColor,
    }
    return circlePaint
  } else if (layer.type === 'symbol') {
    return layer.paint
  }
  return {}
}

class ContextGenerator {
  type = GeneratorType.Context

  _getStyleSources = (config: ContextGeneratorConfig) => {
    if (!config.tilesUrl) {
      throw new Error(`Context layer should specify tilesUrl ${config}`)
    }
    const tilesUrl = isUrlAbsolute(config.tilesUrl)
      ? config.tilesUrl
      : API_GATEWAY + config.tilesUrl
    return [
      {
        id: config.id,
        type: 'vector',
        promoteId: config.promoteId || DEFAULT_CONTEXT_PROMOTE_ID,
        tiles: [tilesUrl.replace(/{{/g, '{').replace(/}}/g, '}')],
        maxzoom: config.maxzoom || DEFAULT_CONTEXT_MAX_ZOOM,
        ...(config.attribution && { attribution: config.attribution }),
      },
    ]
  }

  _getStyleLayers = (config: ContextGeneratorConfig): LayerSpecification[] => {
    const baseLayers = LAYERS[config.layer]
    if (!baseLayers?.length) {
      throw new Error(`Context layer should specify a valid layer parameter, ${config.layer}`)
    }
    let filters: any[] = []
    if (config?.filters) {
      filters = ['all']
      Object.entries(config.filters).forEach(([key, values]) => {
        filters.push(['match', ['to-string', ['get', key]], values, true, false])
      })
    }
    const color = config.color || DEFAULT_LINE_COLOR
    const layers = baseLayers.map((baseLayer) => {
      const paint = getPaintPropertyByType(baseLayer, config)
      return {
        ...baseLayer,
        id: baseLayer.id.includes(INTERACTION_SUFIX) ? config.id : baseLayer.id + config.id,
        source: config.id,
        'source-layer': DEFAULT_CONTEXT_SOURCE_LAYER,
        layout: {
          ...baseLayer.layout,
        },
        ...(filters.length > 0 && { filter: filters }),
        paint,
        metadata: {
          ...(baseLayer.metadata as ExtendedLayerMeta),
          color,
          layer: config.layer,
          generatorId: config.id,
          datasetId: config.datasetId,
          promoteId: config.promoteId || DEFAULT_CONTEXT_PROMOTE_ID,
          valueProperties: config.valueProperties,
        },
      }
    })

    return layers as LayerSpecification[]
  }

  getStyle = (config: ContextGeneratorConfig) => {
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default ContextGenerator
