import type { GlGeneratorConfig } from '../types'
import { GeneratorType } from '../types'

class GlStyleGenerator {
  type = GeneratorType.GL

  _getStyleSources = (config: GlGeneratorConfig) => {
    return config.sources?.map((glSource: any) => ({ id: `${config.id}`, ...glSource })) || []
  }

  _getStyleLayers = (config: GlGeneratorConfig) => {
    return (
      config.layers?.map((glLayer: any, i: number) => ({
        id: `${config.id}-${i}`,
        source: config.id,
        ...glLayer,
        layout: {
          ...glLayer.layout,
        },
        metadata: { ...glLayer.metadata, generatorId: config.id },
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
