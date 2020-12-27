import { Type, GlGeneratorConfig } from '../types'
import { isConfigVisible } from '../utils'

class GlStyleGenerator {
  type = Type.GL

  _getStyleSources = (config: GlGeneratorConfig) => {
    return config.sources?.map((glSource: any) => ({ id: `${config.id}`, ...glSource })) || []
  }

  _getStyleLayers = (config: GlGeneratorConfig) => {
    const layout = {
      visibility: isConfigVisible(config),
    }
    return (
      config.layers?.map((glLayer: any, i: number) => ({
        id: `${config.id}-${i}`,
        source: config.id,
        ...glLayer,
        layout: {
          ...layout,
          ...glLayer.layout,
        },
        metadata: glLayer.metadata || {},
      })) || []
    )
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
