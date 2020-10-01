/* eslint-disable @typescript-eslint/camelcase */
import { Workspace } from '@globalfishingwatch/dataviews-client'

const workspace: Workspace = {
  id: 1,
  name: 'Default public Fishing Map workspace',
  description: '',
  viewport: {
    latitude: 11,
    longitude: -72,
    zoom: 3,
  },
  start: '2018-01-01T00:00:00.000Z',
  end: '2019-12-31T00:00:00.000Z',
  dataviews: [
    {
      id: 3,
      name: 'Apparent fishing effort',
      description:
        'We use data about a vessel’s identity, type, location, speed, direction and more that is broadcast using the Automatic Identification System (AIS) and collected via satellites and terrestrial receivers. We analyze AIS data collected from vessels that our research has identified as known or possible commercial fishing vessels, and apply a fishing detection algorithm to determine “apparent fishing activity” based on changes in vessel speed and direction. The algorithm classifies each AIS broadcast data point for these vessels as either apparently fishing or not fishing and shows the former on our fishing activity heat map.',
      config: {
        type: 'HEATMAP',
        color: '#00FFBC',
        colorRamp: 'teal',
      },
      datasetsConfig: {
        dgg_fishing_galapagos: {
          params: [{ id: 'type', value: 'heatmap' }],
          endpoint: '4wings-tiles',
        },
        dgg_fishing_caribe: {
          params: [{ id: 'type', value: 'heatmap' }],
          endpoint: '4wings-tiles',
        },
      },
      datasets: [
        {
          alias: null,
          category: '',
          subcategory: '',
          status: 'done',
          importLogs: '',
          ownerId: 0,
          configuration: null,
          id: 'dgg_fishing_galapagos',
          name: 'Fishing effort for galapagos',
          type: '4wings:v1',
          description: '',
          startDate: '2018-01-01T00:00:00.000Z',
          endDate: '2019-12-31T00:00:00.000Z',
          unit: 'hours',
          source: 'Global Fishing Watch',
          ownerType: 'user',
          createdAt: '2020-09-07T16:56:37.873Z',
          relatedDatasets: null,
          endpoints: [
            {
              id: '4wings-tiles',
              description: 'Endpoint to retrieve tiles from 4wings dataset',
              downloadable: false,
              pathTemplate: '/v1/4wings/tile/{{type}}/{{z}}/{{x}}/{{y}}',
              params: [
                {
                  label: 'Type',
                  id: 'type',
                  type: 'string',
                  enum: ['heatmap', 'position'],
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
                  label: 'Datasets',
                  id: 'datasets',
                  type: '4wings-datasets',
                  required: true,
                },
                {
                  label: 'filters',
                  id: 'filters',
                  type: 'sql',
                  required: false,
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
                  description:
                    'Server will load the request instead of redirect to avoid CORS issues',
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
            {
              id: '4wings-legend',
              description: 'Endpoint to retrieve legend statistics from 4wings dataset',
              downloadable: true,
              pathTemplate: '/v1/4wings/legend',
              params: [],
              query: [
                {
                  label: 'Datasets',
                  id: 'datasets',
                  type: '4wings-datasets',
                  required: true,
                },
                {
                  label: 'filters',
                  id: 'filters',
                  type: 'sql',
                  required: false,
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
            {
              id: '4wings-legend-by-zoom',
              description: '',
              downloadable: true,
              pathTemplate: '/v1/4wings/legend/{{Z}}',
              params: [
                {
                  label: 'Z',
                  id: 'z',
                  type: 'number',
                },
              ],
              query: [
                {
                  label: 'Datasets',
                  id: 'datasets',
                  type: '4wings-datasets',
                  required: true,
                },
                {
                  label: 'filters',
                  id: 'filters',
                  type: 'sql',
                  required: false,
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
            {
              id: '4wings-stats',
              description: '',
              downloadable: true,
              pathTemplate: '/v1/4wings/stats/{{aoiId}}',
              params: [
                {
                  label: 'OAI Id',
                  id: 'aoiId',
                  type: 'number',
                },
              ],
              query: [
                {
                  label: 'Datasets',
                  id: 'datasets',
                  type: '4wings-datasets',
                  required: true,
                },
                {
                  label: 'date range',
                  id: 'date-range',
                  type: 'string',
                  required: false,
                },
                {
                  label: 'filters',
                  id: 'filters',
                  type: 'sql',
                  required: false,
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
            {
              id: '4wings-stats-create',
              downloadable: true,
              method: 'POST',
              pathTemplate: '/v1/4wings/stats',
              params: [
                {
                  label: 'OAI Id',
                  id: 'aoiId',
                  type: 'number',
                },
              ],
              body: [
                {
                  label: 'Geometry',
                  id: 'geom',
                  type: 'object',
                  required: true,
                },
              ],
              query: [
                {
                  label: 'Datasets',
                  id: 'datasets',
                  type: '4wings-datasets',
                  required: true,
                },
                {
                  label: 'filters',
                  id: 'filters',
                  type: 'sql',
                  required: false,
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
        },
        {
          alias: null,
          category: '',
          subcategory: '',
          status: 'done',
          importLogs: '',
          ownerId: 0,
          configuration: null,
          id: 'dgg_fishing_caribe',
          name: 'Fishing effort for caribe',
          type: '4wings:v1',
          description: '',
          startDate: '2018-01-01T00:00:00.000Z',
          endDate: '2019-12-31T00:00:00.000Z',
          unit: 'hours',
          source: 'Global Fishing Watch',
          ownerType: 'user',
          createdAt: '2020-09-07T16:56:37.873Z',
          relatedDatasets: null,
          endpoints: [
            {
              id: '4wings-tiles',
              description: 'Endpoint to retrieve tiles from 4wings dataset',
              downloadable: false,
              pathTemplate: '/v1/4wings/tile/{{type}}/{{z}}/{{x}}/{{y}}',
              params: [
                {
                  label: 'Type',
                  id: 'type',
                  type: 'string',
                  enum: ['heatmap', 'position'],
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
                  label: 'Datasets',
                  id: 'datasets',
                  type: '4wings-datasets',
                  required: true,
                },
                {
                  label: 'filters',
                  id: 'filters',
                  type: 'sql',
                  required: false,
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
                  description:
                    'Server will load the request instead of redirect to avoid CORS issues',
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
            {
              id: '4wings-legend',
              description: 'Endpoint to retrieve legend statistics from 4wings dataset',
              downloadable: true,
              pathTemplate: '/v1/4wings/legend',
              params: [],
              query: [
                {
                  label: 'Datasets',
                  id: 'datasets',
                  type: '4wings-datasets',
                  required: true,
                },
                {
                  label: 'filters',
                  id: 'filters',
                  type: 'sql',
                  required: false,
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
            {
              id: '4wings-legend-by-zoom',
              downloadable: true,
              pathTemplate: '/v1/4wings/legend/{{Z}}',
              params: [
                {
                  label: 'Z',
                  id: 'z',
                  type: 'number',
                },
              ],
              query: [
                {
                  label: 'Datasets',
                  id: 'datasets',
                  type: '4wings-datasets',
                  required: true,
                },
                {
                  label: 'filters',
                  id: 'filters',
                  type: 'sql',
                  required: false,
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
            {
              id: '4wings-stats',
              downloadable: true,
              pathTemplate: '/v1/4wings/stats/{{aoiId}}',
              params: [
                {
                  label: 'OAI Id',
                  id: 'aoiId',
                  type: 'number',
                },
              ],
              query: [
                {
                  label: 'Datasets',
                  id: 'datasets',
                  type: '4wings-datasets',
                  required: true,
                },
                {
                  label: 'date range',
                  id: 'date-range',
                  type: 'string',
                  required: false,
                },
                {
                  label: 'filters',
                  id: 'filters',
                  type: 'sql',
                  required: false,
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
            {
              id: '4wings-stats-create',
              downloadable: true,
              method: 'POST',
              pathTemplate: '/v1/4wings/stats',
              params: [
                {
                  label: 'OAI Id',
                  id: 'aoiId',
                  type: 'number',
                },
              ],
              body: [
                {
                  label: 'Geometry',
                  id: 'geom',
                  type: 'object',
                  required: true,
                },
              ],
              query: [
                {
                  label: 'Datasets',
                  id: 'datasets',
                  type: '4wings-datasets',
                  required: true,
                },
                {
                  label: 'filters',
                  id: 'filters',
                  type: 'sql',
                  required: false,
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
        },
      ],
    },
  ],
  dataviewsConfig: {
    '3': {
      config: {
        color: '#FFAA0D',
        colorRamp: 'orange',
      },
      datasetsConfig: {
        dgg_fishing_caribe: {
          params: [{ id: 'type', value: 'heatmap' }],
          endpoint: '4wings-tiles',
        },
      },
    },
  },
}

export default workspace
