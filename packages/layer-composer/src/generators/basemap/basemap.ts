import { Type, BasemapGeneratorConfig } from '../types'
import { isConfigVisible } from '../utils'
import { layers, sources } from './basemap-layers'

class BasemapGenerator {
  type = Type.Basemap

  _getStyleSources = (config: BasemapGeneratorConfig) => {
    const layer = layers[config.basemap || config.id]
    const sourceId = layer.source as string
    const source = sources[sourceId]
    return [{ id: sourceId, ...source }]
  }
  _getStyleLayers = (config: BasemapGeneratorConfig) => {
    const layer = layers[config.basemap || config.id]
    return [
      {
        ...layer,
        layout: {
          visibility: isConfigVisible(config),
        },
      },
    ]
  }

  getStyle = (config: BasemapGeneratorConfig) => {
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default BasemapGenerator
