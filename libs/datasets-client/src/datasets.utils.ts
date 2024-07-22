import { Dataset, DatasetTypes, Dataview } from '@globalfishingwatch/api-types'
import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { UrlDataviewInstance } from './types'

export const removeDatasetVersion = (datasetId: string) => {
  return datasetId ? datasetId?.split(':')[0] : ''
}

export function findDatasetByType(datasets = [] as Dataset[], type: DatasetTypes) {
  return type ? datasets?.find((d) => d.type === type) : undefined
}

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

export const getDatasetsExtent = (
  datasets: Dataset[] | undefined,
  { format }: { format: 'isoString' | 'timestamp' } = { format: 'isoString' }
) => {
  const startRanges = datasets?.flatMap((d) =>
    d?.startDate ? new Date(d.startDate).getTime() : []
  )
  const endRanges = datasets?.flatMap((d) => (d?.endDate ? new Date(d.endDate).getTime() : []))
  const extentStartDate = startRanges?.length ? getUTCDate(Math.min(...startRanges)) : undefined
  let extentStart
  if (extentStartDate) {
    extentStart = format === 'isoString' ? extentStartDate.toISOString() : extentStartDate.getTime()
  }
  const extentEndDate = endRanges?.length ? getUTCDate(Math.max(...endRanges)) : undefined
  let extentEnd
  if (extentEndDate) {
    extentEnd = format === 'isoString' ? extentEndDate.toISOString() : extentEndDate.getTime()
  }

  return { extentStart: extentStart as string | number, extentEnd: extentEnd as string | number }
}
