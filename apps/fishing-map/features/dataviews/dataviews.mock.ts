import { Dataview, DataviewCategory } from '@globalfishingwatch/api-types'
import { DEFAULT_PAGINATION_PARAMS } from 'data/config'
import { TEMPLATE_VESSEL_DATAVIEW_SLUG } from 'data/workspaces'

const paginationQuery = Object.entries(DEFAULT_PAGINATION_PARAMS).map(([id, value]) => ({
  id,
  value,
}))

export const dataviews: Dataview[] = [
  {
    id: 372,
    name: 'Fishing map vessel with identity dataset',
    slug: TEMPLATE_VESSEL_DATAVIEW_SLUG,
    description: 'Fishing map vessel with track, info and events',
    app: 'fishing-map',
    config: {
      type: 'TRACK',
      color: '#F95E5E',
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
          id: 'ssvid',
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
        datasetId: 'proto-global-vessel-identity:v20230119',
      },
      {
        query: [
          {
            id: 'vessels',
            value: '',
          },
          // {
          //   id: 'includes',
          //   value: [
          //     'id',
          //     'type',
          //     'start',
          //     'end',
          //     'position',
          //     'regions.mpa',
          //     'regions.eez',
          //     'regions.fao',
          //     'regions.rfmo',
          //   ],
          // },
          ...paginationQuery,
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
          // {
          //   id: 'includes',
          //   value: [
          //     'id',
          //     'type',
          //     'start',
          //     'end',
          //     'position',
          //     'regions.mpa',
          //     'regions.eez',
          //     'regions.fao',
          //     'regions.rfmo',
          //   ],
          // },
          ...paginationQuery,
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
            id: 'encounter-types',
            value: ['carrier-fishing', 'fishing-carrier', 'fishing-support', 'support-fishing'],
          },
          // {
          //   id: 'includes',
          //   value: [
          //     'id',
          //     'type',
          //     'start',
          //     'end',
          //     'position',
          //     'regions.mpa',
          //     'regions.eez',
          //     'regions.fao',
          //     'regions.rfmo',
          //     'encounter.mainVesselAuthorizationStatus',
          //     'encounter.encounteredVesselAuthorizationStatus',
          //     'encounter.vessel.id',
          //     'encounter.vessel.name',
          //     'encounter.vessel.flag',
          //   ],
          // },
          ...paginationQuery,
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
            id: 'confidences',
            value: 4,
          },
          // {
          //   id: 'includes',
          //   value: [
          //     'id',
          //     'type',
          //     'start',
          //     'end',
          //     'position',
          //     'regions.mpa',
          //     'regions.eez',
          //     'regions.fao',
          //     'regions.rfmo',
          //     'port_visit.intermediateAnchorage.name',
          //     'port_visit.intermediateAnchorage.flag',
          //   ],
          // },
          ...paginationQuery,
        ],
        params: [],
        endpoint: 'events',
        datasetId: 'public-global-port-visits-c2-events:v20201001',
      },
    ],
    createdAt: '2023-05-10T13:29:15.527Z',
    updatedAt: '2023-05-25T12:58:58.084Z',
  },
]

export default dataviews
