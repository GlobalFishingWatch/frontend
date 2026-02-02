import { EndpointId, THINNING_PARAMS } from '@globalfishingwatch/api-types'

export const TRACK_ENDPOINTS = [
  {
    id: EndpointId.Tracks,
    description: 'Endpoint to retrieve vessel track',
    downloadable: true,
    method: 'GET',
    pathTemplate: '/{{apiVersion}}/vessels/{{vesselId}}/tracks',
    params: [
      {
        id: 'vesselId',
        type: 'string',
      },
    ],
    query: [
      {
        id: 'dataset',
        type: 'string',
        required: true,
        array: false,
      },
      {
        id: 'start-date',
        type: 'string',
        required: false,
      },
      {
        id: 'end-date',
        type: 'string',
        required: false,
      },
      {
        id: 'binary',
        type: 'boolean',
        default: true,
      },
      {
        id: 'fields',
        type: 'enum',
        array: true,
        enum: ['LAT', 'LON', 'TIMESTAMP', 'SPEED', 'COURSE'],
      },
      {
        id: 'format',
        type: 'enum',
        enum: ['POINT', 'LINES', 'VALUEARRAY'],
        default: 'LINES',
        description:
          'Specific encoding format to use for the track. Possible values lines, points or valueArray. valueArray: is a custom compact format, an array with all the fields serialized. The format is further explained in this issue: valueArray format. lines: Geojson with a single LineString feature containing all the points in the track points: Geojson with a FeatureCollection containing a Point feature for every point in the track',
      },
      ...THINNING_PARAMS.map((param) => ({
        id: `${param}`,
        type: 'number' as const,
        required: false,
      })),
    ],
  },
] as const

export const VESSELS_ENDPOINTS = [
  {
    id: EndpointId.VesselList,
    description: 'Endpoint to lists vessels given a list of vessels ids',
    downloadable: true,
    method: 'GET',
    pathTemplate: '/{{apiVersion}}/vessels',
    params: [],
    query: [
      {
        id: 'datasets',
        type: 'string',
        array: true,
        required: true,
      },
      {
        id: 'ids',
        type: 'string',
        array: true,
        required: true,
      },
      {
        id: 'binary',
        type: 'boolean',
        array: false,
        default: true,
      },
      {
        id: 'vessel-groups',
        type: 'string',
        array: true,
        required: false,
      },
    ],
  },
  {
    id: EndpointId.VesselSearch,
    description: 'Endpoint to search for a vessel given a free form query.',
    downloadable: true,
    method: 'GET',
    pathTemplate: '/{{apiVersion}}/vessels/search',
    params: [],
    query: [
      {
        id: 'datasets',
        type: 'string',
        array: true,
        required: true,
      },
      {
        id: 'query',
        type: 'string',
        array: false,
        required: false,
      },
      {
        id: 'where',
        type: 'string',
        array: false,
        required: false,
      },
      {
        id: 'limit',
        type: 'number',
        array: false,
        required: false,
      },
      {
        id: 'since',
        type: 'string',
        array: false,
        required: false,
      },
      {
        id: 'binary',
        type: 'boolean',
        default: true,
      },
      {
        id: 'match-fields',
        type: 'string',
        array: true,
        required: false,
      },
      {
        id: 'includes',
        type: 'string',
        array: true,
        required: false,
      },
    ],
  },
  {
    id: EndpointId.Vessel,
    description: 'Endpoint to retrieve one vessel information',
    downloadable: true,
    method: 'GET',
    pathTemplate: '/{{apiVersion}}/vessels/{{vesselId}}',
    params: [
      {
        id: 'vesselId',
        type: 'string',
      },
    ],
    query: [
      {
        id: 'datasets',
        type: 'string',
        array: true,
        required: true,
      },
      {
        id: 'binary',
        type: 'boolean',
        default: true,
      },
    ],
  },
] as const

export const EVENTS_ENDPOINTS = [
  {
    id: EndpointId.Events,
    description: 'Endpoint to retrieve a list of events information',
    downloadable: true,
    method: 'GET',
    pathTemplate: '/{{apiVersion}}/events',
    params: [],
    query: [
      {
        id: 'datasets',
        type: 'string',
        required: true,
        array: true,
      },
      {
        id: 'vessels',
        type: 'string',
        array: true,
        required: true,
      },
      {
        id: 'types',
        type: 'string',
        array: true,
        enum: ['loitering', 'encounter', 'port', 'fishing'],
      },
      {
        id: 'output-param',
        type: 'string',
        default: 'json',
        enum: ['csv', 'json'],
      },
      {
        id: 'time-format',
        type: 'string',
        default: 'timestamp',
        enum: ['timestamp', 'default'],
      },
      {
        id: 'confidences',
        type: 'number',
        default: 4,
        array: true,
      },
      {
        id: 'start-date',
        type: 'string',
      },
      {
        id: 'end-date',
        type: 'string',
      },
    ],
  },
  {
    id: EndpointId.EventsDetail,
    description: 'Endpoint to retrieve a particular event information',
    downloadable: true,
    method: 'GET',
    pathTemplate: '/{{apiVersion}}/events/{{eventId}}',
    params: [
      {
        id: 'eventId',
        type: 'string',
      },
    ],
    query: [
      {
        id: 'dataset',
        type: 'string',
        required: true,
        array: false,
      },
      {
        id: 'output-param',
        type: 'string',
        default: 'json',
        enum: ['csv', 'json'],
      },
      {
        id: 'time-format',
        type: 'string',
        default: 'timestamp',
        enum: ['timestamp', 'default'],
      },
    ],
  },
  {
    id: EndpointId.EventsStats,
    description: 'Endpoint to retrieve events stats',
    downloadable: true,
    method: 'GET',
    pathTemplate: '/{{apiVersion}}/events/stats',
    params: [],
    query: [
      {
        id: 'datasets',
        type: 'string',
        required: true,
        array: true,
      },
      {
        id: 'vessels',
        type: 'string',
        array: true,
        required: true,
      },
      {
        id: 'types',
        type: 'string',
        array: true,
        required: false,
        enum: ['encounter', 'port', 'loitering'],
      },
      {
        id: 'vessel-types',
        type: 'string',
        array: true,
        required: false,
        enum: [
          'BUNKER',
          'CARGO',
          'DISCREPANCY',
          'CARRIER',
          'FISHING',
          'GEAR',
          'OTHER',
          'PASSENGER',
          'SEISMIC_VESSEL',
          'SUPPORT',
        ],
      },
      {
        id: 'start-date',
        type: 'string',
        required: true,
      },
      {
        id: 'end-date',
        type: 'string',
        required: true,
      },
      {
        id: 'bounds',
        type: 'number',
        array: true,
      },
      {
        id: 'interval',
        type: 'string',
        default: 'month',
      },
    ],
  },
  {
    id: EndpointId.ClusterTiles,
    description: 'Endpoint to retrieve events cluster tiles',
    downloadable: false,
    method: 'GET',
    pathTemplate: '/{{apiVersion}}/4wings/tile/{{type}}/{{z}}/{{x}}/{{y}}',
    params: [
      {
        id: 'type',
        type: 'string',
        enum: ['heatmap', 'position'],
      },
      {
        id: 'z',
        type: 'number',
      },
      {
        id: 'x',
        type: 'number',
      },
      {
        id: 'y',
        type: 'number',
      },
    ],
    query: [
      {
        id: 'datasets',
        type: 'string',
        array: true,
        required: true,
      },
      {
        id: 'filters',
        type: 'sql',
        array: true,
        required: false,
      },
      {
        id: 'date-range',
        type: 'string',
        required: false,
      },
      {
        id: 'format',
        type: 'string',
        required: false,
        enum: ['INTARRAY', 'MVT', '4WINGS'],
      },
      {
        id: 'temporal-aggregation',
        type: 'boolean',
        required: false,
        default: false,
      },
    ],
  },
  {
    id: EndpointId.ClusterTilesInteraction,
    description: 'Endpoint to retrieve events ids from a 4wings cell',
    downloadable: true,
    method: 'GET',
    pathTemplate: '/{{apiVersion}}/4wings/interaction/{{z}}/{{x}}/{{y}}/{{cols}}/{{rows}}',
    params: [
      {
        id: 'z',
        type: 'number',
      },
      {
        id: 'x',
        type: 'number',
      },
      {
        id: 'y',
        type: 'number',
      },
      {
        id: 'cols',
        type: 'number',
      },
      {
        id: 'rows',
        type: 'number',
      },
    ],
    query: [
      {
        id: 'datasets',
        type: 'string',
        required: true,
      },
      {
        id: 'filters',
        type: 'sql',
        array: true,
        required: false,
      },
      {
        id: 'date-range',
        type: 'string',
        required: false,
      },
      {
        id: 'vessel-groups',
        type: 'string',
        required: false,
      },
      {
        id: 'group-by',
        type: 'string',
        enum: ['id', 'vesselId'],
        required: false,
      },
    ],
  },
] as const

export const FOURWINGS_ENDPOINTS = [
  {
    id: EndpointId.FourwingsTiles,
    description: 'Endpoint to retrieve tiles from 4wings dataset',
    downloadable: false,
    method: 'GET',
    pathTemplate: '/{{apiVersion}}/4wings/tile/{{type}}/{{z}}/{{x}}/{{y}}',
    params: [
      {
        id: 'type',
        type: 'string',
        enum: ['heatmap', 'position'],
      },
      {
        id: 'z',
        type: 'number',
      },
      {
        id: 'x',
        type: 'number',
      },
      {
        id: 'y',
        type: 'number',
      },
    ],
    query: [
      {
        id: 'datasets',
        type: 'string',
        array: true,
        required: true,
      },
      {
        id: 'filters',
        type: 'sql',
        array: true,
        required: false,
      },
      {
        id: 'date-range',
        type: 'string',
        required: false,
      },
      {
        id: 'format',
        type: 'string',
        required: false,
        enum: ['INTARRAY', 'MVT'],
      },
      {
        id: 'proxy',
        type: 'boolean',
        required: false,
        description: 'Server will load the request instead of redirect to avoid CORS issues',
      },
      {
        id: 'temporal-aggregation',
        type: 'boolean',
        required: false,
        default: false,
      },
    ],
  },
  {
    id: EndpointId.FourwingsInteraction,
    description: 'Endpoint to retrieve vessel ids from a 4wings cell',
    downloadable: true,
    method: 'GET',
    pathTemplate: '/{{apiVersion}}/4wings/interaction/{{z}}/{{x}}/{{y}}/{{cols}}/{{rows}}',
    params: [
      {
        id: 'z',
        type: 'number',
      },
      {
        id: 'x',
        type: 'number',
      },
      {
        id: 'y',
        type: 'number',
      },
      {
        id: 'cols',
        type: 'number',
      },
      {
        id: 'rows',
        type: 'number',
      },
    ],
    query: [
      {
        id: 'datasets',
        type: 'string',
        array: true,
        required: true,
      },
      {
        id: 'filters',
        type: 'sql',
        array: true,
        required: false,
      },
      {
        id: 'date-range',
        type: 'string',
        required: false,
      },
      {
        id: 'vessel-groups',
        type: 'string',
        required: false,
      },
    ],
  },
  // {
  //   id: EndpointId.FourwingsLegend,
  //   description: 'Endpoint to retrieve legend statistics from 4wings dataset',
  //   downloadable: true,
  //   method: 'GET',
  //   pathTemplate: '/{{apiVersion}}/4wings/legend',
  //   params: [],
  //   query: [
  //     {
  //       id: 'datasets',
  //       type: 'string',
  //       array: true,
  //       required: true,
  //     },
  //     {
  //       id: 'filters',
  //       type: 'sql',
  //       array: true,
  //       required: false,
  //     },
  //     {
  //       id: 'temporal-aggregation',
  //       type: 'boolean',
  //       required: false,
  //       default: false,
  //     },
  //   ],
  // },
  // {
  //   id: EndpointId.FourwingsLegendByZoom,
  //   downloadable: true,
  //   method: 'GET',
  //   pathTemplate: '/{{apiVersion}}/4wings/legend/{{z}}',
  //   params: [
  //     {
  //       id: 'z',
  //       type: 'number',
  //     },
  //   ],
  //   query: [
  //     {
  //       id: 'datasets',
  //       type: 'string',
  //       array: true,
  //       required: true,
  //     },
  //     {
  //       id: 'filters',
  //       type: 'sql',
  //       array: true,
  //       required: false,
  //     },
  //     {
  //       id: 'temporal-aggregation',
  //       type: 'boolean',
  //       required: false,
  //       default: false,
  //     },
  //   ],
  // },
  // {
  //   id: EndpointId.FourwingsBreaks,
  //   downloadable: true,
  //   method: 'GET',
  //   pathTemplate: '/{{apiVersion}}/4wings/bins/{{zoom}}',
  //   params: [
  //     {
  //       id: 'zoom',
  //       type: 'number',
  //     },
  //   ],
  //   query: [
  //     {
  //       id: 'datasets',
  //       type: 'string',
  //       array: true,
  //       required: true,
  //     },
  //     {
  //       id: 'date-range',
  //       type: 'string',
  //       required: false,
  //     },
  //     {
  //       id: 'interval',
  //       type: 'string',
  //       required: false,
  //     },
  //     {
  //       id: 'numBins',
  //       type: 'number',
  //       required: false,
  //       default: 10,
  //     },
  //     {
  //       id: 'filters',
  //       type: 'sql',
  //       array: true,
  //       required: false,
  //     },
  //     {
  //       id: 'temporal-aggregation',
  //       type: 'boolean',
  //       required: false,
  //       default: false,
  //     },
  //   ],
  // },
  {
    id: EndpointId.FourwingsStats,
    downloadable: true,
    method: 'GET',
    pathTemplate: '/{{apiVersion}}/4wings/stats',
    params: [],
    query: [
      {
        id: 'datasets',
        type: 'string',
        array: true,
        required: true,
      },
      {
        id: 'date-range',
        type: 'string',
        required: false,
      },
      {
        id: 'filters',
        type: 'sql',
        array: true,
        required: false,
      },
      {
        id: 'temporal-aggregation',
        type: 'boolean',
        required: false,
        default: false,
      },
    ],
  },
  // {
  //   id: EndpointId.FourwingsStatsCreate,
  //   downloadable: true,
  //   method: 'POST',
  //   pathTemplate: '/{{apiVersion}}/4wings/stats',
  //   params: [
  //     {
  //       id: 'aoiId',
  //       type: 'number',
  //     },
  //   ],
  //   body: [
  //     {
  //       id: 'geom',
  //       type: 'object',
  //       required: true,
  //     },
  //   ],
  //   query: [
  //     {
  //       id: 'datasets',
  //       type: 'string',
  //       array: true,
  //       required: true,
  //     },
  //     {
  //       id: 'filters',
  //       type: 'sql',
  //       array: true,
  //       required: false,
  //     },
  //     {
  //       id: 'temporal-aggregation',
  //       type: 'boolean',
  //       required: false,
  //       default: false,
  //     },
  //   ],
  // },
] as const

export const USER_TRACKS_ENDPOINTS = [
  // {
  //   id: EndpointId.UserTracksTiles,
  //   downloadable: true,
  //   method: 'GET',
  //   pathTemplate: '/{{apiVersion}}/user-tracks-v1/{{z}}/{{x}}/{{y}}',
  //   params: [
  //     {
  //       id: 'z',
  //       type: 'number',
  //     },
  //     {
  //       id: 'x',
  //       type: 'number',
  //     },
  //     {
  //       id: 'y',
  //       type: 'number',
  //     },
  //   ],
  //   query: [
  //     {
  //       id: 'datasets',
  //       type: 'string',
  //       array: true,
  //       required: true,
  //     },
  //     {
  //       id: 'startDate',
  //       type: 'string',
  //       required: false,
  //     },
  //     {
  //       id: 'endDate',
  //       type: 'string',
  //       required: false,
  //     },
  //     {
  //       id: 'id',
  //       type: 'string',
  //       required: false,
  //     },
  //   ],
  // },
  {
    id: EndpointId.UserTracks,
    downloadable: true,
    method: 'GET',
    pathTemplate: '/{{apiVersion}}/datasets/{{id}}/tracks',
    params: [
      {
        id: 'id',
        type: 'string',
      },
    ],
    query: [],
  },
] as const

export const USER_CONTEXT_LAYER_ENDPOINTS = [
  {
    id: EndpointId.ContextTiles,
    description: 'Endpoint to retrieve tiles from user context layers',
    downloadable: true,
    method: 'GET',
    pathTemplate: '/{{apiVersion}}/datasets/{{dataset}}/user-context-layers/{{z}}/{{x}}/{{y}}',
    params: [
      {
        id: 'dataset',
        type: 'string',
      },
      {
        id: 'z',
        type: 'number',
      },
      {
        id: 'x',
        type: 'number',
      },
      {
        id: 'y',
        type: 'number',
      },
    ],
    query: [
      {
        id: 'properties',
        type: 'string',
        array: true,
      },
      {
        id: 'filters',
        type: 'sql',
        array: true,
        required: false,
      },
    ],
  },
  {
    id: EndpointId.ContextFeature,
    description: 'Endpoint to retrieve a feature from a context layer',
    downloadable: true,
    method: 'GET',
    pathTemplate: '/{{apiVersion}}/datasets/{{dataset}}/user-context-layers/{{id}}',
    params: [
      {
        id: 'dataset',
        type: 'string',
      },
      {
        id: 'id',
        type: 'number',
      },
    ],
    query: [
      {
        id: 'simplify',
        type: 'number',
        required: false,
      },
    ],
  },
] as const

export const CONTEXT_LAYER_ENDPOINTS = [
  {
    id: EndpointId.ContextTiles,
    description: 'Endpoint to retrieve tiles from context layers',
    downloadable: true,
    method: 'GET',
    pathTemplate: '/{{apiVersion}}/datasets/{{dataset}}/context-layers/{{z}}/{{x}}/{{y}}',
    params: [
      {
        id: 'dataset',
        type: 'string',
      },
      {
        id: 'z',
        type: 'number',
      },
      {
        id: 'x',
        type: 'number',
      },
      {
        id: 'y',
        type: 'number',
      },
    ],
    query: [],
  },
  {
    id: EndpointId.ContextFeature,
    description: 'Endpoint to retrieve a feature from a context layer',
    downloadable: true,
    method: 'GET',
    pathTemplate: '/{{apiVersion}}/datasets/{{dataset}}/context-layers/{{id}}',
    params: [
      {
        id: 'dataset',
        type: 'string',
      },
      {
        id: 'id',
        type: 'number',
      },
    ],
    query: [
      {
        id: 'simplify',
        type: 'number',
        required: false,
      },
    ],
  },
] as const

export const TEMPORAL_CONTEXT_LAYER_ENDPOINTS = [
  {
    id: EndpointId.ContextGeojson,
    description: 'Endpoint to retrieve geojson from temporal context layers',
    downloadable: true,
    method: 'GET',
    pathTemplate: '/{{apiVersion}}/datasets/{{dataset}}/temporal-context-layers',
    params: [
      {
        id: 'dataset',
        type: 'string',
      },
    ],
    query: [
      {
        id: 'start-date',
        type: 'string',
        required: false,
      },
      {
        id: 'end-date',
        type: 'string',
        required: false,
      },
    ],
  },
] as const

export const PM_TILES_ENDPOINTS = [
  {
    id: EndpointId.PMTiles,
    description: 'Endpoint to retrieve tiles from pm tiles dataset',
    downloadable: true,
    method: 'GET',
    pathTemplate: 'https://storage.googleapis.com/{{file_path}}',
    params: [
      {
        id: 'file_path',
        type: 'string',
      },
    ],
    query: [],
  },
] as const

export const THUMBNAILS_ENDPOINTS = [
  {
    id: EndpointId.Thumbnails,
    description: 'Endpoint to retrieve thumbnails from a detection id',
    downloadable: true,
    method: 'GET',
    pathTemplate: '/{{apiVersion}}/thumbnail/{{id}}',
    params: [
      {
        id: 'id',
        type: 'string',
      },
    ],
    query: [
      {
        id: 'dataset',
        type: 'string',
        required: true,
      },
    ],
  },
] as const
