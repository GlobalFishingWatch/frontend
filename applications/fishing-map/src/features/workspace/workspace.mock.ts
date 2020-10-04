/* eslint-disable @typescript-eslint/camelcase */
import { Workspace } from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { Field } from '@globalfishingwatch/data-transforms'

const workspace: Workspace = {
  id: 1,
  name: 'Default public Fishing Map workspace',
  description: '',
  viewport: {
    zoom: 4,
    latitude: 42,
    longitude: -9,
  },
  start: '2018-01-01T00:00:00.000Z',
  end: '2019-12-31T00:00:00.000Z',
  dataviews: [
    {
      id: 10,
      name: 'background',
      description: '',
      config: {
        id: 'background',
        type: Generators.Type.Background,
        color: '#00265c',
      },
    },
    {
      id: 11,
      name: 'basemap',
      description: '',
      config: {
        id: 'basemap',
        type: Generators.Type.Basemap,
        basemap: Generators.BasemapType.Default,
      },
    },
    {
      id: 1,
      name: 'Apparent fishing effort',
      description:
        'We use data about a vessel’s identity, type, location, speed, direction and more that is broadcast using the Automatic Identification System (AIS) and collected via satellites and terrestrial receivers. We analyze AIS data collected from vessels that our research has identified as known or possible commercial fishing vessels, and apply a fishing detection algorithm to determine “apparent fishing activity” based on changes in vessel speed and direction. The algorithm classifies each AIS broadcast data point for these vessels as either apparently fishing or not fishing and shows the former on our fishing activity heat map.',
      config: {
        type: Generators.Type.HeatmapAnimated,
        color: '#00FFBC',
        sublayers: [{ id: 'fishing', colorRamp: 'teal', datasets: ['fishing_v4'] }],
        combinationMode: 'compare',
        tilesAPI: `${process.env.REACT_APP_API_GATEWAY}/v1/4wings`,
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
    {
      id: 2,
      name: 'Default track',
      description: 'Default track',
      config: {
        type: Generators.Type.Track,
        color: 'red',
      },
      datasetsConfig: {
        'carriers-tracks:v20200507': {
          params: [{ id: 'vesselId', value: '00ba29183-3b86-9e36-cf20-ee340e409521' }],
          query: [
            // { id: 'binary', value: false },
            { id: 'wrapLongitudes', value: false },
            {
              id: 'fields',
              value: [Field.lonlat, Field.timestamp, Field.speed, Field.fishing].join(','),
            },
            {
              id: 'format',
              value: 'valueArray',
            },
          ],
          endpoint: 'carriers-tracks',
        },
      },
      datasets: [
        {
          alias: null,
          id: 'carriers-tracks:v20200507',
          name: 'carriers-tracks:v20200507',
          type: 'carriers-tracks:v1',
          description: 'test dataset',
          status: 'done',
          ownerId: 46,
          ownerType: 'user',
          configuration: { table: 'carriers_v20200507_tracks' },
          createdAt: '2020-09-25T14:40:24.004Z',
          relatedDatasets: null,
          endpoints: [
            {
              id: 'carriers-tracks',
              description: 'Endpoint to retrieve vessel track',
              downloadable: true,
              // TODO Why is it {{id}} in pathTemplate and then 'vesselId' in params???
              // pathTemplate: '/v1/vessels/{{id}}/tracks',
              pathTemplate: '/datasets/fishing/vessels/{{vesselId}}/tracks',
              params: [{ label: 'vessel id', id: 'vesselId', type: 'string' }],
              query: [
                { label: 'Datasets', id: 'datasets', type: 'string', required: true },
                { label: 'start date', id: 'startDate', type: 'Date ISO', required: false },
                { label: 'end date', id: 'endDate', type: 'Date ISO', required: false },
                { label: 'binary', id: 'binary', type: 'boolean', default: true },
                { label: 'wrapLongitudes', id: 'wrapLongitudes', type: 'boolean', default: false },
                {
                  label: 'fields',
                  id: 'fields',
                  type: 'enum',
                  enum: ['lat', 'lon', 'timestamp', 'speed', 'course'],
                },
                {
                  label: 'format',
                  id: 'format',
                  type: 'enum',
                  values: ['point', 'lines', 'valueArray'],
                  default: 'lines',
                  description:
                    'Specific encoding format to use for the track. Possible values lines, points or valueArray. valueArray: is a custom compact format, an array with all the fields serialized. The format is further explained in this issue: valueArray format. lines: Geojson with a single LineString feature containing all the points in the track points: Geojson with a FeatureCollection containing a Point feature for every point in the track',
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
