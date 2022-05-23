import {
  Dataset,
  DatasetCategory,
  DatasetStatus,
  DatasetTypes,
} from '@globalfishingwatch/api-types'

export const SKYLIGHT_ENCOUNTERS_DATASET_ID = 'skylight-encounters'

export const datasets: Dataset[] = [
  {
    alias: null,
    id: SKYLIGHT_ENCOUNTERS_DATASET_ID,
    name: 'Skylight encounters',
    type: DatasetTypes.TemporalContext,
    description: 'Skylight rendezvous encounter events',
    startDate: '2015-01-01T00:00:00.000Z',
    endDate: null,
    unit: null,
    status: DatasetStatus.Done,
    importLogs: null,
    category: DatasetCategory.RealTime,
    subcategory: 'sar',
    source: 'Skylight',
    ownerId: 46,
    ownerType: 'user',
    configuration: {},
    createdAt: '2022-05-12T08:38:22.668Z',
    relatedDatasets: [],
    schema: {},
    fieldsAllowed: [],
  },
]

export default datasets
