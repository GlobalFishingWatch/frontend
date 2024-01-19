import { Dataview, DataviewCategory } from '@globalfishingwatch/api-types'
import { GeneratorType, Group } from '@globalfishingwatch/layer-composer'
import { TEMPLATE_HEATMAP_STATIC_DATAVIEW_SLUG } from 'data/workspaces'

export const dataviews: Dataview[] = [
  {
    id: 33333333,
    name: 'Heatmap static dataview',
    slug: TEMPLATE_HEATMAP_STATIC_DATAVIEW_SLUG,
    description: 'Heatmap static dataview',
    app: 'fishing-map',
    config: {
      type: GeneratorType.HeatmapStatic,
      color: 'bathymetry',
      colorRamp: 'bathymetry',
      group: Group.Bathymetry,
    },
    category: DataviewCategory.Environment,
    createdAt: '2023-02-21T20:32:02.152Z',
    updatedAt: '2023-02-21T20:32:02.152Z',
  },
]

export default dataviews
