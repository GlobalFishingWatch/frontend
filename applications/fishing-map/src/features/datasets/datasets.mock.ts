import { Dataset } from '@globalfishingwatch/dataviews-client'
import {
  TRACKS_DATASET_ID,
  TRACKS_DATASET_TYPE,
  FISHING_DATASET_ID,
  FISHING_DATASET_TYPE,
  VESSELS_DATASET_ID,
  VESSELS_DATASET_TYPE,
} from 'features/workspace/workspace.mock'

const datasets: Dataset[] = [
  {
    id: TRACKS_DATASET_ID,
    name: 'carriers-tracks:v20200507',
    type: TRACKS_DATASET_TYPE,
    description: 'test dataset',
    alias: null,
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
  {
    alias: null,
    id: VESSELS_DATASET_ID,
    name: 'dataset-vessels-alvaro',
    type: VESSELS_DATASET_TYPE,
    description: 'string',
    startDate: undefined,
    endDate: '2020-09-29T08:15:36.259Z',
    unit: undefined,
    status: 'done',
    importLogs: undefined,
    category: undefined,
    subcategory: undefined,
    source: undefined,
    ownerId: 78,
    ownerType: 'user',
    configuration: {
      index: 'gfw-vessels',
    },
    createdAt: '2020-09-29T08:47:16.625Z',
    relatedDatasets: [
      {
        id: TRACKS_DATASET_ID,
        type: TRACKS_DATASET_TYPE,
      },
    ],
    endpoints: [
      {
        id: 'carriers-multiple-vessel',
        description: 'Endpoint to retrieve multiple vessels information',
        downloadable: true,
        pathTemplate: '/v1/vessels',
        params: [],
        query: [
          {
            label: 'Datasets',
            id: 'datasets',
            type: 'string',
            required: true,
          },
          {
            label: 'Ids',
            id: 'ids',
            type: 'string',
            required: true,
          },
          {
            label: 'binary',
            id: 'binary',
            type: 'boolean',
            default: true,
          },
        ],
      },
      {
        id: 'carriers-vessels',
        description: 'Endpoint to retrieve vessels information',
        downloadable: true,
        pathTemplate: '/v1/vessels',
        params: [],
        query: [
          {
            label: 'Datasets',
            id: 'datasets',
            type: 'string',
            required: true,
          },
          {
            label: 'query',
            id: 'query',
            type: 'string',
            required: true,
          },
          {
            label: 'limit',
            id: 'limit',
            type: 'number',
            required: false,
          },
          {
            label: 'offset',
            id: 'offset',
            type: 'number',
            required: false,
          },
          {
            label: 'binary',
            id: 'binary',
            type: 'boolean',
            default: true,
          },
          {
            label: 'querySuggestions',
            id: 'binary',
            type: 'boolean',
            default: true,
          },
          {
            label: 'queryFields',
            id: 'queryFields',
            type: 'string',
          },
        ],
      },
      {
        id: 'carriers-vessel',
        description: 'Endpoint to retrieve one vessel information',
        downloadable: true,
        pathTemplate: '/v1/vessels/{{vesselId}}',
        params: [
          {
            label: 'vessel id',
            id: 'vesselId',
            type: 'string',
          },
        ],
        query: [
          {
            label: 'Datasets',
            id: 'datasets',
            type: 'string',
            required: true,
          },
          {
            label: 'binary',
            id: 'binary',
            type: 'boolean',
            default: true,
          },
        ],
      },
    ],
  },
  {
    id: FISHING_DATASET_ID,
    name: 'Fishing effort v4',
    type: FISHING_DATASET_TYPE,
    alias: null,
    category: '',
    subcategory: '',
    status: 'done',
    importLogs: '',
    ownerId: 0,
    configuration: null,
    description: '',
    startDate: '2018-01-01T00:00:00.000Z',
    endDate: '2019-12-31T00:00:00.000Z',
    unit: 'hours',
    source: 'Global Fishing Watch',
    ownerType: 'user',
    createdAt: '2020-09-07T16:56:37.873Z',
    relatedDatasets: [
      {
        id: VESSELS_DATASET_ID,
        type: VESSELS_DATASET_TYPE,
      },
      {
        id: TRACKS_DATASET_ID,
        type: TRACKS_DATASET_TYPE,
      },
    ],
    endpoints: [
      {
        id: '4wings-interaction',
        description: 'Endpoint to retrieve vessel ids from a 4wings cell',
        downloadable: true,
        // TODO Dataset?
        pathTemplate:
          // '/v1/datasets/fishing_v4/interaction/{{z}}/{{x}}/{{y}}/{{cols}}/{{rows}}',
          // '/v1/interaction/{{z}}/{{x}}/{{y}}/{{cols}}/{{rows}}?datasets[0]=fishing_v4',
          'https://4wings.api.dev.globalfishingwatch.org/v1/interaction/{{z}}/{{x}}/{{y}}/{{cols}}/{{rows}}',
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
          {
            label: 'cols',
            id: 'cols',
            type: 'number',
          },
          {
            label: 'rows',
            id: 'rows',
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
            label: 'date-range',
            id: 'date-range',
            type: 'string',
            required: false,
          },
        ],
      },
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
]

export default datasets
