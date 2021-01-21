import intersection from 'lodash/intersection'
import lowerCase from 'lodash/lowerCase'
import { FISHING_DATASET_TYPE } from 'data/datasets'
import { UrlDataviewInstance } from 'types'
import { capitalize } from 'utils/shared'

export const getNotSupportedGearTypesDatasets = (dataview: UrlDataviewInstance) => {
  const datasetsWithoutGearTypeSupport = dataview?.datasets?.flatMap((dataset) => {
    const hasGeartype = dataset.schema?.geartype?.enum !== undefined
    const datasetSelected = dataview.config?.datasets.includes(dataset.id)
    if (!datasetSelected || hasGeartype) {
      return []
    }
    return dataset
  })
  return datasetsWithoutGearTypeSupport
}

export const getCommonGearTypesInDataview = (dataview: UrlDataviewInstance) => {
  const activeDatasets = dataview?.datasets?.filter((dataset) =>
    dataview.config?.datasets.includes(dataset.id)
  )
  const geartypes = activeDatasets?.map((d) => d.schema?.geartype?.enum || [])
  const commonGeartypes = geartypes
    ? intersection(...geartypes).map((geartype) => ({
        id: geartype,
        label: capitalize(lowerCase(geartype)),
      }))
    : []
  return commonGeartypes
}

export const getGearTypesSelectedInDataview = (dataview: UrlDataviewInstance) => {
  const gearTypeOptions = getCommonGearTypesInDataview(dataview)
  const gearTypeSelected = gearTypeOptions?.filter((geartype) =>
    dataview.config?.filters?.geartype?.includes(geartype.id)
  )
  return gearTypeSelected
}

export const getSourcesOptionsInDataview = (
  dataview: UrlDataviewInstance,
  datasetType = FISHING_DATASET_TYPE
) => {
  const datasets = dataview?.datasets?.filter((d) => d.type === datasetType)
  const sourceOptions = datasets?.map((d) => ({ id: d.id, label: d.name })) || []
  return sourceOptions
}

export const getSourcesSelectedInDataview = (
  dataview: UrlDataviewInstance,
  datasetType = FISHING_DATASET_TYPE
) => {
  const sourceOptions = getSourcesOptionsInDataview(dataview, datasetType)
  const sourcesSelected = sourceOptions.filter((sourceOption) =>
    dataview.config?.datasets?.includes(sourceOption.id)
  )
  return sourcesSelected
}
