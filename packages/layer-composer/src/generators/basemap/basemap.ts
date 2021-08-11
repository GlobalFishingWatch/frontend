import { Layer } from '@globalfishingwatch/mapbox-gl'
import { Type, BasemapGeneratorConfig, BasemapType } from '../types'
import { layers, sources } from './basemap-layers'

const DEFAULT_CONFIG: Partial<BasemapGeneratorConfig> = {
  basemap: BasemapType.Default,
  labels: false,
}

class BasemapGenerator {
  type = Type.Basemap

  _getStyleSources = (config: BasemapGeneratorConfig) => {
    const sourcesForBasemap = {
      ...sources[config.basemap],
      ...(config.labels ? sources[BasemapType.Labels] : {}),
    }
    const styleSources = Object.keys(sourcesForBasemap).map((sourceId) => {
      const source = sourcesForBasemap[sourceId]
      return { id: sourceId, ...source }
    })
    return styleSources
  }
  _getStyleLayers = (config: BasemapGeneratorConfig): Layer[] => {
    return [...layers[config.basemap], ...(config.labels ? layers[BasemapType.Labels] : [])]
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
