import type { LayerSpecification } from '@globalfishingwatch/maplibre-gl'

import { Group } from '../../types'
import type { BackgroundGeneratorConfig } from '../types';
import { GeneratorType } from '../types'

import { DEFAULT_BACKGROUND_COLOR } from './config'

class BackgroundGenerator {
  type = GeneratorType.Background

  _getStyleLayers = (config: BackgroundGeneratorConfig): LayerSpecification[] => [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': config.color || DEFAULT_BACKGROUND_COLOR,
      },
      metadata: {
        group: Group.Background,
      },
    },
  ]

  getStyle = (layer: BackgroundGeneratorConfig) => {
    return {
      id: layer.id,
      sources: [],
      layers: this._getStyleLayers(layer),
    }
  }
}

export default BackgroundGenerator
