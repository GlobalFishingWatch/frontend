import { Dataview, DataviewCategory } from '@globalfishingwatch/api-types/dist'

export const dataviews: Dataview[] = [
  {
    id: 1,
    name: 'Apparent fishing effort',
    description: '',
    app: 'fishing-map',
    config: {
      type: 'HEATMAP_ANIMATED',
      color: '#00FFBC',
      datasets: [
        'public-global-fishing-effort:v20201001',
        'chile-fishing:v20200331',
        'indonesia-fishing:v20200320',
        'panama-fishing:v20200331',
        'peru-fishing:v20200324',
      ],
      colorRamp: 'teal',
    },
    infoConfig: undefined,
    category: DataviewCategory.Activity,
    datasetsConfig: [
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'public-global-fishing-effort:v20201001',
      },
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'chile-fishing:v20200331',
      },
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'indonesia-fishing:v20200320',
      },
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'peru-fishing:v20200324',
      },
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'panama-fishing:v20200331',
      },
    ],
    createdAt: '2020-10-26T09:53:07.549Z',
    updatedAt: '2021-02-18T18:13:24.970Z',
  },
]
export default dataviews
