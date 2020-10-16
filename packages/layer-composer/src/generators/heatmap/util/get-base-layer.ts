import { ExtendedLayer, Group } from '../../../types'
import { Type } from '../../types'
import { HEATMAP_GEOM_TYPES_GL_TYPES } from '../config'
import { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'

export default function (config: GlobalHeatmapAnimatedGeneratorConfig): ExtendedLayer {
  return {
    id: '_',
    source: '_',
    'source-layer': 'temporalgrid',
    type: HEATMAP_GEOM_TYPES_GL_TYPES[config.geomType],
    metadata: {
      group: Group.Heatmap,
      generatorType: Type.HeatmapAnimated,
      generatorId: config.id,
    },
  }
}
