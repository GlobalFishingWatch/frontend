import { Dataset } from '@globalfishingwatch/api-types/dist'

export const datasets: Dataset[] = [
  {
    alias: null,
    id: 'global-port-events:v20201001',
    name: 'Port Events (AIS)',
    type: 'carriers-events:v1',
    description: 'The dataset contains port events for AIS',
    startDate: '2012-01-01T00:13:01.000Z',
    endDate: '2021-02-08T23:59:59.000Z',
    unit: null,
    status: 'done',
    importLogs: null,
    category: null,
    subcategory: null,
    source: 'gfw-ais',
    ownerId: 78,
    ownerType: 'user',
    configuration: {
      table: 'ais_v20201001_events',
    },
    createdAt: '2021-02-10T11:28:20.845Z',
    relatedDatasets: null,
    schema: {
      fields: [],
      event_id: {
        type: 'string',
        minLength: 3,
      },
      event_end: {
        type: 'string',
        format: 'date-time',
      },
      vessel_id: {
        type: 'string',
        minLength: 3,
      },
      event_info: {
        type: 'object',
        properties: {
          anchorage: {
            id: {
              type: 'string',
            },
            flag: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            top_destination: {
              type: 'string',
            },
          },
          anchorage_lat: {
            type: 'number',
          },
          anchorage_lon: {
            type: 'number',
          },
        },
      },
      event_type: {
        enum: ['port'],
        type: 'string',
        minLength: 3,
      },
      event_start: {
        type: 'string',
        format: 'date-time',
      },
      event_vessels: {
        type: 'array',
        contains: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            ssvid: {
              type: 'string',
            },
          },
        },
      },
      event_geography: {
        type: 'string',
      },
      event_mean_position: {
        type: 'string',
      },
    },
    fieldsAllowed: [],
    endpoints: [
      {
        id: 'carriers-events-stats',
        description: 'Endpoint to retrieve events stats',
        downloadable: true,
        method: 'GET',
        pathTemplate: '/v1/events/stats',
        params: [],
        query: [
          {
            label: 'datasets',
            id: 'datasets',
            type: 'string',
            required: true,
          },
          {
            label: 'vessels',
            id: 'vessels',
            type: 'string',
            array: true,
            required: true,
          },
          {
            label: 'types',
            id: 'types',
            type: 'string',
            array: true,
            required: false,
            enum: ['encounter', 'port', 'loitering'],
          },
          {
            label: 'startDate',
            id: 'startDate',
            type: 'Date ISO',
            required: true,
          },
          {
            label: 'endDate',
            id: 'endDate',
            type: 'Date ISO',
            required: true,
          },
          {
            label: 'bounds',
            id: 'bounds',
            type: 'number',
            array: true,
          },
          {
            label: 'interval',
            id: 'interval',
            type: 'string',
            default: 'month',
          },
        ],
      },
      {
        id: 'carriers-events-detail',
        description: 'Endpoint to retrieve a particular event information',
        downloadable: true,
        method: 'GET',
        pathTemplate: '/v1/events/{{eventId}}',
        params: [
          {
            label: 'Event id',
            id: 'eventId',
            type: 'string',
          },
        ],
        query: [
          {
            label: 'datasets',
            id: 'datasets',
            type: 'string',
            required: true,
          },
          {
            label: 'outputParam',
            id: 'outputParam',
            type: 'string',
            default: 'json',
            enum: ['csv', 'json'],
          },
          {
            label: 'timeFormat',
            id: 'timeFormat',
            type: 'string',
            default: 'timestamp',
            enum: ['timestamp', 'default'],
          },
        ],
      },
      {
        id: 'carriers-events-tiles',
        description: 'Endpoint to retrieve events tiles',
        downloadable: false,
        method: 'GET',
        pathTemplate: '/v1/events/{{eventType}}/{{z}},{{x}},{{y}}',
        params: [
          {
            label: 'Event type',
            id: 'eventType',
            type: 'string',
          },
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
            type: 'string',
            required: true,
          },
        ],
      },
      // ADDED THIS ENDPOINT TODO ADD TO LIVE DATASET
      {
        id: 'carriers-events',
        description: 'Retrieve events for a vessel',
        downloadable: true,
        pathTemplate: '/v1/events',
        params: [],
        query: [
          {
            label: 'datasets',
            id: 'datasets',
            type: 'string',
            required: true,
          },
          {
            label: 'vessels',
            id: 'vessels',
            type: 'string',
            array: true,
          },
          {
            label: 'types',
            id: 'types',
            type: 'string',
            enum: ['encounter', 'port', 'loitering'],
            array: true,
          },
          {
            label: 'excludedTypes',
            id: 'excludedTypes',
            type: 'string',
            enum: ['encounter', 'port', 'loitering'],
            array: true,
          },
          {
            label: 'startDate',
            id: 'startDate',
            type: 'date-iso',
            required: true,
          },
          {
            label: 'endDate',
            id: 'endDate',
            type: 'date-iso',
            required: true,
          },
        ],
      },
    ],
  } as any,
]
export default datasets
