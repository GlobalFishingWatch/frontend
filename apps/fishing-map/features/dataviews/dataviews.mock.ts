import { Dataview, DataviewType, DataviewCategory } from '@globalfishingwatch/api-types'
import { GRATICULES_DATAVIEW_SLUG } from 'data/workspaces'

export const dataviews: Dataview[] = [
  {
    id: 9999191,
    name: 'Graticules',
    slug: GRATICULES_DATAVIEW_SLUG,
    app: 'fishing-map',
    category: DataviewCategory.Context,
    config: {
      type: DataviewType.Graticules,
      color: '#FCA26F',
      layers: [
        {
          id: 'graticules',
          dataset: 'public-graticules',
        },
      ],
    },
    datasetsConfig: [
      {
        query: [],
        params: [],
        endpoint: 'context-tiles',
        datasetId: 'public-graticules',
      },
    ],
    description: 'Graticules',
    createdAt: '2023-01-16T15:17:31.541Z',
    updatedAt: '2023-02-21T10:18:14.884Z',
  },
]

export default dataviews
