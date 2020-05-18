import { Type, GeneratorConfig } from '../types'

import { layers, sources } from './basemap-layers'

class BasemapGenerator {
  type = Type.Basemap

  _getStyleSources = (config: GeneratorConfig) => {
    const layer = layers[config.id]
    const sourceId = layer.source as string
    const source = sources[sourceId]
    return [{ id: sourceId, ...source }]
  }
  _getStyleLayers = (config: GeneratorConfig) => {
    const layer = layers[config.id]
    return [layer]
  }

  getStyle = (config: GeneratorConfig) => {
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default BasemapGenerator
