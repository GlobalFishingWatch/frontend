import { intersection, lowerCase, uniq } from 'lodash'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import {
  Dataset,
  DatasetCategory,
  DatasetSchemaType,
  DatasetTypes,
  Dataview,
  DataviewDatasetConfig,
  DataviewInstance,
  EndpointId,
  EventTypes,
  UserPermission,
  DatasetGeometryType,
  FilterOperator,
  INCLUDE_FILTER_ID,
  DatasetSubCategory,
  DataviewCategory,
} from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { formatSliderNumber, IconType, MultiSelectOption } from '@globalfishingwatch/ui-components'
import { capitalize, sortFields } from 'utils/shared'
import { t } from 'features/i18n/i18n'
import { PUBLIC_SUFIX, FULL_SUFIX, PRIVATE_SUFIX } from 'data/config'
import { getDatasetNameTranslated, removeDatasetVersion } from 'features/i18n/utils'
import { getFlags, getFlagsByIds } from 'utils/flags'
import { FileType } from 'features/common/FileDropzone'
import { getLayerDatasetRange } from 'features/workspace/environmental/HistogramRangeFilter'
import styles from '../vessel-groups/VesselGroupModal.module.css'

export type SupportedDatasetSchema =
  | SupportedActivityDatasetSchema
  | SupportedEnvDatasetSchema
  | SupportedContextDatasetSchema

export type SupportedActivityDatasetSchema =
  | 'flag'
  | 'geartype'
  | 'fleet'
  | 'shiptype'
  | 'origin'
  | 'vessel_type'
  | 'radiance'
  | 'source'
  | 'matched'
  | 'codMarinha'
  | 'targetSpecies' // TODO: normalice format in API and decide
  | 'target_species' // between camelCase or snake_case
  | 'license_category'
  | 'vessel-groups'
  | 'visibleValues'

export type SupportedEnvDatasetSchema = 'type'
export type SupportedContextDatasetSchema = 'removal_of'

const CONTEXT_DATASETS_SCHEMAS: SupportedContextDatasetSchema[] = ['removal_of']

export type SchemaFieldDataview =
  | UrlDataviewInstance
  | Pick<Dataview, 'category' | 'config' | 'datasets' | 'filtersConfig'>

type DatasetGeometryTypesSupported = Extract<DatasetGeometryType, 'polygons' | 'tracks' | 'points'>
export const FILES_TYPES_BY_GEOMETRY_TYPE: Record<DatasetGeometryTypesSupported, FileType[]> = {
  polygons: ['shapefile', 'geojson'],
  tracks: ['csv'],
  points: ['shapefile', 'geojson', 'csv'],
}

export const getFileTypes = (datasetGeometryType) =>
  datasetGeometryType ? FILES_TYPES_BY_GEOMETRY_TYPE[datasetGeometryType] : 'polygons'

export const isPrivateDataset = (dataset: Partial<Dataset>) =>
  (dataset?.id || '').includes(PRIVATE_SUFIX)

const GFW_ONLY_DATASETS = ['private-global-other-vessels:v20201001']

export const isGFWOnlyDataset = (dataset: Partial<Dataset>) =>
  GFW_ONLY_DATASETS.includes(dataset?.id)

export const GFW_ONLY_SUFFIX = ' - GFW Only'

export const getDatasetLabel = (dataset: { id: string; name?: string }): string => {
  const { id, name = '' } = dataset || {}
  if (!id) return name || ''
  const label = getDatasetNameTranslated(dataset)
  if (isGFWOnlyDataset(dataset)) return `${label}${GFW_ONLY_SUFFIX}`
  if (isPrivateDataset(dataset)) return `🔒 ${label}`
  return label
}

export const getDatasetIcon = (dataset: Dataset): IconType => {
  if (dataset.type === DatasetTypes.UserTracks) return 'track'
  if (dataset.configuration.geometryType === 'points') return 'dots'
  if (dataset.type === DatasetTypes.Context) return 'polygons'
  return null
}

export const getDatasetTitleByDataview = (
  dataview: Dataview | UrlDataviewInstance,
  { showPrivateIcon = true, withSources = false } = {}
): string => {
  const dataviewInstance = {
    ...dataview,
    dataviewId: (dataview as UrlDataviewInstance).dataviewId || dataview.slug,
  }
  const hasDatasetsConfig = dataview.config?.datasets?.length > 0
  const activeDatasets = hasDatasetsConfig
    ? dataview.datasets?.filter((d) => dataview.config?.datasets?.includes(d.id))
    : dataview.datasets

  let datasetTitle = dataview.name || ''
  const { category, subcategory } = dataviewInstance.datasets?.[0] || {}
  if (category === DatasetCategory.Activity && subcategory === DatasetSubCategory.Fishing) {
    datasetTitle = t(`common.apparentFishing`, 'Apparent Fishing Effort')
  } else if (category === DatasetCategory.Activity && subcategory === DatasetSubCategory.Presence) {
    datasetTitle = t(`common.presence`, 'Vessel presence')
  } else if (category === DatasetCategory.Detections && subcategory === DatasetSubCategory.Viirs) {
    datasetTitle = t(`common.viirs`, 'Night light detections (VIIRS)')
  } else if (category === DatasetCategory.Detections && subcategory === DatasetSubCategory.Sar) {
    datasetTitle = t(`common.sar`, 'Radar detections (SAR)')
  } else if (activeDatasets) {
    if (hasDatasetsConfig && activeDatasets?.length !== 1) {
      return datasetTitle
    }
    datasetTitle = showPrivateIcon
      ? getDatasetLabel(activeDatasets[0])
      : getDatasetNameTranslated(activeDatasets[0])
  }
  if (!withSources) {
    return datasetTitle
  }
  const sources =
    dataview.datasets.length > 1
      ? `(${dataview.datasets.length} ${t('common.sources', 'Sources')})`
      : `(${getDatasetNameTranslated(dataview.datasets[0])})`

  return datasetTitle + ' ' + sources
}

export const getDatasetsInDataviews = (
  dataviews: (Dataview | DataviewInstance | UrlDataviewInstance)[],
  guestUser = false
) => {
  if (!dataviews?.length) {
    return []
  }
  return uniq(
    dataviews?.flatMap((dataviews) => {
      if (!dataviews.datasetsConfig) return []
      const datasetIds: string[] = dataviews.datasetsConfig.flatMap(
        ({ datasetId }) => datasetId || []
      )
      return guestUser
        ? datasetIds.filter((d) => !d.includes(PRIVATE_SUFIX) && !d.includes(FULL_SUFIX))
        : datasetIds
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

export const getRelatedDatasetsByType = (
  dataset?: Dataset,
  datasetType?: DatasetTypes,
  fullDatasetAllowed = false
) => {
  if (fullDatasetAllowed) {
    const fullDataset = dataset?.relatedDatasets?.filter(
      (relatedDataset) =>
        relatedDataset.type === datasetType && relatedDataset.id.startsWith(FULL_SUFIX)
    )
    if (fullDataset.length > 0) {
      return fullDataset
    }
  }
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
export const checkDatasetDownloadTrackPermission = (
  datasetId: string,
  permissions: UserPermission[]
) => {
  const permission = { type: 'dataset', value: datasetId, action: 'download-track' }
  return checkExistPermissionInList(permissions, permission)
}

export const getActivityDatasetsDownloadSupported = (
  dataviews: UrlDataviewInstance<GeneratorType>[],
  permissions: UserPermission[] = []
) => {
  return dataviews.flatMap((dataview) => {
    const permissionDatasetsIds: string[] = (dataview?.config?.datasets || []).filter(
      (datasetId: string) => {
        return datasetId ? checkDatasetReportPermission(datasetId, permissions) : false
      }
    )
    return dataview.datasets
      .filter(
        (d) =>
          permissionDatasetsIds.includes(d.id) &&
          d.category === DatasetCategory.Activity &&
          d.subcategory === 'fishing'
      )
      .map((d) => d.id)
  })
}

export const getVesselDatasetsDownloadTrackSupported = (
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
      return checkDatasetDownloadTrackPermission(dataset.datasetId, permissions)
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

export const getActiveActivityDatasetsInDataviews = (dataviews: UrlDataviewInstance[]) => {
  return dataviews.map((dataview) => {
    const activeDatasets = (dataview?.config?.datasets || []) as string[]
    return dataview.datasets.filter((dataset) => {
      return activeDatasets.includes(dataset.id)
    })
  })
}

export const getEventsDatasetsInDataview = (dataview: UrlDataviewInstance) => {
  const datasetsConfigured = dataview.datasetsConfig
    ?.filter((datasetConfig) =>
      datasetConfig.query?.find((q) => q.id === 'vessels' && q.value !== '')
    )
    .map((d) => d.datasetId)
  return (dataview?.datasets || []).filter((dataset) => {
    const isEventType =
      dataset?.category === DatasetCategory.Event
        ? Object.values(EventTypes).includes(dataset.subcategory as EventTypes)
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
  const activeDatasets = dataview.config?.datasets
  const schemaSupported = dataview?.datasets
    ?.filter((dataset) => activeDatasets?.includes(dataset.id))
    .every((dataset) => {
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
  if (schema === 'flag' || schema === 'vessel-groups') {
    // returning true as the schema fields enum comes from the static list in getFlags()
    return true
  }
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
export const getIncompatibleFilterSelection = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema
) => {
  return dataview?.datasets?.flatMap((dataset) => {
    const incompatibilityDict = dataview.filtersConfig?.incompatibility?.[dataset.id]
    if (!incompatibilityDict?.length) {
      return []
    }
    return incompatibilityDict.filter(({ id, value, disabled }) => {
      const selectedFilterValue = dataview.config?.filters?.[id]
      return (
        disabled.includes(schema) &&
        selectedFilterValue?.length === 1 &&
        (selectedFilterValue?.includes(value) || selectedFilterValue?.includes(value.toString()))
      )
    })
  })
}

const getCommonSchemaTypeInDataview = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema
) => {
  const activeDatasets =
    dataview.category === DataviewCategory.Context
      ? dataview.datasets
      : dataview?.datasets?.filter((dataset) => dataview.config?.datasets?.includes(dataset.id))
  const datasetSchemas = activeDatasets?.map((d) => d.schema?.[schema]?.type).filter(Boolean)
  return datasetSchemas?.[0]
}

export type SchemaFieldSelection = {
  id: string
  label: any
}

export const VESSEL_GROUPS_MODAL_ID = 'vesselGroupsOpenModalId'

export const getActiveDatasetsInDataview = (dataview: SchemaFieldDataview) => {
  return dataview.category === DataviewCategory.Context
    ? dataview?.datasets
    : dataview?.datasets?.filter((dataset) => dataview.config?.datasets?.includes(dataset.id))
}

export const getCommonSchemaFieldsInDataview = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema,
  vesselGroups: MultiSelectOption[] = []
): SchemaFieldSelection[] => {
  const activeDatasets = getActiveDatasetsInDataview(dataview)
  if (schema === 'flag') {
    return getFlags()
  } else if (schema === 'vessel-groups') {
    if (activeDatasets.every((d) => d.fieldsAllowed?.includes(schema))) {
      const addNewGroup = {
        id: VESSEL_GROUPS_MODAL_ID,
        label: t('vesselGroup.createNewGroup', 'Create new group'),
        disableSelection: true,
        className: styles.openModalLink,
      } as MultiSelectOption
      return [addNewGroup, ...vesselGroups]
    }
    return []
  }
  const schemaFields = activeDatasets?.map((d) => d.schema?.[schema]?.enum || [])
  const schemaType = getCommonSchemaTypeInDataview(dataview, schema)
  const datasetId = removeDatasetVersion(activeDatasets?.[0]?.id)
  const commonSchemaFields = schemaFields
    ? intersection(...schemaFields).map((field) => {
        let label =
          schemaType === 'number'
            ? field
            : t(`datasets:${datasetId}.schema.${schema}.enum.${field}`, field.toString())
        if (label === field) {
          if (dataview.category !== DataviewCategory.Context) {
            label = t(`vessel.${schema}.${field}`, capitalize(lowerCase(field)))
          }
          if (schema === 'geartype') {
            // There is an fixed list of gearTypes independant of the dataset
            label = t(`vessel.gearTypes.${field}`, capitalize(lowerCase(field)))
          }
        }
        return { id: field.toString(), label }
      })
    : []
  return commonSchemaFields.sort(sortFields)
}

export const getSchemaOptionsSelectedInDataview = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema,
  options: ReturnType<typeof getCommonSchemaFieldsInDataview>
) => {
  if (schema === 'flag') {
    return getFlagsByIds(dataview.config?.filters?.flag || [])
  }
  if (schema === 'radiance' && dataview.config?.filters?.[schema]) {
    return dataview.config?.filters?.[schema]?.map((o) => ({
      id: o.toString(),
      label: o.toString(),
    }))
  }
  if (
    schema === 'visibleValues' &&
    (dataview.config?.minVisibleValue || dataview.config?.maxVisibleValue)
  ) {
    const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings)
    const layerRange = getLayerDatasetRange(dataset)
    const min = dataview.config?.minVisibleValue || layerRange?.min
    const max = dataview.config?.maxVisibleValue || layerRange?.max
    return [
      {
        id: min.toString(),
        label: formatSliderNumber(min),
      },
      {
        id: max.toString(),
        label: formatSliderNumber(max),
      },
    ]
  }

  return options?.filter((option) =>
    dataview.config?.filters?.[schema]?.map((o) => o.toString())?.includes(option.id)
  )
}

export const getSchemaFilterOperationInDataview = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema
) => {
  if (schema === 'vessel-groups' || dataview.category === DataviewCategory.Context) {
    return
  }
  return dataview.config?.filterOperators?.[schema] || INCLUDE_FILTER_ID
}

export const getSchemaFieldsSelectedInDataview = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema,
  vesselGroups?: MultiSelectOption[]
) => {
  const options = getCommonSchemaFieldsInDataview(dataview, schema, vesselGroups)
  const optionsSelected = getSchemaOptionsSelectedInDataview(dataview, schema, options)
  return optionsSelected
}

export type SchemaFilter = {
  type: DatasetSchemaType
  id: SupportedDatasetSchema
  disabled: boolean
  options: ReturnType<typeof getCommonSchemaFieldsInDataview>
  optionsSelected: ReturnType<typeof getCommonSchemaFieldsInDataview>
  filterOperator: FilterOperator
}
export const getFiltersBySchema = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema,
  vesselGroups?: MultiSelectOption[]
): SchemaFilter => {
  const options = getCommonSchemaFieldsInDataview(dataview, schema, vesselGroups)
  const type = getCommonSchemaTypeInDataview(dataview, schema)
  const filterOperator = getSchemaFilterOperationInDataview(dataview, schema)
  const optionsSelected = getSchemaOptionsSelectedInDataview(dataview, schema, options)

  const datasetsWithoutSchema = getNotSupportedSchemaFieldsDatasets(dataview, schema)?.length > 0
  const incompatibleFilterSelection = getIncompatibleFilterSelection(dataview, schema)?.length > 0
  const disabled = datasetsWithoutSchema || incompatibleFilterSelection

  const datasetId = removeDatasetVersion(getActiveDatasetsInDataview(dataview)?.[0]?.id)
  const schemaId = CONTEXT_DATASETS_SCHEMAS.includes(schema as SupportedContextDatasetSchema)
    ? t(`datasets:${datasetId}.schema.${schema}.keyword`, schema.toString())
    : schema
  return { id: schemaId, disabled, options, optionsSelected, type, filterOperator }
}

export const getSchemaFiltersInDataview = (
  dataview: SchemaFieldDataview,
  vesselGroups?: MultiSelectOption[]
): SchemaFilter[] => {
  const fieldsIds = uniq(
    dataview.datasets?.flatMap((d) => d.fieldsAllowed || [])
  ) as SupportedDatasetSchema[]
  const fieldsOrder = dataview.filtersConfig?.order as SupportedDatasetSchema[]
  const fieldsAllowed = fieldsIds.filter((f) => isDataviewSchemaSupported(dataview, f))
  const fielsAllowedOrdered =
    fieldsOrder && fieldsOrder.length > 0
      ? fieldsAllowed.sort((a, b) => {
          const aIndex = fieldsOrder.findIndex((f) => f === a)
          const bIndex = fieldsOrder.findIndex((f) => f === b)
          return aIndex - bIndex
        })
      : fieldsAllowed
  const schemaFilters = fielsAllowedOrdered.map((id) => {
    return getFiltersBySchema(dataview, id, vesselGroups)
  })
  return schemaFilters
}
