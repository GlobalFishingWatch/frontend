import { DatasetTypes } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { isActivityDataview, isDetectionsDataview } from '@globalfishingwatch/dataviews-client'
import type { TagItem } from '@globalfishingwatch/ui-components'
import {
  FISHING_DATAVIEW_SLUG_PREFIX,
  PRESENCE_DATAVIEW_SLUG,
} from '@platform/config/map/dataviews'

import { getDatasetLabel } from 'features/_map/datasets/datasets.utils'
import { t } from 'features/i18n/i18n'

export const isDefaultActivityDataview = (dataview: UrlDataviewInstance) =>
  dataview.dataviewId?.toString().startsWith(FISHING_DATAVIEW_SLUG_PREFIX) ||
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

export const groupVmsSources = (sources: TagItem[], { inline = false } = {}): TagItem[] => {
  const vmsSources = sources.filter((source) => source.label.includes('VMS'))
  if (vmsSources.length <= 1) return []
  const countries = t((t) => t.common.country, { count: 2 })
  return [
    ...sources.filter((source) => !source.label.includes('VMS')),
    {
      id: 'vms-grouped',
      label: inline
        ? `${vmsSources.length} VMS ${countries}`
        : `VMS (${vmsSources.length} ${countries})`,
      tooltip: vmsSources.map((source) => source.label).join(', '),
    },
  ]
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
