import { intersection, lowerCase, uniq } from 'lodash'
import { Dataset, Dataview, DataviewInstance, EventTypes } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { capitalize, sortFields } from 'utils/shared'
import { t } from 'features/i18n/i18n'
import { PUBLIC_SUFIX, FULL_SUFIX, PRIVATE_SUFIX } from 'data/config'
import { getDatasetNameTranslated } from 'features/i18n/utils'

export type SupportedDatasetSchema =
  | 'flag'
  | 'geartype'
  | 'fleet'
  | 'origin'
  | 'vessel_type'
  | 'qf_detect'
export type SchemaFieldDataview = UrlDataviewInstance | Pick<Dataview, 'config' | 'datasets'>

export const isPrivateDataset = (dataset: Partial<Dataset>) =>
  (dataset?.id || '').includes(PRIVATE_SUFIX)

export const removeDatasetVersion = (datasetId: string) => {
  return datasetId ? datasetId?.split(':')[0] : ''
}

export const getDatasetLabel = (dataset: { id: string; name?: string }): string => {
  const { id, name = '' } = dataset || {}
  if (!id) return name || ''
  const label = getDatasetNameTranslated(dataset)
  return isPrivateDataset(dataset) ? `🔒 ${label}` : label
}

export const getDatasetsInDataviews = (
  dataviews: (Dataview | DataviewInstance | UrlDataviewInstance)[]
) => {
  return uniq(
    dataviews?.flatMap((dataviews) => {
      if (!dataviews.datasetsConfig) return []
      return dataviews.datasetsConfig.map(({ datasetId }) => datasetId)
    })
  )
}

export const getEventsDatasetsInDataview = (dataview: UrlDataviewInstance) => {
  const datasetsConfigured = dataview.datasetsConfig
    ?.filter((datasetConfig) =>
      datasetConfig.query?.find((q) => q.id === 'vessels' && q.value !== '')
    )
    .map((d) => d.datasetId)
  return (dataview?.datasets || []).filter((dataset) => {
    const isEventType = dataset?.configuration?.type
      ? Object.values(EventTypes).includes(dataset.configuration.type)
      : false
    const hasVesselId = datasetsConfigured?.includes(dataset.id)
    return isEventType && hasVesselId
  })
}

export const filterDatasetsByUserType = (datasets: Dataset[], isGuestUser: boolean) => {
  const datasetsIds = datasets.map(({ id }) => id)
  const allowedDatasets = datasets.filter(({ id }) => {
    if (isGuestUser) {
      return id.includes(PUBLIC_SUFIX)
    }
    if (id.includes(PUBLIC_SUFIX)) {
      const fullDataset = id.replace(PUBLIC_SUFIX, FULL_SUFIX)
      return !datasetsIds.includes(fullDataset)
    }
    return id.includes(FULL_SUFIX) || id.includes(PRIVATE_SUFIX)
  })
  return allowedDatasets
}

export const isDataviewSchemaSupported = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema
) => {
  const schemaSupported = dataview?.datasets?.every((dataset) => {
    return dataset.fieldsAllowed.includes(schema)
  })
  return schemaSupported
}

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
  const datasetId = activeDatasets?.[0]?.id?.split(':')[0]
  const commonSchemaFields = schemaFields
    ? intersection(...schemaFields).map((field) => {
        const label = t(
          `datasets:${datasetId}.schema.${schema}.enum.${field}`,
          t(`vessel.${schema}.${field}`, capitalize(lowerCase(field)))
        )
        return { id: field, label: label }
      })
    : []
  return commonSchemaFields.sort(sortFields)
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
