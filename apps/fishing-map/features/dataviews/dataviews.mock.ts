import { Dataview, DataviewType, DataviewCategory } from '@globalfishingwatch/api-types'
import { GRATICULES_DATAVIEW_SLUG } from 'data/workspaces'

// TODO:deck remove this and use the real dataview slug from workspaces.ts
export const MOCKED_VESSEL_DATAVIEW_SLUG = 'fishing-map-vessel-track-v-3-deck'

export const dataviews: Dataview[] = [
  {
    id: 9999191,
    name: 'Graticules',
    slug: GRATICULES_DATAVIEW_SLUG,
    app: 'fishing-map',
    category: DataviewCategory.Context,
    config: {
      type: DataviewType.Graticules,
      color: '#FCA26F',
      layers: [
        {
          id: 'graticules',
          dataset: 'public-graticules',
        },
      ],
    },
    datasetsConfig: [
      {
        query: [],
        params: [],
        endpoint: 'context-tiles',
        datasetId: 'public-graticules',
      },
    ],
    description: 'Graticules',
    createdAt: '2023-01-16T15:17:31.541Z',
    updatedAt: '2023-02-21T10:18:14.884Z',
  },
  {
    id: 99999,
    name: 'Fishing map vessel with identity dataset',
    slug: MOCKED_VESSEL_DATAVIEW_SLUG,
    app: 'fishing-map',
    category: DataviewCategory.Vessels,
    config: {
      type: 'TRACK',
      color: '#F95E5E',
    },
    datasetsConfig: [
      {
        query: [
          { id: 'binary', value: true },
          { id: 'wrap-longitudes', value: false },
          { id: 'fields', value: ['LONLAT', 'TIMESTAMP', 'SPEED', 'ELEVATION'] },
          { id: 'format', value: 'VALUE_ARRAY' },
        ],
        params: [{ id: 'vesselId', value: '' }],
        endpoint: 'tracks',
        datasetId: 'public-global-all-tracks:v20201001',
      },
      {
        params: [{ id: 'vesselId', value: '' }],
        endpoint: 'vessel',
        datasetId: 'public-global-vessel-identity:v3.0',
      },
      {
        query: [
          { id: 'vessels', value: '' },
          { id: 'vessel-types', value: ['FISHING'] },
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
          { id: 'limit', value: 9999999 },
          { id: 'offset', value: 0 },
        ],
        params: [],
        endpoint: 'events',
        datasetId: 'public-global-fishing-events:v3.0',
      },
      {
        query: [
          { id: 'vessels', value: '' },
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
          { id: 'limit', value: 9999999 },
          { id: 'offset', value: 0 },
        ],
        params: [],
        endpoint: 'events',
        datasetId: 'public-global-loitering-events:v3.0',
      },
      {
        query: [
          { id: 'vessels', value: '' },
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
          { id: 'limit', value: 9999999 },
          { id: 'offset', value: 0 },
        ],
        params: [],
        endpoint: 'events',
        datasetId: 'public-global-encounters-events:v3.0',
      },
      {
        query: [
          { id: 'vessels', value: '' },
          { id: 'confidences', value: [4] },
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
          { id: 'limit', value: 9999999 },
          { id: 'offset', value: 0 },
        ],
        params: [],
        endpoint: 'events',
        datasetId: 'public-global-port-visits-events:v3.0',
      },
    ],
    description: 'Fishing map vessel with track, info and events in pipe 3',
    createdAt: '2024-05-16T07:24:11.534Z',
    updatedAt: '2024-05-16T08:21:11.679Z',
  },
]

export default dataviews
