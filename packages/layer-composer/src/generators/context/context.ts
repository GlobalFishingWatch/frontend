import { Layer, CirclePaint, LinePaint, FillPaint } from 'mapbox-gl'
import { Type, ContextGeneratorConfig } from '../types'
import { isUrlAbsolute } from '../../utils'
import { isConfigVisible } from '../utils'
import { API_GATEWAY } from '../../layer-composer'
import LAYERS from './context-layers'

const DEFAULT_LINE_COLOR = 'white'
const HIGHLIGHT_LINE_COLOR = 'white'
const HIGHLIGHT_FILL_COLOR = 'rgba(0, 0, 0, 0.3)'
const DEFAULT_SOURCE_LAYER = 'main'

const getSourceId = (config: ContextGeneratorConfig) => {
  return `${config.id}-${config.layer}`
}

const getPaintPropertyByType = (layer: Layer, config: any) => {
  const opacity = config.opacity !== undefined ? config.opacity : 1
  if (layer.type === 'line') {
    const color = config.color || (layer.paint as LinePaint)?.['line-color'] || DEFAULT_LINE_COLOR
    const linePaint: LinePaint = {
      ...layer.paint,
      'line-opacity': opacity,
      'line-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        HIGHLIGHT_LINE_COLOR,
        color,
      ],
    }
    return linePaint
  } else if (layer.type === 'fill') {
    const fillColor = config.fillColor || (layer.paint as FillPaint)?.['fill-color']
    const fillOutlineColor =
      config.fillOutlineColor || (layer.paint as FillPaint)?.['fill-outline-color']

    const fillPaint: FillPaint = {
      ...layer.paint,
      'fill-opacity': opacity,
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'click'], false],
        HIGHLIGHT_FILL_COLOR,
        fillColor,
      ],
      'fill-outline-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        HIGHLIGHT_LINE_COLOR,
        ['boolean', ['feature-state', 'click'], false],
        HIGHLIGHT_LINE_COLOR,
        fillOutlineColor,
      ],
    }
    // if (hasSelectedFeatures) {
    //   const { field = 'id', values, fill = {} } = config.selectedFeatures
    //   const { color = fillColor, fillOutlineColor = config.color } = fill
    //   const matchFilter = ['match', ['get', field], values]
    //   paint['fill-color'] = [...matchFilter, color, fillColor]
    //   paint['fill-outline-color'] = [...matchFilter, fillOutlineColor, config.color]
    // }
    return fillPaint
  } else if (layer.type === 'circle') {
    const circleColor = config.color || '#99eeff'
    const circleStrokeColor = config.strokeColor || 'hsla(190, 100%, 45%, 0.5)'
    const circleStrokeWidth = config.strokeWidth || 2
    const circleRadius = config.radius || 5
    const circlePaint: CirclePaint = {
      ...layer.paint,
      'circle-color': circleColor,
      'circle-opacity': opacity,
      'circle-stroke-width': circleStrokeWidth,
      'circle-radius': circleRadius,
      'circle-stroke-color': circleStrokeColor,
    }

    // if (hasSelectedFeatures) {
    //   const { field = 'id', values, fallback = {} } = config.selectedFeatures
    //   const {
    //     color = 'rgba(50, 139, 169, 0.3)',
    //     opacity = 1,
    //     strokeColor = 'rgba(0,0,0,0)',
    //     strokeWidth = 0,
    //   } = fallback
    //   const matchFilter = ['match', ['get', field], values]
    //   paint[`circle-color`] = [...matchFilter, circleColor, color]
    //   paint['circle-opacity'] = [...matchFilter, circleOpacity, opacity]
    //   paint['circle-stroke-color'] = [...matchFilter, circleStrokeColor, strokeColor]
    //   paint['circle-stroke-width'] = [...matchFilter, circleStrokeWidth, strokeWidth]
    // }
    return circlePaint
  }
}

class ContextGenerator {
  type = Type.Context

  _getStyleSources = (config: ContextGeneratorConfig) => {
    if (!config.tilesUrl) {
      throw new Error(`Context layer should specify tilesUrl ${config}`)
    }
    const tilesUrl = isUrlAbsolute(config.tilesUrl)
      ? config.tilesUrl
      : API_GATEWAY + config.tilesUrl
    return [
      {
        id: getSourceId(config),
        type: 'vector',
        promoteId: 'gfw_id',
        tiles: [tilesUrl.replace(/{{/g, '{').replace(/}}/g, '}')],
      },
    ]
  }

  _getStyleLayers = (config: ContextGeneratorConfig) => {
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
        source: getSourceId(config),
        'source-layer': DEFAULT_SOURCE_LAYER,
        layout: {
          ...baseLayer.layout,
          visibility: isConfigVisible(config),
        },
        paint,
        metadata: {
          ...baseLayer.metadata,
          layer: config.layer,
          color,
          generatorId: config.id,
        },
      }
    })

    return layers
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
