import { ExtendedLayer, Group } from '../../../types'
import { Type } from '../../types'
import { HEATMAP_MODE_LAYER_TYPE } from '../config'
import { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'

export default function (config: GlobalHeatmapAnimatedGeneratorConfig): ExtendedLayer {
  return {
    id: '_',
    source: '_',
    'source-layer': 'temporalgrid',
    type: HEATMAP_MODE_LAYER_TYPE[config.mode] as any,
    metadata: {
      group: Group.Heatmap,
      generatorType: Type.HeatmapAnimated,
      generatorId: config.id,
    },
  }
}
