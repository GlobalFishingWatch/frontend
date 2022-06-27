import { DatasetTypes, DataviewCategory } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { FISHING_DATAVIEW_ID, PRESENCE_DATAVIEW_ID } from 'data/workspaces'
import { getDatasetLabel } from 'features/datasets/datasets.utils'

export const isActivityDataview = (dataview: UrlDataviewInstance) =>
  dataview.dataviewId === FISHING_DATAVIEW_ID || dataview.category === DataviewCategory.Activity

export const isDetectionsDataview = (dataview: UrlDataviewInstance) =>
  dataview.dataviewId === PRESENCE_DATAVIEW_ID || dataview.category === DataviewCategory.Detections

export const getSourcesOptionsInDataview = (
  dataview: UrlDataviewInstance,
  datasetType = DatasetTypes.Fourwings
) => {
  const datasets = dataview?.datasets?.filter((d) => d.type === datasetType)
  const sourceOptions = datasets?.map((d) => ({ id: d.id, label: getDatasetLabel(d) })) || []
  return sourceOptions.sort((a, b) => a.label.localeCompare(b.label))
}

export const getSourcesSelectedInDataview = (
  dataview: UrlDataviewInstance,
  datasetType = DatasetTypes.Fourwings
) => {
  const sourceOptions = getSourcesOptionsInDataview(dataview, datasetType)
  const sourcesSelected = sourceOptions.filter((sourceOption) =>
    dataview.config?.datasets?.includes(sourceOption.id)
  )
  return sourcesSelected
}

export const areAllSourcesSelectedInDataview = (
  dataview: UrlDataviewInstance,
  datasetType = DatasetTypes.Fourwings
) => {
  const sourceOptions = getSourcesOptionsInDataview(dataview, datasetType)
  const allSelected = sourceOptions.every((sourceOption) =>
    dataview.config?.datasets?.includes(sourceOption.id)
  )
  return allSelected
}
