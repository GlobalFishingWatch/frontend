import {
  DRAW_DATASET_SOURCE,
  Dataset,
  DatasetGeometryType,
  DatasetTypes,
  Dataview,
} from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { getDatasetConfigurationProperty } from 'features/datasets/upload/datasets-upload.utils'

export function getUserDataviewDataset(dataview?: Dataview | UrlDataviewInstance): Dataset {
  return dataview?.datasets?.find(
    (d) =>
      d.type === DatasetTypes.Context ||
      d.type === DatasetTypes.UserContext ||
      d.type === DatasetTypes.UserTracks
  ) as Dataset
}

export function getDatasetGeometryType(dataset?: Dataset): DatasetGeometryType {
  if (!dataset) {
    return '' as DatasetGeometryType
  }
  if (dataset?.source === DRAW_DATASET_SOURCE) {
    return 'draw'
  }
  return getDatasetConfigurationProperty({
    datasetMetadata: dataset,
    property: 'geometryType',
  })
}
