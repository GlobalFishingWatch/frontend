export const eezDatasets = [
  {
    alias: null,
    id: 'public-eez-areas',
    name: 'EEZ (marineregions.org)',
    type: 'user-context-layer:v1',
    description:
      'Flanders Marine Institute (2019). Maritime Boundaries Geodatabase: Maritime Boundaries and Exclusive Economic Zones (200NM), version 11. Source: marineregions.org',
    startDate: null,
    endDate: null,
    unit: null,
    status: 'done',
    importLogs: null,
    category: 'context-layer',
    subcategory: null,
    source:
      "<a href='https://www.marineregions.org' target='_blank' rel='noopener noreferrer'>Marine Regions</a>",
    ownerId: 0,
    ownerType: 'gfw',
    configuration: {
      format: 'geojson',
      filePath: 'dataset-upload-tmp/8df15afd-09c1-4916-82d6-50d89a30e7a2',
      tableName: 'eez-areas',
      translate: true,
      propertyToInclude: 'geoname',
    },
    createdAt: '2020-11-05T13:07:15.754Z',
    relatedDatasets: null,
    schema: null,
    fieldsAllowed: null,
    endpoints: [
      {
        id: 'user-context-tiles',
        description: 'Endpoint to retrieve tiles from user context layers',
        downloadable: true,
        method: 'GET',
        pathTemplate: '/v1/datasets/public-eez-areas/user-context-layer-v1/{{z}}/{{x}}/{{y}}',
        params: [
          {
            label: 'Z',
            id: 'z',
            type: 'number',
          },
          {
            label: 'X',
            id: 'x',
            type: 'number',
          },
          {
            label: 'Y',
            id: 'y',
            type: 'number',
          },
        ],
        query: [
          {
            label: 'Properties',
            id: 'properties',
            type: 'string',
            array: true,
          },
        ],
      },
    ],
  },
  {
    alias: null,
    id: 'public-eez-boundaries-shp',
    name: 'Areas boundaries for eez',
    type: 'user-context-layer:v1',
    description:
      'Flanders Marine Institute (2019). Maritime Boundaries Geodatabase: Maritime Boundaries and Exclusive Economic Zones (200NM), version 11. Source: marineregions.org',
    startDate: null,
    endDate: null,
    unit: null,
    status: 'done',
    importLogs: null,
    category: 'context-layer',
    subcategory: null,
    source:
      "<a href='https://www.marineregions.org' target='_blank' rel='noopener noreferrer'>Marine Regions</a>",
    ownerId: 0,
    ownerType: 'user',
    configuration: {
      srid: '3857',
      filePath: 'dataset-upload-tmp/fe472d26-fecf-44b9-8097-f03f7f24d5e7',
      tableName: 'eez-boundaries-shp',
    },
    createdAt: '2020-12-16T15:30:17.141Z',
    relatedDatasets: null,
    schema: {},
    fieldsAllowed: [],
    endpoints: [
      {
        id: 'user-context-tiles',
        description: 'Endpoint to retrieve tiles from user context layers',
        downloadable: true,
        method: 'GET',
        pathTemplate:
          '/v1/datasets/public-eez-boundaries-shp/user-context-layer-v1/{{z}}/{{x}}/{{y}}',
        params: [
          {
            label: 'Z',
            id: 'z',
            type: 'number',
          },
          {
            label: 'X',
            id: 'x',
            type: 'number',
          },
          {
            label: 'Y',
            id: 'y',
            type: 'number',
          },
        ],
        query: [
          {
            label: 'Properties',
            id: 'properties',
            type: 'string',
            array: true,
          },
        ],
      },
    ],
  },
]
