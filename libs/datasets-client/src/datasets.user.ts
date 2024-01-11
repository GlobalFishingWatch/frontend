import { Dataset, DatasetTypes, Dataview } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from './types'

export function getUserDataviewDataset(dataview?: Dataview | UrlDataviewInstance): Dataset {
  return dataview?.datasets?.find(
    (d) =>
      d.type === DatasetTypes.Context ||
      d.type === DatasetTypes.UserContext ||
      d.type === DatasetTypes.UserTracks
  ) as Dataset
}
