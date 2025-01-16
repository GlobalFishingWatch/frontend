import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import { uniq } from 'es-toolkit'
import intersection from 'lodash/intersection'
import lowerCase from 'lodash/lowerCase'

import type {
  Dataset,
  DatasetSchema,
  DatasetSchemaItem,
  DatasetSchemaItemEnum,
  DatasetSchemaType,
  Dataview,
  DataviewDatasetConfig,
  DataviewInstance,
  FilterOperator,
  IdentityVessel,
  UserPermission,
  VesselIdentitySourceEnum,
  VesselType,
} from '@globalfishingwatch/api-types'
import {
  DatasetCategory,
  DatasetSubCategory,
  DatasetTypes,
  DataviewCategory,
  DataviewType,
  EndpointId,
  EventTypes,
  INCLUDE_FILTER_ID,
} from '@globalfishingwatch/api-types'
import {
  getDatasetConfigurationProperty,
  getDatasetGeometryType,
  getEnvironmentalDatasetRange,
  removeDatasetVersion,
} from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { IconType, MultiSelectOption } from '@globalfishingwatch/ui-components'

import { DEFAULT_TIME_RANGE,FULL_SUFIX, PUBLIC_SUFIX } from 'data/config'
import { t } from 'features/i18n/i18n'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { getDatasetNameTranslated } from 'features/i18n/utils.datasets'
import { getFlags, getFlagsByIds } from 'utils/flags'
import { getVesselGearTypeLabel, getVesselShipTypeLabel } from 'utils/info'
import { capitalize, sortFields } from 'utils/shared'

import styles from '../vessel-groups/VesselGroupModal.module.css'

// Datasets ids for vessel instances
export type VesselInstanceDatasets = {
  track?: string
  info?: string
  events?: string[]
  relatedVesselIds?: string[]
}

const VESSEL_INSTANCE_DATASETS = [
  'track' as keyof VesselInstanceDatasets,
  'info' as keyof VesselInstanceDatasets,
  'events' as keyof VesselInstanceDatasets,
]

export type SupportedDatasetSchema =
  | SupportedActivityDatasetSchema
  | SupportedEnvDatasetSchema
  | SupportedContextDatasetSchema
  | SupportedEventsDatasetSchema

type SupportedActivityDatasetSchema =
  | 'mmsi'
  | 'flag'
  | 'geartype'
  | 'geartypes'
  | 'fleet'
  | 'shiptype'
  | 'shiptypes'
  | 'origin'
  | 'vessel_type'
  | 'speed'
  | 'radiance'
  | 'duration'
  | 'source'
  | 'matched'
  | 'codMarinha'
  | 'targetSpecies' // TODO: normalice format in API and decide
  | 'target_species' // between camelCase or snake_case
  | 'casco'
  | 'license_category'
  | 'vessel-groups'
  | 'neural_vessel_type'
  | 'visibleValues'
  | 'callsign'
  | 'shipname'
  | 'ssvid'
  | 'imo'
  | 'label'

// Speed flag and vessels only added to debug purposes of vessel speed dataset
// Context env layers filtesr: Seamounts => height & Ecoregions => REALM
export type SupportedEnvDatasetSchema =
  | 'type'
  | 'speed'
  | 'elevation'
  | 'flag'
  | 'vessel_type'
  | 'Height'
  | 'REALM'
  // TODO: remove this when the dataset is updated
  | 'specie' // species-mm
  | 'species' // species-mm
  | 'genus' // species-mm
  | 'period' // species-mm
  | 'scenario' // species-mm
type SupportedContextDatasetSchema = 'removal_of' | 'vessel_id'
type SupportedEventsDatasetSchema = 'duration'

const CONTEXT_DATASETS_SCHEMAS: SupportedContextDatasetSchema[] = ['removal_of']
const SINGLE_SELECTION_SCHEMAS: SupportedDatasetSchema[] = ['vessel-groups', 'period', 'scenario']

type SchemaCompatibilityOperation = 'every' | 'some'
type SchemaOriginParam = keyof Pick<IdentityVessel, 'selfReportedInfo' | 'registryInfo'> | 'all'
type GetSchemaInDataviewParams = {
  fieldsToInclude?: SupportedDatasetSchema[]
  vesselGroups?: MultiSelectOption[]
  compatibilityOperation?: SchemaCompatibilityOperation
  schemaOrigin?: SchemaOriginParam
  isGuestUser?: boolean
}

export type SchemaFieldDataview =
  | UrlDataviewInstance
  | Pick<Dataview, 'category' | 'config' | 'datasets' | 'filtersConfig'>

export const isPrivateDataset = (dataset: Partial<Dataset>) =>
  !(dataset?.id || '').startsWith(`${PUBLIC_SUFIX}-`)

export const isPrivateVesselGroup = (vesselGroupId: string) =>
  !vesselGroupId.endsWith(`-${PUBLIC_SUFIX}`)

const GFW_ONLY_DATASETS = [
  'private-global-other-vessels:v20201001',
  'public-global-presence-speed:v20231026',
]

export const isGFWOnlyDataset = (dataset: Partial<Dataset>) =>
  GFW_ONLY_DATASETS.includes(dataset?.id || '')

export const GFW_ONLY_SUFFIX = ' - GFW Only'

export type GetDatasetLabelParams = { id: string; name?: string }
export const getDatasetLabel = (dataset = {} as GetDatasetLabelParams): string => {
  const { id, name = '' } = dataset || {}
  if (!id) return name || ''
  const label = getDatasetNameTranslated(dataset)
  if (isGFWOnlyDataset(dataset)) return `${label}${GFW_ONLY_SUFFIX}`
  if (isPrivateDataset(dataset)) return `🔒 ${label}`
  return label
}

export const getDatasetTypeIcon = (dataset: Dataset): IconType | null => {
  if (!dataset) {
    return null
  }
  if (dataset.type === DatasetTypes.Fourwings) return 'heatmap'
  if (dataset.type === DatasetTypes.Events) return 'clusters'
  const geometryType = getDatasetGeometryType(dataset)
  if (geometryType === 'draw') {
    const geometryType = getDatasetConfigurationProperty({ dataset, property: 'geometryType' })
    return geometryType === 'points' ? 'dots' : 'polygons'
  }
  if (geometryType === 'points') {
    return 'dots'
  }
  if (geometryType === 'tracks') {
    return 'track'
  }
  return 'polygons'
}

export const getIsBQEditorDataset = (dataset: Dataset): boolean => {
  if (!dataset) {
    return false
  }
  // TODO use a custom category for BQ datasets but the API doesn't allow it yet
  return (
    (dataset.category === DatasetCategory.Activity || dataset.category === DatasetCategory.Event) &&
    dataset.subcategory === 'user'
  )
}

export const getDatasetSourceIcon = (dataset: Dataset): IconType | null => {
  const source = dataset?.source
  if (!source) {
    return null
  }
  // Activity, Detections & Events
  if (source === 'Global Fishing Watch' || source === 'GFW') return 'gfw-logo'
  // Environment
  if (source.includes('HYCOM')) return 'hycom-logo'
  if (source.includes('Copernicus')) return 'copernicus-logo'
  if (source.includes('NASA')) return 'nasa-logo'
  if (source.includes('PacIOOS')) return 'pacioos-logo'
  if (source.includes('gebco')) return 'gebco-logo'
  if (source.includes('Geospatial Conservation Atlas')) return 'gca-logo'
  if (source.includes('UNEP')) return 'unep-logo'
  if (source.includes('Blue Habitats')) return 'blue-habitats-logo'
  // Reference
  if (source.includes('protectedplanet')) return 'protected-planet-logo'
  if (source.includes('protectedseas')) return 'protected-seas-logo'
  if (source.includes('marineregions')) return 'marine-regions-logo'
  if (source.includes('fao')) return 'fao-logo'

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
  const hasDatasetsConfig = dataview.config?.datasets && dataview.config?.datasets?.length > 0
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
    dataview?.datasets && dataview?.datasets?.length > 1
      ? `(${dataview.datasets?.length} ${t('common.sources', 'Sources')})`
      : `(${getDatasetNameTranslated(dataview.datasets?.[0] as Dataset)})`

  return datasetTitle + ' ' + sources
}

const getDatasetsInDataview = (
  dataview: Dataview | DataviewInstance | UrlDataviewInstance,
  guestUser = false
): string[] => {
  let datasetIds: string[] = (dataview.datasetsConfig || []).flatMap(
    ({ datasetId }) => datasetId || []
  )
  const datasetsConfigMigration = (dataview as DataviewInstance).datasetsConfigMigration || {}
  if (Object.values(datasetsConfigMigration).length) {
    datasetIds = [...datasetIds, ...Object.values(datasetsConfigMigration)]
  }
  if (!datasetIds.length) {
    // Get the datasets from the vessel config shorcurt (to avoid large urls)
    datasetIds = VESSEL_INSTANCE_DATASETS.flatMap((d) => {
      return dataview.config?.[d] || []
    })
  }

  return guestUser
    ? datasetIds.filter((id) => !isPrivateDataset({ id }) && !id.includes(FULL_SUFIX))
    : datasetIds
}

export const getDatasetsInDataviews = (
  dataviews: (Dataview | DataviewInstance | UrlDataviewInstance)[],
  dataviewInstances: (DataviewInstance | UrlDataviewInstance)[] = [],
  guestUser = false
) => {
  if (!dataviews?.length) {
    return []
  }
  const datasets = [...dataviews, ...dataviewInstances].flatMap((dataview) => {
    return getDatasetsInDataview(dataview, guestUser)
  })
  return uniq(datasets)
}

export const getVesselGroupInDataview = (
  dataview: Dataview | DataviewInstance | UrlDataviewInstance,
  guestUser = false
): string[] => {
  const vesselGroupIds = (dataview?.config?.filters?.['vessel-groups'] as string[]) || []
  return guestUser ? vesselGroupIds.filter((id) => !isPrivateVesselGroup(id)) : vesselGroupIds
}

export const getVesselGroupsInDataviews = (
  dataviews: (Dataview | DataviewInstance | UrlDataviewInstance)[],
  guestUser = false
) => {
  if (!dataviews?.length) {
    return []
  }
  const vesselGroups = dataviews.flatMap((dataview) => {
    return getVesselGroupInDataview(dataview, guestUser)
  })
  return uniq(vesselGroups)
}

type RelatedDatasetByTypeParams = {
  fullDatasetAllowed?: boolean
  vesselType?: VesselType
}

export const getRelatedDatasetByType = (
  dataset?: Dataset,
  datasetType?: DatasetTypes,
  { fullDatasetAllowed = false } = {} as RelatedDatasetByTypeParams
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
    if (fullDataset && fullDataset.length > 0) {
      return fullDataset
    }
  }
  return dataset?.relatedDatasets?.filter((relatedDataset) => relatedDataset.type === datasetType)
}

export const getActiveDatasetsInActivityDataviews = (
  dataviews: UrlDataviewInstance<DataviewType>[]
): string[] => {
  return dataviews.flatMap((dataview) => {
    return dataview?.config?.datasets || []
  })
}

export const getLatestEndDateFromDatasets = (
  datasets: Dataset[],
  datasetCategory?: DatasetCategory
): string => {
  const datasetsWithEndDate = datasets.filter((dataset) => dataset.endDate)
  if (!datasetsWithEndDate.length) return DEFAULT_TIME_RANGE.end
  const latestDate = datasetsWithEndDate.reduce((acc, dataset) => {
    const endDate = dataset.endDate as string
    if (datasetCategory && dataset.category !== datasetCategory) {
      return acc
    }
    return endDate > acc ? endDate : acc
  }, datasetsWithEndDate?.[0].endDate || '')
  return latestDate
}

export const checkDatasetReportPermission = (datasetId: string, permissions: UserPermission[]) => {
  const permission = { type: 'dataset', value: datasetId, action: 'report' }
  return checkExistPermissionInList(permissions, permission)
}
const checkDatasetDownloadTrackPermission = (datasetId: string, permissions: UserPermission[]) => {
  // TODO make this number dynamic using wildcards like -*
  const downloadPermissions = [
    { type: 'dataset', value: datasetId, action: 'download-track' },
    { type: 'dataset', value: datasetId, action: 'download-track-10' },
    { type: 'dataset', value: datasetId, action: 'download-track-100' },
    { type: 'dataset', value: datasetId, action: 'download-track-*' },
  ]
  return downloadPermissions.some((permission) =>
    checkExistPermissionInList(permissions, permission)
  )
}

export const getActivityDatasetsReportSupported = (
  dataviews: UrlDataviewInstance<DataviewType>[],
  permissions: UserPermission[] = []
) => {
  return dataviews.flatMap((dataview) => {
    const datasets = getActiveDatasetsInDataview(dataview)?.flatMap((d) => d?.id || []) || []
    const permissionDatasetsIds: string[] = datasets.filter((datasetId: string) => {
      const valid = datasetId ? checkDatasetReportPermission(datasetId, permissions) : false
      return valid
    })
    return dataview.datasets
      ?.filter(
        (d) =>
          permissionDatasetsIds.includes(d.id) &&
          (d.category === DatasetCategory.Activity ||
            d.category === DatasetCategory.Detections ||
            (d.category === DatasetCategory.Environment &&
              dataview.config?.type === DataviewType.HeatmapAnimated))
      )
      .map((d) => d.id)
  })
}

export const getVesselDatasetsDownloadTrackSupported = (
  dataview: UrlDataviewInstance<DataviewType>,
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

export const getDatasetsReportSupported = (
  dataviews: UrlDataviewInstance<DataviewType>[],
  permissions: UserPermission[] = []
) => {
  const dataviewDatasets = getActiveDatasetsInActivityDataviews(dataviews)
  const datasetsDownloadSupported = getActivityDatasetsReportSupported(dataviews, permissions)
  return dataviewDatasets.filter((dataset) => datasetsDownloadSupported.includes(dataset))
}

export const getDatasetsReportNotSupported = (
  dataviews: UrlDataviewInstance<DataviewType>[],
  permissions: UserPermission[] = []
) => {
  const dataviewDatasets = getActiveDatasetsInActivityDataviews(dataviews)
  const datasetsDownloadSupported = getActivityDatasetsReportSupported(dataviews, permissions)
  return dataviewDatasets.filter((dataset) => !datasetsDownloadSupported.includes(dataset))
}

export const getActiveActivityDatasetsInDataviews = (
  dataviews: (Dataview | UrlDataviewInstance)[]
) => {
  return dataviews.map((dataview) => {
    const activeDatasets = (dataview?.config?.datasets || []) as string[]
    return dataview.datasets?.filter((dataset) => {
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
    return id.includes(FULL_SUFIX) || isPrivateDataset({ id })
  })
  return allowedDatasets
}

const isDataviewSchemaSupported = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema
) => {
  const activeDatasets = dataview.config?.datasets
  const schemaSupported = dataview?.datasets
    ?.filter((dataset) => activeDatasets?.includes(dataset.id))
    .every((dataset) => {
      const fieldAllowed = dataset.fieldsAllowed.includes(schema)
      const incompatibleSelection = getIncompatibleFilterSelection(dataview, schema)
      return fieldAllowed && incompatibleSelection?.length === 0
    })
  return schemaSupported
}

export const hasDatasetConfigVesselData = (datasetConfig: DataviewDatasetConfig) => {
  return (
    datasetConfig?.query?.find((q) => q.id === 'vessels')?.value ||
    datasetConfig?.params?.find((q) => q.id === 'vesselId')?.value
  )
}

const getSchemaItemByOrigin = (
  dataset: Dataset,
  schema: SupportedDatasetSchema,
  schemaOrigin: Exclude<SchemaOriginParam, 'all'>
) => {
  const schemaInfo = dataset?.schema?.[schemaOrigin] as DatasetSchema
  const schemaInfoItem = schemaInfo?.items?.[schema] as DatasetSchemaItem
  if (schemaInfoItem) {
    return schemaInfoItem
  }
  const schemaInfoPropertiesItem = (schemaInfo?.items?.properties as any)?.[
    schema
  ] as DatasetSchemaItem
  if (schemaInfoPropertiesItem) {
    return schemaInfoPropertiesItem
  }
  // combinedSourcesInfo so far only applies for selfReportInfo properties
  if (schemaOrigin !== 'registryInfo' && (schema === 'geartypes' || schema === 'shiptypes')) {
    const combinedSourceSchema = (dataset.schema?.combinedSourcesInfo?.items as DatasetSchemaItem)
      ?.properties?.[schema]?.items as DatasetSchemaItem
    return combinedSourceSchema?.properties?.name || null
  }
}

const combineSchemaItems = (schema1: DatasetSchemaItem, schema2: DatasetSchemaItem) => {
  if (!schema1 || !schema2) {
    return schema1 || schema2
  }

  if (schema1.type === 'array' && schema1.type === 'array') {
    return {
      type: 'array',
      items: {
        type: 'string',
        enum: uniq([...(schema1.items?.enum || []), ...(schema2.items?.enum || [])]).sort(),
      },
    } as DatasetSchemaItem
  }

  console.warn('schemas not compatible to merge, returing first schema')
  return schema1 || schema2
}

export const getDatasetSchemaItem = (
  dataset: Dataset,
  schema: SupportedDatasetSchema,
  schemaOrigin: SchemaOriginParam = 'selfReportedInfo'
) => {
  const schemaItem = dataset?.schema?.[schema] as DatasetSchemaItem
  if (schemaItem) {
    return schemaItem
  }

  if (schemaOrigin === 'all') {
    const selfReportedInfo: DatasetSchemaItem = getDatasetSchemaItem(
      dataset,
      schema,
      'selfReportedInfo'
    ) as DatasetSchemaItem
    const registryInfo = getDatasetSchemaItem(dataset, schema, 'registryInfo') as DatasetSchemaItem
    return combineSchemaItems(selfReportedInfo, registryInfo)
  } else {
    const nestedSchemaItem = getSchemaItemByOrigin(dataset, schema, schemaOrigin)
    if (nestedSchemaItem) {
      return nestedSchemaItem
    }
  }

  return null
}

const datasetHasSchemaFields = (dataset: Dataset, schema: SupportedDatasetSchema) => {
  if (schema === 'vessel-groups') {
    // returning true as the schema fields enum comes from the dynamic fetch list passed as props
    return true
  }
  if (schema === 'flag') {
    return dataset.fieldsAllowed.some((f) => f.includes(schema))
  }
  const schemaConfig = getDatasetSchemaItem(dataset, schema)
  if (!schemaConfig) {
    return false
  }
  if (
    schemaConfig.type === 'range' ||
    schemaConfig.type === 'array' ||
    schemaConfig.type === 'boolean'
  ) {
    const schemaEnum = schemaConfig?.enum || schemaConfig?.items?.enum
    return schemaEnum !== undefined && schemaEnum.length > 0
  }
  return schemaConfig.type === 'string'
}

export const isFieldInFieldsAllowed = ({
  field,
  fieldsAllowed,
  infoSource,
}: {
  field: string
  fieldsAllowed: string[]
  infoSource?: VesselIdentitySourceEnum
}): boolean => {
  return fieldsAllowed.some((f) => {
    return (
      f === field ||
      f.includes(field) ||
      f === `${infoSource}.${field}` ||
      (field === 'owner' && f === 'registryOwners.name') ||
      (field === 'shiptypes' && f === 'combinedSourcesInfo.shiptypes.name') ||
      (field === 'geartypes' && f === 'combinedSourcesInfo.geartypes.name')
    )
  })
}

const datasetHasFieldsAllowed = (dataset: Dataset, schema: SupportedDatasetSchema) => {
  return isFieldInFieldsAllowed({ field: schema, fieldsAllowed: dataset.fieldsAllowed })
}

const getSupportedSchemaFieldsDatasets = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema
) => {
  const datasetsWithSchemaFieldsSupport = dataview?.datasets?.flatMap((dataset) => {
    const hasSchemaFields = datasetHasSchemaFields(dataset, schema)
    const hasFieldsAllowed = datasetHasFieldsAllowed(dataset, schema)
    return hasSchemaFields && hasFieldsAllowed ? dataset : []
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
    return incompatibilityDict.filter(({ id, value, valueNot, disabled }) => {
      const selectedFilterValue = dataview.config?.filters?.[id]
      if (value === 'undefined' && selectedFilterValue === undefined && valueNot === undefined) {
        return disabled.includes(schema)
      }

      const selectedFilterValues = Array.isArray(selectedFilterValue)
        ? selectedFilterValue
        : [selectedFilterValue]

      if (value !== undefined) {
        const matchedValue =
          selectedFilterValue?.length === 1 &&
          (selectedFilterValue?.includes(value) || selectedFilterValue?.includes(value.toString()))
        return matchedValue && disabled.includes(schema)
      }
      if (valueNot !== undefined) {
        const matchedValue = selectedFilterValue
          ? selectedFilterValues.some((f) => f !== value && f !== valueNot.toString())
          : true
        return matchedValue && disabled.includes(schema)
      }
      return false
    })
  })
}

const getCommonSchemaTypeInDataview = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema
) => {
  const activeDatasets = getActiveDatasetsInDataview(dataview)
  const datasetSchemas = activeDatasets
    ?.map((d) => getDatasetSchemaItem(d, schema)?.type)
    .filter(Boolean)
  return datasetSchemas?.[0]
}

type SchemaFieldSelection = {
  id: string
  label: any
}

export const VESSEL_GROUPS_MODAL_ID = 'vesselGroupsOpenModalId'

export const getActiveDatasetsInDataview = (dataview: SchemaFieldDataview) => {
  if (!dataview) {
    return [] as Dataset[]
  }
  if (dataview.category === DataviewCategory.User) {
    return dataview.datasets
  }
  return dataview.config?.datasets
    ? dataview?.datasets?.filter((dataset) => dataview.config?.datasets?.includes(dataset.id))
    : dataview?.datasets
}

export const getCommonSchemaFieldsInDataview = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema,
  {
    vesselGroups = [],
    isGuestUser = true,
    compatibilityOperation = 'every',
    schemaOrigin,
  } = {} as GetSchemaInDataviewParams
): SchemaFieldSelection[] => {
  const activeDatasets = getActiveDatasetsInDataview(dataview)
  if (schema === 'flag') {
    return getFlags()
  } else if (schema === 'vessel-groups') {
    if (activeDatasets?.every((d) => d.fieldsAllowed?.includes(schema))) {
      if (isGuestUser) {
        return vesselGroups
      }
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
  const schemaType = getCommonSchemaTypeInDataview(dataview, schema)
  let schemaFields: DatasetSchemaItemEnum[] = (activeDatasets || [])?.map((d) => {
    const schemaItem = getDatasetSchemaItem(d, schema, schemaOrigin)
    const schemaEnum = schemaItem?.enum || schemaItem?.items?.enum || []
    return Array.isArray(schemaEnum)
      ? schemaEnum.filter((e) => e !== null && e !== undefined)
      : schemaEnum
  })
  if (schemaType === 'number' || schemaType === 'range') {
    const schemaConfig = getDatasetSchemaItem(activeDatasets?.[0] as Dataset, schema)
    if (schemaConfig && schemaConfig.min && schemaConfig.max) {
      schemaFields = [[schemaConfig?.min?.toString(), schemaConfig?.max?.toString()]]
    }
  }
  const cleanSchemaFields =
    compatibilityOperation === 'every' ? intersection(...schemaFields) : uniq(schemaFields.flat())
  const datasetId = removeDatasetVersion(activeDatasets?.[0]?.id as string)
  const commonSchemaFields = schemaFields
    ? cleanSchemaFields.map((field) => {
        let label =
          schemaType === 'range' || schemaType === 'number'
            ? field
            : t(`datasets:${datasetId}.schema.${schema}.enum.${field}`, field?.toString())
        if (label === field) {
          if (schema === 'geartypes' || schema === 'geartype') {
            // There is an fixed list of gearTypes independant of the dataset
            label = getVesselGearTypeLabel({ geartypes: field as string })
          } else if (schema === 'vessel_type') {
            label = getVesselShipTypeLabel({ shiptypes: field as string })
          } else if (
            dataview.category !== DataviewCategory.Context &&
            schema !== 'vessel_id' &&
            schema !== 'speed'
          ) {
            label = t(`vessel.${schema}.${field}`, capitalize(lowerCase(field as string)))
          }
        }
        return { id: field?.toString(), label: label as string }
      })
    : []
  return commonSchemaFields.sort(sortFields)
}

const getSchemaOptionsSelectedInDataview = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema,
  options: ReturnType<typeof getCommonSchemaFieldsInDataview>
) => {
  const schemaType = getCommonSchemaTypeInDataview(dataview, schema)
  if (schema === 'flag') {
    return getFlagsByIds(dataview.config?.filters?.flag || [])
  }
  if (schemaType === 'range' && dataview.config?.filters?.[schema]) {
    return dataview.config?.filters?.[schema]?.map((o: string) => [
      {
        id: o.toString(),
        label: o.toString(),
      },
    ])
  }
  if (
    schema === 'visibleValues' &&
    (dataview.config?.minVisibleValue || dataview.config?.maxVisibleValue)
  ) {
    const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings) as Dataset
    const layerRange = getEnvironmentalDatasetRange(dataset)
    const min = dataview.config?.minVisibleValue || layerRange?.min
    const max = dataview.config?.maxVisibleValue || layerRange?.max
    return [
      {
        id: min.toString(),
        label: formatI18nNumber(min),
      },
      {
        id: max.toString(),
        label: formatI18nNumber(max),
      },
    ]
  }

  return options?.filter((option) =>
    dataview.config?.filters?.[schema]?.map((o: string) => o?.toString())?.includes(option.id)
  )
}

export const getSchemaFilterOperationInDataview = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema
) => {
  if (
    schema === 'vessel-groups' ||
    schema === 'neural_vessel_type' ||
    dataview.category === DataviewCategory.Events ||
    dataview.category === DataviewCategory.Context
  ) {
    return
  }
  return dataview.config?.filterOperators?.[schema] || INCLUDE_FILTER_ID
}

const getSchemaFilterSingleSelection = (schema: SupportedDatasetSchema) => {
  return SINGLE_SELECTION_SCHEMAS.includes(schema)
}

export const getSchemaFilterUnitInDataview = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema
) => {
  return getDatasetSchemaItem(dataview.datasets?.[0] as Dataset, schema)?.unit
}

export const getSchemaFieldsSelectedInDataview = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema,
  params = {} as Pick<GetSchemaInDataviewParams, 'vesselGroups' | 'isGuestUser'>
) => {
  const options = getCommonSchemaFieldsInDataview(dataview, schema, params)
  const optionsSelected = getSchemaOptionsSelectedInDataview(dataview, schema, options)
  return optionsSelected
}

export type SchemaFilter = {
  type: DatasetSchemaType
  id: SupportedDatasetSchema
  label: string
  disabled: boolean
  options: ReturnType<typeof getCommonSchemaFieldsInDataview>
  optionsSelected: ReturnType<typeof getCommonSchemaFieldsInDataview>
  filterOperator: FilterOperator
  unit?: string
  singleSelection?: boolean
}
export const getFiltersBySchema = (
  dataview: SchemaFieldDataview,
  schema: SupportedDatasetSchema,
  {
    vesselGroups = [],
    compatibilityOperation = 'every',
    schemaOrigin,
    isGuestUser,
  } = {} as GetSchemaInDataviewParams
): SchemaFilter => {
  const options = getCommonSchemaFieldsInDataview(dataview, schema, {
    vesselGroups,
    compatibilityOperation,
    schemaOrigin,
    isGuestUser,
  })
  const type = getCommonSchemaTypeInDataview(dataview, schema) as DatasetSchemaType
  const singleSelection = getSchemaFilterSingleSelection(schema)
  const filterOperator = getSchemaFilterOperationInDataview(dataview, schema) as FilterOperator
  const optionsSelected = getSchemaOptionsSelectedInDataview(dataview, schema, options)
  const unit = getSchemaFilterUnitInDataview(dataview, schema)
  const datasetsWithSchema = getSupportedSchemaFieldsDatasets(dataview, schema)?.map((d) => d.id)
  const activeDatasets = getActiveDatasetsInDataview(dataview)?.map((d) => d.id)
  const hasDatasetsWithSchema =
    compatibilityOperation === 'some'
      ? activeDatasets?.some((d) => (datasetsWithSchema as string[]).includes(d))
      : activeDatasets?.every((d) => (datasetsWithSchema as string[]).includes(d))

  const incompatibleFilterSelection = getIncompatibleFilterSelection(dataview, schema)
  const hasIncompatibleFilterSelection =
    incompatibleFilterSelection !== undefined && incompatibleFilterSelection?.length > 0
  const disabled = !hasDatasetsWithSchema || hasIncompatibleFilterSelection
  const datasetId = removeDatasetVersion(getActiveDatasetsInDataview(dataview)?.[0]?.id as string)
  let label: string = CONTEXT_DATASETS_SCHEMAS.includes(schema as SupportedContextDatasetSchema)
    ? t(`datasets:${datasetId}.schema.${schema}.keyword`, schema.toString())
    : t(`vessel.${schema}`, { defaultValue: schema, count: 2 }) // We always want to show the plural for the multiselect
  if (schema === 'vessel-groups') {
    label = t('vesselGroup.vesselGroup', 'Vessel Group')
  }

  return {
    id: schema,
    label,
    unit,
    disabled,
    options,
    optionsSelected,
    type,
    filterOperator,
    singleSelection,
  }
}

export const getSchemaFiltersInDataview = (
  dataview: SchemaFieldDataview,
  { vesselGroups, fieldsToInclude, isGuestUser } = {} as GetSchemaInDataviewParams
): { filtersAllowed: SchemaFilter[]; filtersDisabled: SchemaFilter[] } => {
  let fieldsIds = uniq(
    dataview.datasets?.flatMap((d) => d.fieldsAllowed || []) || []
  ) as SupportedDatasetSchema[]
  if (fieldsToInclude?.length) {
    fieldsIds = fieldsIds.filter((f) => fieldsToInclude.includes(f))
  }
  if (dataview.datasets?.some((t) => t.type === DatasetTypes.Fourwings)) {
    // This filter avoids to show the selector for the vessel ids in fourwings layers
    fieldsIds = fieldsIds.filter((f) => f !== 'vessel_id')
  }

  const fieldsOrder = dataview.filtersConfig?.order as SupportedDatasetSchema[]
  const fieldsAllowed = fieldsIds.filter((f) => isDataviewSchemaSupported(dataview, f))
  const fieldsDisabled = fieldsIds.filter((f) => !isDataviewSchemaSupported(dataview, f))
  const fielsAllowedOrdered =
    fieldsOrder && fieldsOrder.length > 0
      ? fieldsAllowed.sort((a, b) => {
          const aIndex = fieldsOrder.findIndex((f) => f === a)
          const bIndex = fieldsOrder.findIndex((f) => f === b)
          return aIndex - bIndex
        })
      : fieldsAllowed
  const filtersAllowed = fielsAllowedOrdered.map((id) => {
    return getFiltersBySchema(dataview, id, {
      vesselGroups,
      isGuestUser,
      compatibilityOperation: id === 'speed' || id === 'elevation' ? 'some' : 'every',
    })
  })
  const filtersDisabled = fieldsDisabled.map((id) => {
    return getFiltersBySchema(dataview, id, {
      vesselGroups,
      isGuestUser,
      compatibilityOperation: id === 'speed' || id === 'elevation' ? 'some' : 'every',
    })
  })
  return {
    filtersAllowed,
    filtersDisabled,
  }
}
