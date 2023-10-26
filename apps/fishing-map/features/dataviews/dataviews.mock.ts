import { Dataview, DataviewCategory } from '@globalfishingwatch/api-types'

export const dataviews: Dataview[] = [
  {
    id: 998,
    name: 'Apparent fishing effort',
    slug: 'apparent-fishing-effort',
    description: 'Apparent fishing effort',
    app: 'fishing-map',
    config: {
      type: 'HEATMAP_ANIMATED',
      color: '#00FFBC',
      datasets: [
        'public-global-fishing-effort:v20231026',
        'public-belize-fishing-effort:v20220304',
        'public-chile-fishing-effort:v20211126',
        'public-bra-onyxsat-fishing-effort:v20211126',
        'public-ecuador-fishing-effort:v20211126',
        'public-indonesia-fishing-effort:v20200320',
        'public-panama-fishing-effort:v20211126',
        'public-peru-fishing-effort:v20211126',
        'public-costa-rica-fishing-effort:v20211126',
        'public-norway-fishing-effort:v20220112',
        'public-png-fishing-effort:v20230210',
      ],
      colorRamp: 'teal',
    },
    // infoConfig: null,
    // eventsConfig: null,
    // filtersConfig: null,
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
        datasetId: 'public-global-fishing-effort:v20231026',
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
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'public-norway-fishing-effort:v20220112',
      },
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'public-png-fishing-effort:v20230210',
      },
    ],
    createdAt: '2022-08-31T11:18:08.003Z',
    updatedAt: '2023-10-24T17:56:58.190Z',
  },
  {
    id: 999,
    name: 'Fishing map vessel with identity dataset',
    slug: 'fishing-map-vessel-track',
    description: 'Fishing map vessel with track, info and events',
    app: 'fishing-map',
    config: {
      type: 'TRACK',
      color: '#F95E5E',
      breaks: [],
      layers: [],
      datasets: [],
      colorRamp: '',
      intervals: [],
      aggregationOperation: '',
    },
    // infoConfig: {},
    // eventsConfig: {},
    // filtersConfig: null,
    category: DataviewCategory.Vessels,
    datasetsConfig: [
      {
        query: [
          {
            id: 'binary',
            value: true,
          },
          {
            id: 'wrap-longitudes',
            value: false,
          },
          {
            id: 'fields',
            value: ['LONLAT', 'TIMESTAMP'],
          },
          {
            id: 'format',
            value: 'VALUE_ARRAY',
          },
        ],
        params: [
          {
            id: 'vesselId',
            value: '',
          },
        ],
        endpoint: 'tracks',
        datasetId: 'public-global-all-tracks:v20201001',
      },
      {
        params: [
          {
            id: 'vesselId',
            value: '',
          },
        ],
        endpoint: 'vessel',
        datasetId: 'public-global-vessel-identity:v20231026',
      },
      {
        query: [
          {
            id: 'vessels',
            value: '',
          },
          {
            id: 'vessel-types',
            value: ['FISHING'],
          },
          {
            id: 'includes',
            value: [
              'id',
              'type',
              'start',
              'end',
              'position',
              'regions.mpa',
              'regions.eez',
              'regions.fao',
              'regions.rfmo',
              'fishing.averageSpeedKnots',
            ],
          },
          {
            id: 'limit',
            value: 9999999,
          },
          {
            id: 'offset',
            value: 0,
          },
        ],
        params: [],
        endpoint: 'events',
        datasetId: 'public-global-fishing-events:v20231026',
      },
      {
        query: [
          {
            id: 'vessels',
            value: '',
          },
          {
            id: 'includes',
            value: [
              'id',
              'type',
              'start',
              'end',
              'position',
              'regions.mpa',
              'regions.eez',
              'regions.fao',
              'regions.rfmo',
              'loitering.totalDistanceKm',
              'loitering.averageSpeedKnots',
            ],
          },
          {
            id: 'limit',
            value: 9999999,
          },
          {
            id: 'offset',
            value: 0,
          },
        ],
        params: [],
        endpoint: 'events',
        datasetId: 'public-global-loitering-events:v20231026',
      },
      {
        query: [
          {
            id: 'vessels',
            value: '',
          },
          {
            id: 'includes',
            value: [
              'id',
              'type',
              'start',
              'end',
              'position',
              'regions.mpa',
              'regions.eez',
              'regions.fao',
              'regions.rfmo',
              'vessel.name',
              'encounter.mainVesselAuthorizationStatus',
              'encounter.encounteredVesselAuthorizationStatus',
              'encounter.medianSpeedKnots',
              'encounter.vessel.id',
              'encounter.vessel.ssvid',
              'encounter.vessel.type',
              'encounter.vessel.name',
              'encounter.vessel.flag',
            ],
          },
          {
            id: 'encounter-types',
            value: ['CARRIER-FISHING', 'FISHING-CARRIER', 'FISHING-SUPPORT', 'SUPPORT-FISHING'],
          },
          {
            id: 'limit',
            value: 9999999,
          },
          {
            id: 'offset',
            value: 0,
          },
        ],
        params: [],
        endpoint: 'events',
        datasetId: 'public-global-encounters-events:v20231026',
      },
      {
        query: [
          {
            id: 'vessels',
            value: '',
          },
          {
            id: 'confidences',
            value: [4],
          },
          {
            id: 'includes',
            value: [
              'id',
              'type',
              'start',
              'end',
              'position',
              'regions.mpa',
              'regions.eez',
              'regions.fao',
              'regions.rfmo',
              'port_visit.intermediateAnchorage.name',
              'port_visit.intermediateAnchorage.flag',
            ],
          },
          {
            id: 'limit',
            value: 9999999,
          },
          {
            id: 'offset',
            value: 0,
          },
        ],
        params: [],
        endpoint: 'events',
        datasetId: 'public-global-port-visits-c2-events:v20231026',
      },
    ],
    createdAt: '2022-08-31T11:18:12.235Z',
    updatedAt: '2023-10-25T16:55:55.681Z',
  },
]

export default dataviews
