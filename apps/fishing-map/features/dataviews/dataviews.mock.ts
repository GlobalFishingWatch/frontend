import { Dataview, DataviewCategory } from '@globalfishingwatch/api-types'
import { CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_ID, TEMPLATE_VESSEL_DATAVIEW_ID } from 'data/workspaces'

export const dataviews: Dataview[] = [
  {
    id: TEMPLATE_VESSEL_DATAVIEW_ID,
    name: 'Vessel',
    slug: null,
    description: 'Vessel with track, info and events',
    app: 'fishing-map',
    config: {
      type: 'TRACK',
      color: '#F95E5E',
      showIcons: false,
      showAuthorizationStatus: false,
      pointsToSegmentsSwitchLevel: 9,
    },
    infoConfig: {
      fields: [
        {
          id: 'flag',
          type: 'flag',
          guest: true,
          mandatory: true,
        },
        {
          id: 'imo',
          type: 'number',
          guest: true,
          mandatory: true,
        },
        {
          id: 'mmsi',
          type: 'number',
          guest: true,
          mandatory: true,
        },
        {
          id: 'callsign',
          type: 'number',
          guest: true,
          mandatory: true,
        },
        {
          id: 'registeredGearType',
          type: 'string',
          guest: true,
        },
        {
          id: 'widthRange',
          type: 'string',
        },
        {
          id: 'lengthRange',
          type: 'string',
        },
        {
          id: 'grossTonnageRange',
          type: 'string',
        },
        {
          id: 'firstTransmissionDate',
          type: 'date',
          guest: true,
        },
        {
          id: 'lastTransmissionDate',
          type: 'date',
          guest: true,
        },
        {
          id: 'nationalId',
          type: 'string',
        },
        {
          id: 'geartype',
          type: 'fleet',
          mandatory: true,
        },
        {
          id: 'casco',
          type: 'string',
        },
        {
          id: 'fleet',
          type: 'fleet',
        },
        {
          id: 'length',
          type: 'string',
        },
        {
          id: 'beam',
          type: 'string',
        },
        {
          id: 'capacity',
          type: 'string',
        },
        {
          id: 'targetSpecies',
          type: 'string',
        },
        {
          id: 'mainGear',
          type: 'string',
        },
        {
          id: 'licenseCode',
          type: 'string',
        },
        {
          id: 'licensDescription',
          type: 'string',
        },
        {
          id: 'fishingZone',
          type: 'string',
        },
        {
          id: 'codMarinha',
          type: 'string',
        },
        {
          id: 'dataset',
          type: 'string',
          guest: true,
          mandatory: true,
        },
      ],
    },
    eventsConfig: null,
    filtersConfig: null,
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
            value: 'lonlat,timestamp',
          },
          {
            id: 'format',
            value: 'valueArray',
          },
        ],
        params: [
          {
            id: 'vesselId',
            value: '',
          },
        ],
        endpoint: 'tracks',
        datasetId: 'public-global-fishing-tracks:v20201001',
      },
      {
        params: [
          {
            id: 'vesselId',
            value: '',
          },
        ],
        endpoint: 'vessel',
        datasetId: 'public-global-fishing-vessels:v20201001',
      },
      {
        params: [
          {
            id: 'vesselId',
            value: '',
          },
        ],
        endpoint: 'vessel',
        datasetId: 'public-global-carrier-vessels:v20201001',
      },
      {
        query: [
          {
            id: 'vessels',
            value: '',
          },
          {
            id: 'summary',
            value: true,
          },
        ],
        params: [],
        endpoint: 'events',
        datasetId: 'public-global-fishing-events:v20201001',
      },
      {
        query: [
          {
            id: 'vessels',
            value: '',
          },
          {
            id: 'summary',
            value: true,
          },
        ],
        params: [],
        endpoint: 'events',
        datasetId: 'public-global-loitering-events-carriers:v20201001',
      },
      {
        query: [
          {
            id: 'vessels',
            value: '',
          },
          {
            id: 'summary',
            value: true,
          },
        ],
        params: [],
        endpoint: 'events',
        datasetId: 'public-global-encounters-events:v20201001',
      },
      {
        query: [
          {
            id: 'vessels',
            value: '',
          },
          {
            id: 'summary',
            value: true,
          },
          {
            id: 'confidences',
            value: 4,
          },
        ],
        params: [],
        endpoint: 'events',
        datasetId: 'public-global-port-visits-c2-events:v20201001',
      },
    ],
    createdAt: '2020-10-26T09:54:50.313Z',
    updatedAt: '2021-10-21T09:07:59.114Z',
  },
  {
    id: CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_ID,
    name: 'Encounter cluster events',
    slug: null,
    description: '',
    app: 'fishing-map',
    config: {
      type: 'TILE_CLUSTER',
      color: '#FAE9A0',
    },
    infoConfig: null,
    eventsConfig: null,
    filtersConfig: null,
    category: DataviewCategory.Events,
    datasetsConfig: [
      {
        query: [
          // {
          //   id: 'encounterTypes',
          //   value: ['carrier-fishing', 'fishing-carrier', 'fishing-support', 'support-fishing'],
          // },
        ],
        params: [],
        endpoint: 'events-cluster-tiles',
        datasetId: 'public-global-encounters-events:v20201001',
      },
    ],
    createdAt: '2021-03-22T15:36:44.423Z',
    updatedAt: '2021-10-21T10:28:20.207Z',
  },
]

export default dataviews
