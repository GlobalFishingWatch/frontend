import {
  LayerSpecification,
  CircleLayerSpecification,
  LineLayerSpecification,
  FillLayerSpecification,
} from '@globalfishingwatch/maplibre-gl'
import { GeneratorType, ContextGeneratorConfig } from '../types'
import { ExtendedLayerMeta } from '../../types'
import { isUrlAbsolute } from '../../utils'
import { API_GATEWAY } from '../../config'
import LAYERS, { HIGHLIGHT_SUFIX } from './context-layers'
import {
  DEFAULT_LINE_COLOR,
  getContextSourceId,
  getFillPaintWithFeatureState,
  getLinePaintWithFeatureState,
} from './context.utils'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from './config'

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
        id: getContextSourceId(config),
        type: 'vector',
        promoteId: 'gfw_id',
        tiles: [tilesUrl.replace(/{{/g, '{').replace(/}}/g, '}')],
        ...(config.attribution && { attribution: config.attribution }),
      },
    ]
  }

  _getStyleLayers = (config: ContextGeneratorConfig): LayerSpecification[] => {
    const baseLayers = LAYERS[config.layer]
    if (!baseLayers?.length) {
      throw new Error(`Context layer should specify a valid layer parameter, ${config.layer}`)
    }

    const color = config.color || DEFAULT_LINE_COLOR
    const layers = baseLayers.map((baseLayer) => {
      const paint = getPaintPropertyByType(baseLayer, config)
      return {
        ...baseLayer,
        id: baseLayer.id + config.id,
        source: getContextSourceId(config),
        'source-layer': DEFAULT_CONTEXT_SOURCE_LAYER,
        layout: {
          ...baseLayer.layout,
        },
        paint,
        metadata: {
          ...(baseLayer.metadata as ExtendedLayerMeta),
          color,
          layer: config.layer,
          generatorId: config.id,
          datasetId: config.datasetId,
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
