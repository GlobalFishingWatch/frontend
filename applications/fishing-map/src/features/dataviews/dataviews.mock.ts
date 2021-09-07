import { Dataview } from '@globalfishingwatch/api-types/dist'

export const dataviews: Dataview[] = [
  {
    id: 92,
    name: 'Vessel',
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
          id: 'dataset',
          type: 'string',
          guest: true,
          mandatory: true,
        },
      ],
    },
    category: 'vessels',
    datasetsConfig: [
      {
        query: [
          {
            id: 'binary',
            value: true,
          },
          {
            id: 'wrapLongitudes',
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
        endpoint: 'carriers-tracks',
        datasetId: 'public-global-fishing-tracks:v20201001',
      },
      {
        params: [
          {
            id: 'vesselId',
            value: '',
          },
        ],
        endpoint: 'carriers-vessel',
        datasetId: 'public-global-fishing-vessels:v20201001',
      },
      {
        params: [
          {
            id: 'vesselId',
            value: '',
          },
        ],
        endpoint: 'carriers-vessel',
        datasetId: 'private-global-presence-vessels:v20201001',
      },
      {
        params: [
          {
            id: 'vesselId',
            value: '',
          },
        ],
        endpoint: 'carriers-vessel',
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
        endpoint: 'carriers-events',
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
        endpoint: 'carriers-events',
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
        endpoint: 'carriers-events',
        datasetId: 'public-global-encounters-events:v20201001',
      },
    ],
    createdAt: '2020-10-26T09:54:50.313Z',
    updatedAt: '2021-09-01T09:01:36.105Z',
  } as any,
]

export default dataviews
