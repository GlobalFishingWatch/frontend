import { Dataview, DataviewCategory } from '@globalfishingwatch/api-types'

export const dataviews: Dataview[] = [
  {
    id: 11111111,
    name: 'Vessel speed',
    slug: 'vessel-speed',
    app: 'fishing-map',
    config: {
      type: 'HEATMAP_ANIMATED',
      color: '#FFEA00',
      maxZoom: 6,
      colorRamp: 'yellow',
      intervals: ['MONTH', 'DAY'],
      aggregationOperation: 'avg',
    },
    datasetsConfig: [
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'public-global-presence-speed:v20231026',
      },
    ],
    description: 'Vessels speed in knots',
    createdAt: '2023-01-16T15:35:59.784Z',
    updatedAt: '2023-10-11T14:07:59.407Z',
    category: DataviewCategory.Environment,
  },
]

export default dataviews
