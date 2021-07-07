import { DatasetTypes, DataviewCategory } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { DEFAULT_FISHING_DATAVIEW_ID, DEFAULT_PRESENCE_DATAVIEW_ID } from 'data/workspaces'
import { t } from 'features/i18n/i18n'

export const isFishingDataview = (dataview: UrlDataviewInstance) =>
  dataview.dataviewId === DEFAULT_FISHING_DATAVIEW_ID ||
  dataview.category === DataviewCategory.Fishing

export const isPresenceDataview = (dataview: UrlDataviewInstance) =>
  dataview.dataviewId === DEFAULT_PRESENCE_DATAVIEW_ID ||
  dataview.category === DataviewCategory.Presence

export const isActivityDataview = (dataview: UrlDataviewInstance) =>
  isFishingDataview(dataview) || isPresenceDataview(dataview)

export const ALL_SOURCES_OPTION_ID = 'all'

export const getSourcesOptionsInDataview = (
  dataview: UrlDataviewInstance,
  datasetType = DatasetTypes.Fourwings
) => {
  const datasets = dataview?.datasets?.filter((d) => d.type === datasetType)
  const sourceOptions = datasets?.map((d) => ({ id: d.id, label: d.name })) || []
  return sourceOptions.sort((a, b) => a.label.localeCompare(b.label))
}

export const getSourcesSelectedInDataview = (
  dataview: UrlDataviewInstance,
  datasetType = DatasetTypes.Fourwings
) => {
  const sourceOptions = getSourcesOptionsInDataview(dataview, datasetType)
  const allSelected = areAllSourcesSelectedInDataview(dataview, datasetType)
  if (allSelected) {
    // defined here to ensure the translation is updated everytime is invoked
    return [{ id: ALL_SOURCES_OPTION_ID, label: t('selects.allSelected', 'All') }]
  }
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
