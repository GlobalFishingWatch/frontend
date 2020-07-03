export const carrierEndpoints = [
  {
    type: 'track',
    downloadable: true,
    params: [
      {
        label: 'vessel id',
        id: 'id',
        type: 'string',
      },
    ],
    query: [
      {
        label: 'start date',
        id: 'startDate',
        type: 'Date ISO',
        required: false,
      },
      {
        label: 'end date',
        id: 'endDate',
        type: 'Date ISO',
        required: false,
      },
      {
        label: 'binary',
        id: 'binary',
        type: 'boolean',
        default: true,
      },
      {
        label: 'format',
        id: 'format',
        type: 'string',
        default: 'lines',
        description:
          'Specific encoding format to use for the track. Possible values lines, points or valueArray. valueArray: is a custom compact format, an array with all the fields serialized. The format is further explained in this issue: valueArray format. lines: Geojson with a single LineString feature containing all the points in the track points: Geojson with a FeatureCollection containing a Point feature for every point in the track',
      },
    ],
    pathTemplate: '/datasets/carriers:v20200507/vessels/{{id}}/tracks',
  },
  {
    type: 'vessel',
    downloadable: true,
    params: [
      {
        label: 'vessel id',
        id: 'id',
        type: 'string',
      },
    ],
    query: [],
    pathTemplate: '/datasets/carriers:v20200507/vessels/{{id}}',
  },
  {
    type: 'events',
    downloadable: true,
    params: [],
    query: [
      {
        label: 'event type',
        id: 'type',
        type: 'string',
      },
    ],
    pathTemplate: '/datasets/carriers:v20200507/events',
  },
]
