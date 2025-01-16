import type { BasemapLabelsGeneratorConfig } from '../types';
import { BasemapType,GeneratorType } from '../types'

import { getLabelsTilesUrlByLocale, layers, sources } from './basemap-labels-layers'

class BasemapLabelsGenerator {
  type = GeneratorType.BasemapLabels

  _getStyleSources = (config: BasemapLabelsGeneratorConfig) => {
    const basemapLabelsSource = sources[BasemapType.Labels]
    basemapLabelsSource.tiles = [getLabelsTilesUrlByLocale(config.locale)]
    return [{ id: BasemapType.Labels, ...basemapLabelsSource }]
  }

  getStyle = (config: BasemapLabelsGeneratorConfig) => {
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: layers[BasemapType.Labels],
    }
  }
}

export default BasemapLabelsGenerator
