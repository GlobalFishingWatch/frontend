import { ExtendedLayer, Group } from '../../../types'
import { HeatmapAnimatedCurrentsPOCGeneratorConfig, Type } from '../../types'
import { HEATMAP_MODE_LAYER_TYPE } from '../config'
import { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'

function getBaseLayers(
  config: GlobalHeatmapAnimatedGeneratorConfig | HeatmapAnimatedCurrentsPOCGeneratorConfig
): ExtendedLayer {
  return {
    id: '_',
    source: '_',
    'source-layer': 'temporalgrid',
    type: HEATMAP_MODE_LAYER_TYPE[config.mode] as any,
    metadata: {
      group: Group.Heatmap,
      generatorType: Type.HeatmapAnimatedCurrentsPOC,
      generatorId: config.id,
    },
  }
}

export default getBaseLayers
