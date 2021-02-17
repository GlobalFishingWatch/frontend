import { DatasetTypes } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from 'types'

export const getSourcesOptionsInDataview = (
  dataview: UrlDataviewInstance,
  datasetType = DatasetTypes.Fourwings
) => {
  const datasets = dataview?.datasets?.filter((d) => d.type === datasetType)
  const sourceOptions = datasets?.map((d) => ({ id: d.id, label: d.name })) || []
  return sourceOptions
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
