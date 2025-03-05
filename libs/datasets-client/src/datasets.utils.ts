import { DateTime } from 'luxon'

import type { Dataset, Dataview } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'

import type { UrlDataviewInstance } from './types'

export const removeDatasetVersion = (datasetId: string) => {
  return datasetId ? datasetId?.split(':')[0] : ''
}

export const getDatasetVersion = (datasetId: string) => {
  return datasetId ? datasetId?.split(':')[1] : ''
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

export const getDatasetsExtent = <Format = 'string' | 'number'>(
  datasets: Dataset[] | undefined,
  { format }: { format: 'isoString' | 'timestamp' } = { format: 'isoString' }
) => {
  const startRanges = datasets?.flatMap((d) =>
    d?.startDate ? DateTime.fromISO(d.startDate, { zone: 'utc' }).toMillis() : []
  )
  const endRanges = datasets?.flatMap((d) =>
    d?.endDate ? DateTime.fromISO(d.endDate, { zone: 'utc' }).plus({ day: 1 }).toMillis() : []
  )
  const extentStartDate = startRanges?.length
    ? DateTime.fromMillis(Math.min(...startRanges), { zone: 'utc' })
    : undefined
  let extentStart
  if (extentStartDate) {
    extentStart = format === 'isoString' ? extentStartDate.toISO() : extentStartDate.toMillis()
  }
  const extentEndDate = endRanges?.length
    ? DateTime.fromMillis(Math.max(...endRanges), { zone: 'utc' })
    : undefined
  let extentEnd
  if (extentEndDate) {
    extentEnd = format === 'isoString' ? extentEndDate.toISO() : extentEndDate.toMillis()
  }
  return { extentStart: extentStart as Format, extentEnd: extentEnd as Format }
}
