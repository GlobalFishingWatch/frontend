import { Type, GlGeneratorConfig } from '../types'

class GlStyleGenerator {
  type = Type.GL

  _getStyleSources = (layer: GlGeneratorConfig) => {
    return layer.sources.map((glSource: any) => ({ id: `${layer.id}`, ...glSource }))
  }

  _getStyleLayers = (layer: GlGeneratorConfig) => {
    const layout = {
      visibility: layer.visible !== undefined ? (layer.visible ? 'visible' : 'none') : 'visible',
    }
    return layer.layers.map((glLayer: any, i: number) => ({
      id: `${layer.id}-${i}`,
      source: layer.id,
      ...glLayer,
      layout: {
        ...layout,
        ...glLayer.layout,
      },
    }))
  }

  getStyle = (layer: GlGeneratorConfig) => {
    return {
      id: layer.id,
      // Auto generates sources and glLayers id using layer id when neccesary
      sources: this._getStyleSources(layer),
      layers: this._getStyleLayers(layer),
    }
  }
}

export default GlStyleGenerator
