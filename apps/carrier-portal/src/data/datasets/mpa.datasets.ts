import {
  Dataset,
  DatasetCategory,
  DatasetStatus,
  DatasetTypes,
  EndpointId,
} from '@globalfishingwatch/api-types'

export const mpaDatasets: Dataset[] = [
  {
    alias: null,
    id: 'public-mpa-all',
    name: 'Marine Protected Areas (WDPA)',
    type: DatasetTypes.Context,
    description:
      'The term Marine Protected Areas include marine reserves, fully protected marine areas, no-take zones, marine sanctuaries, ocean sanctuaries, marine parks, locally managed marine areas, to name a few. Many of these have quite different levels of protection, and the range of activities allowed or prohibited within their boundaries varies considerably too. Source: World Database on Protected Areas (WDPA)',
    startDate: null,
    endDate: null,
    unit: null,
    status: DatasetStatus.Done,
    importLogs:
      'Not recognize srid for GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]]. Using srid 4326',
    category: DatasetCategory.Context,
    subcategory: null,
    source:
      "<a href='https://www.protectedplanet.net/' target='_blank' rel='noopener noreferrer'>Protected Planet WDPA</a>",
    ownerId: 0,
    ownerType: 'gfw',
    configuration: {
      srid: '3857',
      filePath: 'dataset-upload-tmp/dcbed0b8-9f57-46d3-8229-a41ddd248f3e',
      tableName: 'mpa-all',
      translate: true,
      apiSupportedVersions: ['v1', 'v2'],
    },
    createdAt: '2020-11-11T18:32:30.840Z',
    relatedDatasets: null,
    schema: null,
    fieldsAllowed: null,
    endpoints: [
      {
        id: EndpointId.UserContextTiles,
        description: 'Endpoint to retrieve tiles from user context layers',
        downloadable: true,
        method: 'GET',
        pathTemplate: '/v2/datasets/public-mpa-all/user-context-layer-v1/{{z}}/{{x}}/{{y}}',
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
