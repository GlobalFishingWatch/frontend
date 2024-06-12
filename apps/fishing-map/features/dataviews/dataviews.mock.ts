import { Dataview, DataviewCategory } from '@globalfishingwatch/api-types'
// import { GeneratorType, Group } from '@globalfishingwatch/layer-composer'
// import { TEMPLATE_HEATMAP_STATIC_DATAVIEW_SLUG } from 'data/workspaces'

export const dataviews: Dataview[] = [
  {
    app: 'fishing-map',
    category: DataviewCategory.Context,
    config: { type: 'USER_POINTS', color: '#fca26f' },
    createdAt: '2023-12-15T08:09:06.490Z',
    datasetsConfig: [
      {
        datasetId: 'public-fixed-infrastructure-v2',
        endpoint: 'context-tiles',
        query: [],
        params: [],
      },
    ],
    description: 'Fixed infrastructure v2',
    id: 387,
    name: 'Fixed infrastructure V2',
    slug: 'fixed-infrastructure-v2',
    updatedAt: '2023-12-15T10:20:12.087Z',
  },
]

export default dataviews
