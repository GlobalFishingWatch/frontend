import { intersection, lowerCase, uniq } from 'lodash'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import {
  Dataset,
  DatasetTypes,
  Dataview,
  DataviewDatasetConfig,
  DataviewInstance,
  EndpointId,
  EventTypes,
  UserPermission,
} from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { capitalize, sortFields } from 'utils/shared'
import { t } from 'features/i18n/i18n'
import { PUBLIC_SUFIX, FULL_SUFIX, PRIVATE_SUFIX } from 'data/config'
import { getDatasetNameTranslated } from 'features/i18n/utils'
import { FISHING_DATAVIEW_ID, PRESENCE_DATAVIEW_ID, VIIRS_DATAVIEW_ID } from 'data/workspaces'

export type SupportedDatasetSchema =
  | 'flag'
  | 'geartype'
  | 'fleet'
  | 'shiptype'
  | 'origin'
  | 'vessel_type'
  | 'qf_detect'
  | 'radiance'
  | 'codMarinha'
  | 'targetSpecies' // TODO: normalice format in API and decide
  | 'target_species' // between camelCase or snake_case
  | 'license_category'

export type SchemaFieldDataview = UrlDataviewInstance | Pick<Dataview, 'config' | 'datasets'>

export const isPrivateDataset = (dataset: Partial<Dataset>) =>
  (dataset?.id || '').includes(PRIVATE_SUFIX)

export const getDatasetLabel = (dataset: { id: string; name?: string }): string => {
  const { id, name = '' } = dataset || {}
  if (!id) return name || ''
  const label = getDatasetNameTranslated(dataset)
  return isPrivateDataset(dataset) ? `🔒 ${label}` : label
}

export const getDatasetTitleByDataview = (
  dataview: Dataview | UrlDataviewInstance,
  showPrivateIcon = false
): string => {
  const dataviewInstance = {
    ...dataview,
    dataviewId: (dataview as UrlDataviewInstance).dataviewId || dataview.id,
  }
  const hasDatasetsConfig = dataview.config?.datasets?.length > 0
  const activeDatasets = hasDatasetsConfig
    ? dataview.datasets?.filter((d) => dataview.config?.datasets?.includes(d.id))
    : dataview.datasets
  let datasetTitle = dataview.name || ''
  if (dataviewInstance.dataviewId === FISHING_DATAVIEW_ID) {
    datasetTitle = t(`common.apparentFishing`, 'Apparent Fishing Effort')
  } else if (dataviewInstance.dataviewId === PRESENCE_DATAVIEW_ID) {
    datasetTitle = t(`common.presence`, 'Vessel presence')
  } else if (dataviewInstance.dataviewId === VIIRS_DATAVIEW_ID) {
    datasetTitle = t(`common.viirs`, 'Night light detections (VIIRS)')
  } else if (activeDatasets) {
    if (hasDatasetsConfig && activeDatasets?.length !== 1) {
      return datasetTitle
    }
    datasetTitle = showPrivateIcon
      ? getDatasetLabel(activeDatasets[0])
      : getDatasetNameTranslated(activeDatasets[0])
  }
  return datasetTitle
}

export const getDatasetsInDataviews = (
  dataviews: (Dataview | DataviewInstance | UrlDataviewInstance)[],
  guestUser = false
) => {
  return uniq(
    dataviews?.flatMap((dataviews) => {
      if (!dataviews.datasetsConfig) return []
      const datasetIds = dataviews.datasetsConfig.map(({ datasetId }) => datasetId)
      return guestUser ? datasetIds.filter((d) => !d.includes(PRIVATE_SUFIX)) : datasetIds
    })
  )
}

export const getRelatedDatasetByType = (
  dataset?: Dataset,
  datasetType?: DatasetTypes,
  fullDatasetAllowed = false
) => {
  if (fullDatasetAllowed) {
    const fullDataset = dataset?.relatedDatasets?.find(
      (relatedDataset) =>
        relatedDataset.type === datasetType && relatedDataset.id.startsWith(FULL_SUFIX)
    )
    if (fullDataset) {
      return fullDataset
    }
  }
  return dataset?.relatedDatasets?.find((relatedDataset) => relatedDataset.type === datasetType)
}

export const getRelatedDatasetsByType = (dataset?: Dataset, datasetType?: DatasetTypes) => {
  return dataset?.relatedDatasets?.filter((relatedDataset) => relatedDataset.type === datasetType)
}

export const getActiveDatasetsInActivityDataviews = (
  dataviews: UrlDataviewInstance<GeneratorType>[]
) => {
  return dataviews.flatMap((dataview) => {
    return dataview?.config?.datasets || []
  })
}

export const checkDatasetReportPermission = (datasetId: string, permissions: UserPermission[]) => {
  const permission = { type: 'dataset', value: datasetId, action: 'report' }
  return checkExistPermissionInList(permissions, permission)
}

export const getActivityDatasetsDownloadSupported = (
  dataviews: UrlDataviewInstance<GeneratorType>[],
  permissions: UserPermission[] = []
) => {
  return dataviews.flatMap((dataview) => {
    const datasets: Dataset[] = (dataview?.config?.datasets || []).filter((datasetId: string) => {
      return datasetId ? checkDatasetReportPermission(datasetId, permissions) : false
    })
    return datasets
  })
}

export const getVesselDatasetsDownloadSupported = (
  dataview: UrlDataviewInstance<GeneratorType>,
  permissions: UserPermission[] = []
) => {
  const datasets = (dataview?.datasetsConfig || [])
    .filter(
      (datasetConfig) =>
        datasetConfig.endpoint === EndpointId.Tracks && hasDatasetConfigVesselData(datasetConfig)
    )
    .filter((dataset) => {
      if (!dataset) return false
      return checkDatasetReportPermission(dataset.datasetId, permissions)
    })
  return datasets
}

export const getDatasetsDownloadNotSupported = (
  dataviews: UrlDataviewInstance<GeneratorType>[],
  permissions: UserPermission[] = []
) => {
  const dataviewDatasets = getActiveDatasetsInActivityDataviews(dataviews)
  const datasetsDownloadSupported = getActivityDatasetsDownloadSupported(dataviews, permissions)
  return dataviewDatasets.filter((dataset) => !datasetsDownloadSupported.includes(dataset))
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

export const hasDatasetConfigVesselData = (datasetConfig: DataviewDatasetConfig) => {
  return (
    datasetConfig?.query?.find((q) => q.id === 'vessels')?.value ||
    datasetConfig?.params?.find((q) => q.id === 'vesselId')?.value
  )
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

const getCommonSchemaTypeInDataview = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema
) => {
  const activeDatasets = dataview?.datasets?.filter((dataset) =>
    dataview.config?.datasets?.includes(dataset.id)
  )
  const datasetSchemas = activeDatasets?.map((d) => d.schema?.[schema]?.type).filter(Boolean)
  return datasetSchemas?.[0]
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
        let label = t(`datasets:${datasetId}.schema.${schema}.enum.${field}`, field)
        if (label === field) {
          label =
            schema === 'geartype'
              ? // There is an fixed list of gearTypes independant of the dataset
                t(`vessel.gearTypes.${field}`, capitalize(lowerCase(field)))
              : t(`vessel.${schema}.${field}`, capitalize(lowerCase(field)))
        }
        return { id: field, label }
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

export type SchemaFilter = {
  id: SupportedDatasetSchema
  active: boolean
  disabled: boolean
  options: ReturnType<typeof getCommonSchemaFieldsInDataview>
  optionsSelected: ReturnType<typeof getCommonSchemaFieldsInDataview>
  tooltip: string
  type: 'string' | 'number'
}
export const getFiltersBySchema = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema
): SchemaFilter => {
  const datasetsWithSchema = getSupportedSchemaFieldsDatasets(dataview, schema)
  const datasetsWithSchemaIds = datasetsWithSchema?.map(({ id }) => id)
  const active = dataview.config?.datasets?.some((dataset: string) =>
    datasetsWithSchemaIds?.includes(dataset)
  )

  const datasetsWithoutSchema = getNotSupportedSchemaFieldsDatasets(dataview, schema)
  const disabled = datasetsWithoutSchema !== undefined && datasetsWithoutSchema.length > 0

  const options = getCommonSchemaFieldsInDataview(dataview, schema)
  const type = getCommonSchemaTypeInDataview(dataview, schema)

  const optionsSelected = options?.filter((fleet) =>
    dataview.config?.filters?.[schema]?.includes(fleet.id)
  )

  const tooltip = disabled
    ? t('errors.notSupportedBy', {
        list: datasetsWithoutSchema?.map((d) => d.name).join(','),
        defaultValue: 'Not supported by {{list}}',
      })
    : ''
  return { id: schema, active, disabled, options, optionsSelected, tooltip, type }
}
