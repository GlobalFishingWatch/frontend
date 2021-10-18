import { ExtendedLayer, Group } from '../../../types'
import { GeneratorType } from '../../types'
import { HEATMAP_MODE_LAYER_TYPE } from '../config'
import { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'

function getBaseLayers(config: GlobalHeatmapAnimatedGeneratorConfig): ExtendedLayer {
  return {
    id: '_',
    source: '_',
    'source-layer': 'temporalgrid',
    type: HEATMAP_MODE_LAYER_TYPE[config.mode] as any,
    metadata: {
      group: config.group || Group.Heatmap,
      generatorType: GeneratorType.HeatmapAnimated,
      generatorId: config.id,
    },
  }
}

export default getBaseLayers
