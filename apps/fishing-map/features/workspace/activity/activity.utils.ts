import { DatasetTypes } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { isActivityDataview, isDetectionsDataview } from '@globalfishingwatch/dataviews-client'

import {
  FISHING_DATAVIEW_SLUG_AIS,
  FISHING_DATAVIEW_SLUG_ALL,
  FISHING_DATAVIEW_SLUG_VMS,
  PRESENCE_DATAVIEW_SLUG,
} from 'data/workspaces'
import { getDatasetLabel } from 'features/datasets/datasets.utils'

export const isDefaultActivityDataview = (dataview: UrlDataviewInstance) =>
  dataview.dataviewId === FISHING_DATAVIEW_SLUG_ALL ||
  dataview.dataviewId === FISHING_DATAVIEW_SLUG_AIS ||
  dataview.dataviewId === FISHING_DATAVIEW_SLUG_VMS ||
  isActivityDataview(dataview)

export const isDefaultDetectionsDataview = (dataview: UrlDataviewInstance) =>
  dataview.dataviewId === PRESENCE_DATAVIEW_SLUG || isDetectionsDataview(dataview)

const DEFAULT_SOURCES_DATASET_TYPES = [DatasetTypes.Fourwings, DatasetTypes.Events]

export const getSourcesOptionsInDataview = (
  dataview: UrlDataviewInstance,
  datasetTypes = DEFAULT_SOURCES_DATASET_TYPES
) => {
  const datasets = dataview?.datasets?.filter((d) => datasetTypes.includes(d.type))
  const sourceOptions = datasets?.map((d) => ({ id: d.id, label: getDatasetLabel(d) })) || []
  return sourceOptions.sort((a, b) => a.label.localeCompare(b.label))
}

export const getSourcesSelectedInDataview = (
  dataview: UrlDataviewInstance,
  datasetTypes = DEFAULT_SOURCES_DATASET_TYPES
) => {
  const sourceOptions = getSourcesOptionsInDataview(dataview, datasetTypes)

  const sourcesSelected = sourceOptions.filter(
    (sourceOption) =>
      !dataview.config?.datasets || dataview.config?.datasets?.includes(sourceOption.id)
  )
  return sourcesSelected
}

export const areAllSourcesSelectedInDataview = (
  dataview: UrlDataviewInstance,
  datasetTypes = DEFAULT_SOURCES_DATASET_TYPES
) => {
  const sourceOptions = getSourcesOptionsInDataview(dataview, datasetTypes)
  const allSelected = sourceOptions.every((sourceOption) =>
    dataview.config?.datasets?.includes(sourceOption.id)
  )
  return allSelected
}
