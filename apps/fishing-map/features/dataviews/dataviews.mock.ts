import { Dataview, DataviewCategory } from '@globalfishingwatch/api-types'

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
    },
    filtersConfig: {
      order: ['matched', 'flag', 'geartype'],
      incompatibility: {
        'proto-global-sar-presence_v2:v20210924': [
          {
            id: 'matched',
            value: false,
            disabled: ['flag', 'geartype'],
          },
        ],
      },
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
      {
        params: [],
        endpoint: 'temporal-context-geojson',
        datasetId: 'public-global-sar-footprints:v20210924',
      },
    ],
    createdAt: '2023-01-16T15:35:41.689Z',
    updatedAt: '2023-01-16T15:35:41.689Z',
  },
]

export default dataviews
