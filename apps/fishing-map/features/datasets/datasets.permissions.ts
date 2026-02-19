import type { DataviewDatasetConfig, UserPermission } from '@globalfishingwatch/api-types'
import { DatasetCategory, DataviewType, EndpointId } from '@globalfishingwatch/api-types'
import {
  checkDatasetDownloadTrackPermission,
  checkDatasetReportPermission,
} from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { getActiveDatasetsInDataview } from 'features/datasets/datasets.utils'

export const hasDatasetConfigVesselData = (datasetConfig: DataviewDatasetConfig) => {
  return (
    datasetConfig?.query?.find((q) => q.id === 'vessels')?.value ||
    datasetConfig?.params?.find((q) => q.id === 'vesselId')?.value
  )
}

export const getActivityDatasetsReportSupported = (
  dataviews: UrlDataviewInstance<DataviewType>[],
  permissions: UserPermission[] = []
) => {
  return dataviews.flatMap((dataview) => {
    const datasets = getActiveDatasetsInDataview(dataview)?.flatMap((d) => d?.id || []) || []
    const permissionDatasetsIds: string[] = datasets.filter((datasetId: string) => {
      const valid = datasetId ? checkDatasetReportPermission(datasetId, permissions) : false
      return valid
    })
    return dataview.datasets
      ?.filter(
        (d) =>
          permissionDatasetsIds.includes(d.id) &&
          (d.category === DatasetCategory.Activity ||
            d.category === DatasetCategory.Detections ||
            d.category === DatasetCategory.Event ||
            (d.category === DatasetCategory.Environment &&
              dataview.config?.type === DataviewType.HeatmapAnimated))
      )
      .map((d) => d.id)
  })
}

export const getVesselDatasetsDownloadTrackSupported = (
  dataview: UrlDataviewInstance<DataviewType>,
  permissions: UserPermission[] = []
) => {
  const datasets = (dataview?.datasetsConfig || [])
    .filter(
      (datasetConfig) =>
        datasetConfig.endpoint === EndpointId.Tracks && hasDatasetConfigVesselData(datasetConfig)
    )
    .filter((dataset) => {
      if (!dataset) return false
      return checkDatasetDownloadTrackPermission(dataset.datasetId, permissions)
    })
  return datasets
}

export const getDatasetsReportSupported = (
  dataviews: UrlDataviewInstance<DataviewType>[],
  permissions: UserPermission[] = []
) => {
  const dataviewDatasets = dataviews
    .flatMap((dataview) => getActiveDatasetsInDataview(dataview) || [])
    .map((d) => d.id)
  const datasetsDownloadSupported = getActivityDatasetsReportSupported(dataviews, permissions)
  return dataviewDatasets.filter((dataset) => datasetsDownloadSupported.includes(dataset))
}

export const getDatasetsReportNotSupported = (
  dataviews: UrlDataviewInstance<DataviewType>[],
  permissions: UserPermission[] = []
) => {
  const dataviewDatasets = dataviews
    .flatMap((dataview) => getActiveDatasetsInDataview(dataview) || [])
    .map((d) => d.id)
  const datasetsDownloadSupported = getActivityDatasetsReportSupported(dataviews, permissions)
  return dataviewDatasets.filter((dataset) => !datasetsDownloadSupported.includes(dataset))
}
