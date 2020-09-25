import { Type, BasemapGeneratorConfig, BasemapType } from '../types'
import { layers, sources } from './basemap-layers'

const DEFAULT_CONFIG: Partial<BasemapGeneratorConfig> = {
  basemap: BasemapType.Default,
}

class BasemapGenerator {
  type = Type.Basemap

  _getStyleSources = (config: BasemapGeneratorConfig) => {
    const sourcesForBasemap = sources[config.basemap]
    const styleSources = Object.keys(sourcesForBasemap).map((sourceId) => {
      const source = sourcesForBasemap[sourceId]
      return { id: sourceId, ...source }
    })
    return styleSources
  }
  _getStyleLayers = (config: BasemapGeneratorConfig) => {
    return layers[config.basemap]
  }

  getStyle = (config: BasemapGeneratorConfig) => {
    const finalConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    return {
      id: config.id,
      sources: this._getStyleSources(finalConfig),
      layers: this._getStyleLayers(finalConfig),
    }
  }
}

export default BasemapGenerator
