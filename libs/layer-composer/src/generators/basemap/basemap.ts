import { LayerSpecification } from '@globalfishingwatch/maplibre-gl'
import { GeneratorType, BasemapGeneratorConfig, BasemapType } from '../types'
import { getLabelsTilesUrlByLocale, layers, sources } from './basemap-layers'

const DEFAULT_CONFIG: Partial<BasemapGeneratorConfig> = {
  basemap: BasemapType.Default,
  labels: false,
}

class BasemapGenerator {
  type = GeneratorType.Basemap

  _getStyleSources = (config: BasemapGeneratorConfig) => {
    let sourcesForBasemap = {
      ...sources[config.basemap],
    }
    if (config.labels) {
      const labelSources = sources[BasemapType.Labels]
      if (config.locale) {
        labelSources.labels.tiles = [getLabelsTilesUrlByLocale(config.locale)]
      }

      sourcesForBasemap = {
        ...sourcesForBasemap,
        ...labelSources,
      }
    }
    const styleSources = Object.keys(sourcesForBasemap).map((sourceId) => {
      const source = sourcesForBasemap[sourceId]
      return { id: sourceId, ...source }
    })
    return styleSources
  }

  _getStyleLayers = (config: BasemapGeneratorConfig): LayerSpecification[] => {
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
