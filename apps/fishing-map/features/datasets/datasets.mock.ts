import { Dataset, DatasetCategory, DatasetTypes, EndpointId } from '@globalfishingwatch/api-types'

export const datasets: Dataset[] = [
  {
    id: 'local-fixed-infrastructure-filtered-v1.1',
    category: DatasetCategory.Context,
    name: 'Fixed infrastructure',
    type: 'user-context-layer:v1' as DatasetTypes.UserContext,
    description: 'SAR identified fixed infrastructure',
    startDate: undefined,
    endDate: '2024-03-01T00:00:00.000Z',
    unit: 'NA',
    subcategory: 'info',
    source: 'user',
    ownerId: 0,
    ownerType: 'super-user',
    configuration: {
      id: '',
      max: 0,
      min: 0,
      scale: 0,
      offset: 0,
      intervals: [],
      idProperty: '',
      geometryType: 'points',
      configurationUI: {
        timeFilterType: 'dateRange',
        startTime: 'structure_start_date',
        endTime: 'structure_end_date',
      },
      valueProperties: ['label'],
      propertyToInclude: 'label',
      disableInteraction: false,
      apiSupportedVersions: ['v3'],
    },
    relatedDatasets: [],
    schema: {
      label: {
        enum: ['oil', 'wind', 'unknown'],
        type: 'string',
      },
      label_confidence: {
        enum: ['high', 'low', 'medium'],
        type: 'string',
      },
      infrastructure_id: {
        type: 'string',
      },
      infrastructure_end_date: {
        type: 'string',
      },
      infrastructure_start_date: {
        type: 'string',
      },
    },
    fieldsAllowed: ['label', 'label_confidence'],
    createdAt: '2024-04-23T09:12:57.032Z',
    endpoints: [
      {
        id: 'context-tiles' as EndpointId.ContextTiles,
        description: 'Endpoint to retrieve tiles from context layers',
        downloadable: true,
        method: 'GET',
        pathTemplate:
          '/v3/datasets/public-fixed-infrastructure-filtered:v1.1/context-layers/{{z}}/{{x}}/{{y}}',
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
        query: [],
      },
      {
        id: 'context-feature',
        description: 'Endpoint to retrieve a feature from a context layer',
        downloadable: true,
        method: 'GET',
        pathTemplate:
          '/v3/datasets/public-fixed-infrastructure-filtered:v1.1/context-layers/{{id}}',
        params: [
          {
            label: 'ID',
            id: 'id',
            type: 'number',
          },
        ],
        query: [
          {
            label: 'Simplify',
            id: 'id',
            type: 'number',
            required: false,
          },
        ],
      },
    ],
  },
]

export default datasets
