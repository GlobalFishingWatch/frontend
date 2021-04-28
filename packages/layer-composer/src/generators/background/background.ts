import { Layer } from '@globalfishingwatch/mapbox-gl'
import { Group } from '../../types'
import { Type, BackgroundGeneratorConfig } from '../types'

export const DEFAULT_BACKGROUND_COLOR = 'rgb(0, 36, 87)'

class BackgroundGenerator {
  type = Type.Background

  _getStyleLayers = (config: BackgroundGeneratorConfig): Layer[] => [
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
