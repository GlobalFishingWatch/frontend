import type { Dataset } from '@globalfishingwatch/api-types'
import {
  DatasetCategory,
  DatasetStatus,
  DatasetSubCategory,
  DatasetTypes,
  DRAW_DATASET_SOURCE,
} from '@globalfishingwatch/api-types'

export const USER_POLYGON_DATASET_ID = 'public-hawaii-1771993699463'
export const USER_POLYGON_DATASET: Dataset = {
  alias: null,
  id: USER_POLYGON_DATASET_ID,
  name: 'Hawaii',
  type: DatasetTypes.UserContext,
  description: 'Hawaii',
  unit: 'NA',
  status: DatasetStatus.Done,
  category: DatasetCategory.Context,
  subcategory: DatasetSubCategory.User,
  source: DRAW_DATASET_SOURCE,
  ownerId: 389,
  ownerType: 'user',
  configuration: {
    apiSupportedVersions: ['v3'],
    frontend: {
      translate: false,
      geometryType: 'polygons',
    },
    userContextLayerV1: {
      filePath: 'dataset-upload-tmp/d3477389-d453-402b-b048-274bc0247b87',
      format: 'GEOJSON',
      idProperty: '',
      valuePropertyId: 'draw_id',
    },
  },
  relatedDatasets: [],
  filters: {},
  createdAt: '2026-02-25T04:28:20.143Z',
  documentation: {},
}
