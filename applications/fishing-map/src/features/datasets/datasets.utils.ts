import intersection from 'lodash/intersection'
import lowerCase from 'lodash/lowerCase'
import { Dataset, Dataview } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { capitalize } from 'utils/shared'
import i18n from 'features/i18n/i18n'

const { t } = i18n

export type SupportedDatasetSchema = 'geartype' | 'fleet' | 'origin' | 'vessel_type'
export type SchemaFieldDataview = UrlDataviewInstance | Pick<Dataview, 'config' | 'datasets'>

export const datasetHasSchemaFields = (dataset: Dataset, schema: SupportedDatasetSchema) => {
  return dataset.schema?.[schema]?.enum !== undefined && dataset.schema?.[schema].enum.length > 0
}

export const getSupportedSchemaFieldsDatasets = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema
) => {
  const datasetsWithSchemaFieldsSupport = dataview?.datasets?.flatMap((dataset) => {
    const hasSchemaFields = datasetHasSchemaFields(dataset, schema)
    return hasSchemaFields ? dataset : []
  })
  return datasetsWithSchemaFieldsSupport
}

export const getNotSupportedSchemaFieldsDatasets = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema
) => {
  const datasetsWithoutSchemaFieldsSupport = dataview?.datasets?.flatMap((dataset) => {
    const hasSchemaFields = datasetHasSchemaFields(dataset, schema)
    const datasetSelected = dataview.config?.datasets?.includes(dataset.id)
    if (!datasetSelected || hasSchemaFields) {
      return []
    }
    return dataset
  })
  return datasetsWithoutSchemaFieldsSupport
}

export const getCommonSchemaFieldsInDataview = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema
) => {
  const activeDatasets = dataview?.datasets?.filter((dataset) =>
    dataview.config?.datasets?.includes(dataset.id)
  )

  const schemaFields = activeDatasets?.map((d) => d.schema?.[schema]?.enum || [])
  const commonSchemaFields = schemaFields
    ? intersection(...schemaFields).map((field) => ({
        id: field,
        label: capitalize(lowerCase(field)),
      }))
    : []
  return commonSchemaFields.sort((a, b) => a.label.localeCompare(b.label))
}

export const getSchemaFieldsSelectedInDataview = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema
) => {
  const options = getCommonSchemaFieldsInDataview(dataview, schema)
  const optionsSelected = options?.filter((option) =>
    dataview.config?.filters?.[schema]?.includes(option.id)
  )
  return optionsSelected
}

export const getFiltersBySchema = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema
) => {
  const datasetsWithSchema = getSupportedSchemaFieldsDatasets(dataview, schema)
  const datasetsWithSchemaIds = datasetsWithSchema?.map(({ id }) => id)
  const active = dataview.config?.datasets?.some((dataset: string) =>
    datasetsWithSchemaIds?.includes(dataset)
  )

  const datasetsWithoutSchema = getNotSupportedSchemaFieldsDatasets(dataview, schema)
  const disabled = datasetsWithoutSchema && datasetsWithoutSchema.length > 0

  const options = getCommonSchemaFieldsInDataview(dataview, schema)

  const optionsSelected = options?.filter((fleet) =>
    dataview.config?.filters?.[schema]?.includes(fleet.id)
  )

  const tooltip = disabled
    ? t('errors.notSupportedBy', {
        list: datasetsWithoutSchema?.map((d) => d.name).join(','),
        defaultValue: 'Not supported by {{list}}',
      })
    : ''
  return { active, disabled, options, optionsSelected, tooltip }
}
