import { DateTime } from 'luxon'

import type { Dataset, DatasetCategory, Dataview, VesselType } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'

import { DATASET_FULL_PREFIX, DATASET_PRIVATE_PREFIX, DATASET_PUBLIC_PREFIX } from './constants'
import type { UrlDataviewInstance } from './types'

export const removeDatasetVersion = (datasetId: string) => {
  return datasetId ? datasetId?.split(':')[0] : ''
}

export const getDatasetVersion = (datasetId: string) => {
  return datasetId ? datasetId?.split(':')[1] : ''
}

const parseDatasetVersion = (datasetId: string) =>
  getDatasetVersion(datasetId)?.replace(/^v/, '').split('.').map(Number) ?? []

/**
 * the API reports pre-released datasets as deprecated by the current latest version
 */
export const getIsDatasetVersionDowngrade = (deprecatedId: string, latestId: string) => {
  if (!deprecatedId || !latestId) {
    return false
  }
  if (removeDatasetVersion(deprecatedId) !== removeDatasetVersion(latestId)) {
    return false
  }
  const deprecatedVersion = parseDatasetVersion(deprecatedId)
  const latestVersion = parseDatasetVersion(latestId)
  if (
    !deprecatedVersion.length ||
    !latestVersion.length ||
    deprecatedVersion.some(isNaN) ||
    latestVersion.some(isNaN)
  ) {
    return false
  }
  for (let i = 0; i < Math.max(deprecatedVersion.length, latestVersion.length); i++) {
    const diff = (deprecatedVersion[i] ?? 0) - (latestVersion[i] ?? 0)
    if (diff) {
      return diff > 0
    }
  }
  return false
}

export const replaceDatasetPublicToPrivate = (dataset: string): string => {
  return dataset.startsWith(DATASET_PUBLIC_PREFIX)
    ? dataset.replace(DATASET_PUBLIC_PREFIX, DATASET_PRIVATE_PREFIX)
    : dataset
}

export const replaceDatasetPrivateToPublic = (dataset: string): string => {
  return dataset.startsWith(DATASET_PRIVATE_PREFIX)
    ? dataset.replace(DATASET_PRIVATE_PREFIX, DATASET_PUBLIC_PREFIX)
    : dataset
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

export const getDatasetsLatestEndDate = (
  datasets: Dataset[],
  datasetCategory?: DatasetCategory
): string | undefined => {
  const datasetsWithEndDate = datasets.filter((dataset) => dataset.endDate)
  if (!datasetsWithEndDate.length) {
    return undefined
  }
  const latestDate = datasetsWithEndDate.reduce((acc, dataset) => {
    const endDate = dataset.endDate as string
    if (datasetCategory && dataset.category !== datasetCategory) {
      return acc
    }
    return endDate > acc ? endDate : acc
  }, datasetsWithEndDate?.[0].endDate || '')
  return latestDate
}

type RelatedDatasetByTypeParams = {
  fullDatasetAllowed?: boolean
  vesselType?: VesselType
}

export const getRelatedDatasetByType = (
  dataset?: Dataset,
  datasetType?: DatasetTypes,
  { fullDatasetAllowed = false } = {} as RelatedDatasetByTypeParams
) => {
  if (fullDatasetAllowed) {
    const fullDataset = dataset?.relatedDatasets?.find(
      (relatedDataset) =>
        relatedDataset.type === datasetType && relatedDataset.id.startsWith(DATASET_FULL_PREFIX)
    )
    if (fullDataset) {
      return fullDataset
    }
  }
  return dataset?.relatedDatasets?.find((relatedDataset) => relatedDataset.type === datasetType)
}

export const getRelatedDatasetsByType = (
  dataset?: Dataset,
  datasetType?: DatasetTypes,
  fullDatasetAllowed = false
) => {
  if (fullDatasetAllowed) {
    const fullDataset = dataset?.relatedDatasets?.filter(
      (relatedDataset) =>
        relatedDataset.type === datasetType && relatedDataset.id.startsWith(DATASET_FULL_PREFIX)
    )
    if (fullDataset && fullDataset.length > 0) {
      return fullDataset
    }
  }
  return dataset?.relatedDatasets?.filter((relatedDataset) => relatedDataset.type === datasetType)
}

export const VMS_DATASET_ID = 'VMS'
export const getIsVMSDataset = (datasetId: string): boolean => {
  return datasetId?.toUpperCase().includes(VMS_DATASET_ID)
}
export type DatasetEventSource = typeof VMS_DATASET_ID | 'AIS'
export const getDatasetSource = (datasetId?: string): DatasetEventSource | undefined => {
  if (!datasetId) {
    return undefined
  }
  return getIsVMSDataset(datasetId) ? VMS_DATASET_ID : 'AIS'
}
