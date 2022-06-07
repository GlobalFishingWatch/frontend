import { Dataview, DataviewCategory } from '@globalfishingwatch/api-types'

export const dataviews: Dataview[] = [
  {
    id: 91000,
    name: 'Apparent fishing effort',
    slug: null,
    description: '',
    app: 'fishing-map',
    config: {
      type: 'HEATMAP_ANIMATED',
      color: '#00FFBC',
      datasets: [
        'public-global-fishing-effort:v20201001',
        'public-belize-fishing-effort:v20220304',
        'public-chile-fishing-effort:v20211126',
        'public-costa-rica-fishing-effort:v20211126',
        'public-bra-onyxsat-fishing-effort:v20211126',
        'public-ecuador-fishing-effort:v20211126',
        'public-indonesia-fishing-effort:v20200320',
        'public-panama-fishing-effort:v20211126',
        'public-peru-fishing-effort:v20211126',
      ],
      colorRamp: 'teal',
    },
    infoConfig: null,
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
        datasetId: 'public-belize-fishing-effort:v20220304',
      },
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'public-chile-fishing-effort:v20211126',
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
        datasetId: 'public-peru-fishing-effort:v20211126',
      },
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'public-panama-fishing-effort:v20211126',
      },
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'public-ecuador-fishing-effort:v20211126',
      },
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'public-bra-onyxsat-fishing-effort:v20211126',
      },
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'public-costa-rica-fishing-effort:v20211126',
      },
    ],
    createdAt: '2020-10-26T09:53:07.549Z',
    updatedAt: '2022-03-22T16:49:50.506Z',
  },
  {
    id: 197000,
    name: 'VIIRS match',
    slug: null,
    description: '',
    app: 'fishing-map',
    config: {
      type: 'HEATMAP_ANIMATED',
      color: '#FFEA00',
      breaks: [],
      maxZoom: 12,
      datasets: ['public-ais-presence-viirs-match-prototype:v20220112'],
      colorRamp: 'yellow',
    },
    infoConfig: null,
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
        datasetId: 'public-ais-presence-viirs-match-prototype:v20220112',
      },
    ],
    createdAt: '2021-11-08T12:44:20.366Z',
    updatedAt: '2022-03-31T17:29:01.285Z',
  },
  {
    id: 124000,
    name: 'Vessel Presence',
    slug: null,
    description: '',
    app: 'fishing-map',
    config: {
      type: 'HEATMAP_ANIMATED',
      color: '#00FFBC',
      datasets: ['public-global-presence:v20201001'],
      interval: 'day',
      colorRamp: 'teal',
      presenceInteraction: 'detail',
    },
    infoConfig: null,
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
        datasetId: 'public-panama-presence:v20200331',
      },
    ],
    createdAt: '2021-02-08T15:27:48.243Z',
    updatedAt: '2021-10-06T11:02:58.571Z',
  },
  {
    id: 269000,
    name: 'SAR',
    slug: null,
    description: '',
    app: 'fishing-map',
    config: {
      type: 'HEATMAP_ANIMATED',
      color: '#9CA4FF',
      breaks: [],
      maxZoom: 12,
      datasets: ['public-global-sar-presence:v20210924'],
      colorRamp: 'lilac',
    },
    infoConfig: null,
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
        datasetId: 'public-global-sar-presence:v20210924',
      },
      {
        params: [],
        endpoint: 'temporal-context-geojson',
        datasetId: 'public-global-sar-footprints:v20210924',
      },
    ],
    createdAt: '2022-05-12T14:23:26.050Z',
    updatedAt: '2022-05-30T17:10:28.931Z',
  },
]

export default dataviews
