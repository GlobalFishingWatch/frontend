import { FOURWINGS_DATASET_TYPE } from 'data/datasets'
import { UrlDataviewInstance } from 'types'

export const getSourcesOptionsInDataview = (
  dataview: UrlDataviewInstance,
  datasetType = FOURWINGS_DATASET_TYPE
) => {
  const datasets = dataview?.datasets?.filter((d) => d.type === datasetType)
  const sourceOptions = datasets?.map((d) => ({ id: d.id, label: d.name })) || []
  return sourceOptions
}

export const getSourcesSelectedInDataview = (
  dataview: UrlDataviewInstance,
  datasetType = FOURWINGS_DATASET_TYPE
) => {
  const sourceOptions = getSourcesOptionsInDataview(dataview, datasetType)
  const sourcesSelected = sourceOptions.filter((sourceOption) =>
    dataview.config?.datasets?.includes(sourceOption.id)
  )
  return sourcesSelected
}
