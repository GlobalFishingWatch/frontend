import { Dataview, DataviewCategory } from '@globalfishingwatch/api-types'
// import { GeneratorType, Group } from '@globalfishingwatch/layer-composer'
// import { TEMPLATE_HEATMAP_STATIC_DATAVIEW_SLUG } from 'data/workspaces'

export const dataviews: Dataview[] = [
  {
    id: 171,
    name: 'Fishing map vessel with identity dataset',
    slug: 'fishing-map-vessel-track',
    description: 'Fishing map vessel with track, info and events',
    app: 'fishing-map',
    config: {
      type: 'TRACK',
      color: '#F95E5E',
      showIcons: false,
      showAuthorizationStatus: false,
      pointsToSegmentsSwitchLevel: 9,
    },
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
        datasetId: 'public-global-gaps-events:v20231026',
      },
    ],
  },
]

export default dataviews
