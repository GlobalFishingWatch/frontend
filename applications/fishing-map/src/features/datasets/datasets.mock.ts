import { Dataset } from '@globalfishingwatch/api-types/dist'

export const datasets: Dataset[] = [
  {
    alias: null,
    id: 'fd-water-temperature-palau',
    name: 'Water temperature Palau',
    type: '4wings-fd:v1',
    description: 'test',
    startDate: null,
    endDate: null,
    unit: '℃',
    status: 'done',
    importLogs: null,
    category: null,
    subcategory: null,
    source: null,
    ownerId: 46,
    ownerType: 'user',
    configuration: {
      folder: 'palau',
    },
    createdAt: '2021-02-18T10:42:26.637Z',
    relatedDatasets: null,
    schema: {},
    fieldsAllowed: [],
    endpoints: [
      {
        id: '4wings-fd-tiles',
        description: 'Endpoint to retrieve tiles from 4wings file database dataset',
        downloadable: false,
        method: 'GET',
        pathTemplate: '/v1/4wings-fd/tile/heatmap/{{z}}/{{x}}/{{y}}',
        params: [
          {
            label: 'Z',
            id: 'z',
            type: 'number',
          },
          {
            label: 'X',
            id: 'x',
            type: 'number',
          },
          {
            label: 'Y',
            id: 'y',
            type: 'number',
          },
        ],
        query: [
          {
            label: 'datasets',
            id: 'datasets',
            type: '4wings-datasets',
            required: true,
          },
          {
            label: 'date-range',
            id: 'date-range',
            type: 'string',
            required: false,
            array: true,
          },
          {
            label: 'format',
            id: 'format',
            type: 'string',
            required: false,
            enum: ['intArray', 'mvt'],
          },
          {
            label: 'proxy',
            id: 'proxy',
            type: 'boolean',
            required: false,
            description: 'Server will load the request instead of redirect to avoid CORS issues',
          },
          {
            label: 'temporal-aggregation',
            id: 'temporal-aggregation',
            type: 'boolean',
            required: false,
            default: false,
          },
        ],
      },
    ],
  } as any,
]
export default datasets
