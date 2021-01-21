import intersection from 'lodash/intersection'
import lowerCase from 'lodash/lowerCase'
import { FISHING_DATASET_TYPE } from 'data/datasets'
import { UrlDataviewInstance } from 'types'
import { capitalize } from 'utils/shared'

type DatasetSchema = 'geartype' | 'fleet'

export const getSupportedSchemaFieldsDatasets = (
  dataview: UrlDataviewInstance,
  schema: DatasetSchema
) => {
  const datasetsWithSchemaFieldsSupport = dataview?.datasets?.flatMap((dataset) => {
    const hasSchemaFields = dataset.schema?.[schema]?.enum !== undefined
    return hasSchemaFields ? dataset : []
  })
  return datasetsWithSchemaFieldsSupport
}

export const getNotSupportedSchemaFieldsDatasets = (
  dataview: UrlDataviewInstance,
  schema: DatasetSchema
) => {
  const datasetsWithoutSchemaFieldsSupport = dataview?.datasets?.flatMap((dataset) => {
    const hasSchemaFields = dataset.schema?.[schema]?.enum !== undefined
    const datasetSelected = dataview.config?.datasets.includes(dataset.id)
    if (!datasetSelected || hasSchemaFields) {
      return []
    }
    return dataset
  })
  return datasetsWithoutSchemaFieldsSupport
}

export const getCommonSchemaFieldsInDataview = (
  dataview: UrlDataviewInstance,
  schema: DatasetSchema
) => {
  const activeDatasets = dataview?.datasets?.filter((dataset) =>
    dataview.config?.datasets.includes(dataset.id)
  )
  const schemaFields = activeDatasets?.map((d) => d.schema?.[schema]?.enum || [])
  const commonSchemaFields = schemaFields
    ? intersection(...schemaFields).map((field) => ({
        id: field,
        label: capitalize(lowerCase(field)),
      }))
    : []
  return commonSchemaFields
}

export const getSchemaFieldsSelectedInDataview = (
  dataview: UrlDataviewInstance,
  schema: DatasetSchema
) => {
  const options = getCommonSchemaFieldsInDataview(dataview, schema)
  const optionsSelected = options?.filter((option) =>
    dataview.config?.filters?.[schema]?.includes(option.id)
  )
  return optionsSelected
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
