import { Dataview, DataviewCategory } from '@globalfishingwatch/api-types'
// import { GeneratorType, Group } from '@globalfishingwatch/layer-composer'
// import { TEMPLATE_HEATMAP_STATIC_DATAVIEW_SLUG } from 'data/workspaces'

export const dataviews: Dataview[] = [
  {
    id: 341,
    name: 'Fishing map vessel with identity dataset',
    slug: 'fishing-map-vessel-track',
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
]

export default dataviews
