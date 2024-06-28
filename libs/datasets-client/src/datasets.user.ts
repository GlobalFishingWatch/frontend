import { Dataset, DatasetTypes, Dataview } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from './types'

export function getUserDataviewDataset(dataview?: Dataview | UrlDataviewInstance): Dataset {
  return dataview?.datasets?.find(
    (d) =>
      d.type === DatasetTypes.Context ||
      d.type === DatasetTypes.UserContext ||
      d.type === DatasetTypes.UserTracks ||
      d.type === DatasetTypes.Fourwings || // This is needed for the bq custom datasets
      d.type === DatasetTypes.Events // This is needed for the bq custom datasets
  ) as Dataset
}
