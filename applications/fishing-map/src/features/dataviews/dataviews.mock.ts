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
        'public-chile-fishing-effort:v20200331',
        'public-indonesia-fishing-effort:v20200320',
        'public-panama-fishing-effort:v20200331',
        'public-peru-fishing-effort:v20200324',
      ],
      colorRamp: 'teal',
    },
    category: DataviewCategory.Fishing,
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
        datasetId: 'public-chile-fishing-effort:v20200331',
      },
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'public-indonesia-fishing-effort:v20200320',
      },
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'public-peru-fishing-effort:v20200324',
      },
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'public-panama-fishing-effort:v20200331',
      },
    ],
    createdAt: '2020-10-26T09:53:07.549Z',
    updatedAt: '2021-03-24T12:41:54.218Z',
  },
  {
    id: 2,
    name: 'Fishing presence',
    description: '',
    app: 'fishing-map',
    config: {
      type: 'HEATMAP_ANIMATED',
      color: '#00FFBC',
      datasets: ['public-global-presence:v20201001', 'public-panama-carrier-presence:v20200331'],
      interval: 'day',
      colorRamp: 'teal',
    },
    category: DataviewCategory.Presence,
    datasetsConfig: [
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'public-global-presence:v20201001',
      },
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'public-panama-carrier-presence:v20200331',
      },
    ],
    createdAt: '2021-02-08T15:27:48.243Z',
    updatedAt: '2021-04-26T15:50:04.016Z',
  },
]

export default dataviews
