import { Dataview, DataviewCategory, GREATER_THAN_FILTER_ID } from '@globalfishingwatch/api-types'

export const dataviews: Dataview[] = [
  {
    id: 1456,
    name: 'SAR',
    slug: 'sar2',
    description: 'SAR',
    app: 'fishing-map',
    config: {
      type: 'HEATMAP_ANIMATED',
      color: '#9CA4FF',
      maxZoom: 12,
      datasets: ['proto-global-sar-presence_v2:v20210924'],
      colorRamp: 'lilac',
      filterOperators: {
        neural_value: GREATER_THAN_FILTER_ID,
      },
    },
    filtersConfig: {
      order: ['matched', 'flag', 'geartype', 'neural_value'],
      incompatibility: {},
    },
    category: DataviewCategory.Detections,
    datasetsConfig: [
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'proto-global-sar-presence_v2:v20210924',
      },
    ],
    createdAt: '2023-01-16T15:35:41.689Z',
    updatedAt: '2023-01-16T15:35:41.689Z',
  },
]

export default dataviews
