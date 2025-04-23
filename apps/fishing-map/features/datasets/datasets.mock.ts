import type { Dataset } from '@globalfishingwatch/api-types'
import {
  DatasetCategory,
  DatasetStatus,
  DatasetTypes,
  EndpointId,
} from '@globalfishingwatch/api-types'

export const PM_LABELS_DATASET_ID = 'pm-labels'

const datasets: Dataset[] = [
  {
    alias: null,
    id: PM_LABELS_DATASET_ID,
    name: 'PM Labels',
    type: DatasetTypes.PMTiles,
    description: 'PMTiles labels',
    endDate: '2023-05-01T00:00:00.000Z',
    status: DatasetStatus.Done,
    importLogs: '',
    category: DatasetCategory.Context,
    // subcategory: DatasetSubcategory.User,
    source:
      "<a href='https://www.marineregions.org' target='_blank' rel='noopener noreferrer'>Marine Regions</a>",
    ownerId: 0,
    ownerType: 'super-user',
    configuration: {
      id: '',
      max: 0,
      min: 0,
      ttl: 0,
      band: '',
      srid: 3857,
      scale: 0,
      table: 'eez-areas',
      fields: [],
      images: null,
      offset: 0,
      maxZoom: 12,
      numBytes: null,
      intervals: [],
      tileScale: 0,
      translate: true,
      idProperty: 'MRGID_EEZ',
      indexBoost: null,
      tileOffset: 0,
      insightSources: [],
      configurationUI: undefined,
      valueProperties: ['GEONAME'],
      propertyToInclude: '',
      disableInteraction: false,
      apiSupportedVersions: ['v2', 'v3'],
    },
    relatedDatasets: [],
    schema: {},
    fieldsAllowed: [],
    createdAt: '2023-01-16T15:58:52.698Z',
    endpoints: [
      {
        id: EndpointId.PmTiles,
        description: 'Endpoint to retrieve tiles from pm tiles dataset',
        downloadable: true,
        method: 'GET',
        // pathTemplate: '/v3/datasets/public-eez-areas/pm-tiles/{{z}}/{{x}}/{{y}}',
        pathTemplate:
          'https://storage.googleapis.com/public-tiles/locations-basemap/locations_new.pmtile',
        params: [],
        query: [],
      },
    ],
  },
]

export default datasets
