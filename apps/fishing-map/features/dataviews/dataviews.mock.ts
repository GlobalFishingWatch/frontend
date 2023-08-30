import { Dataview, DataviewCategory, GREATER_THAN_FILTER_ID } from '@globalfishingwatch/api-types'

export const dataviews: Dataview[] = [
  {
    id: 998,
    name: 'sar',
    slug: 'sar-2',
    description: 'sar 2 test',
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
    createdAt: '2022-08-31T11:18:12.235Z',
    updatedAt: '2023-10-25T16:55:55.681Z',
  },
]

export default dataviews
