import { Dataview, DataviewCategory } from '@globalfishingwatch/api-types'
// import { GeneratorType, Group } from '@globalfishingwatch/layer-composer'
// import { TEMPLATE_HEATMAP_STATIC_DATAVIEW_SLUG } from 'data/workspaces'

export const dataviews: Dataview[] = [
  {
    id: 341,
    name: 'Fishing map vessel with identity dataset',
    slug: 'fishing-map-vessel-track-v3',
    app: 'fishing-map',
    category: DataviewCategory.Vessels,
    config: {
      type: 'TRACK',
      color: '#F95E5E',
    },
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
        datasetId: 'public-global-vessel-identity:v3.0',
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

        datasetId: 'public-global-fishing-events:v3.0',
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
        datasetId: 'public-global-loitering-events:v3.0',
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
        datasetId: 'public-global-encounters-events:v3.0',
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
        datasetId: 'public-global-port-visits-events:v3.0',
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
        datasetId: 'public-global-gaps-events:v3.0',
      },
    ],
    description: 'Fishing map vessel with track, info and events',
    createdAt: '2023-01-16T15:35:34.588Z',
    updatedAt: '2024-04-23T15:04:50.720Z',
  },
  {
    id: 361,
    name: 'Apparent fishing effort',
    slug: 'apparent-fishing-effort-v3',
    app: 'fishing-map',
    category: DataviewCategory.Activity,
    config: {
      type: 'HEATMAP_ANIMATED',
      color: '#00FFBC',
      datasets: ['public-global-fishing-effort:v3.0'],
      colorRamp: 'teal',
    },
    datasetsConfig: [
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'public-global-fishing-effort:v3.0',
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
    description: 'Apparent fishing effort',
    createdAt: '2023-01-16T15:35:59.997Z',
    updatedAt: '2023-10-18T16:12:10.570Z',
  },
]

export default dataviews
