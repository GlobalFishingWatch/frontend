import { uniq } from 'es-toolkit'
import intersection from 'lodash/intersection'

import type {
  Dataset,
  DatasetFilter,
  DatasetFilterOperation,
  DatasetFilterType,
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
  DatasetStatus,
  DatasetSubCategory,
  DatasetTypes,
  DataviewCategory,
  DataviewType,
  EndpointId,
  EventTypes,
  INCLUDE_FILTER_ID,
} from '@globalfishingwatch/api-types'
import { checkExistPermissionInList } from '@globalfishingwatch/auth-middleware/utils'
import {
  getDatasetConfigurationProperty,
  getDatasetGeometryType,
  getEnvironmentalDatasetRange,
  getFlattenDatasetFilters,
  removeDatasetVersion,
} from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { IconType, MultiSelectOption } from '@globalfishingwatch/ui-components'

import { DEFAULT_TIME_RANGE, FULL_SUFIX, PRIVATE_ICON, PUBLIC_SUFIX } from 'data/config'
import { VMS_DATAVIEW_INSTANCE_ID } from 'data/dataviews'
import i18n, { t } from 'features/i18n/i18n'
import { getDatasetNameTranslated } from 'features/i18n/utils.datasets'
import { getFlags, getFlagsByIds } from 'utils/flags'
import { getVesselGearTypeLabel, getVesselShipTypeLabel } from 'utils/info'
import { getPorts, getPortsByIds } from 'utils/ports'
import { sortFields } from 'utils/shared'

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

export type SupportedDatasetFilter =
  | SupportedActivityDatasetFilter
  | SupportedEnvDatasetFilter
  | SupportedContextDatasetFilter
  | SupportedEventsDatasetFilter
  | SupportedVesselDatasetFilter

type SupportedActivityDatasetFilter =
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
  | 'distance_from_port_km'

// Speed flag and vessels only added to debug purposes of vessel speed dataset
// Context env layers filtesr: Seamounts => height & Ecoregions => REALM
export type SupportedEnvDatasetFilter =
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
type SupportedContextDatasetFilter = 'removal_of' | 'vessel_id'
type SupportedEventsDatasetFilter = 'duration' | 'encounter_type' | 'type' | 'next_port_id'
type SupportedVesselDatasetFilter = 'owner' | 'shiptypes' | 'geartypes'

// TODO:DR review if SINGLE_SELECTION_FILTERS is still needed or we can trust the endpoint config
const SINGLE_SELECTION_FILTERS: SupportedDatasetFilter[] = ['vessel-groups', 'period', 'scenario']

const EXPERIMENTAL_FIELDS_BY_FILTER: { [key in SupportedDatasetFilter]?: string[] } = {
  encounter_type: ['FISHING-BUNKER', 'FISHING-FISHING', 'CARRIER-BUNKER'],
}

type FilterCompatibilityOperation = 'every' | 'some'
// TODO:DR review if FilterOriginParam is still needed
type FilterOriginParam = keyof Pick<IdentityVessel, 'selfReportedInfo' | 'registryInfo'> | 'all'
export type GetFiltersInDataviewParams = {
  fieldsToInclude?: SupportedDatasetFilter[]
  vesselGroups?: MultiSelectOption[]
  compatibilityOperation?: FilterCompatibilityOperation
  filterOrigin?: FilterOriginParam
  isGuestUser?: boolean
}

export type DataviewWithFilters =
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
  if (isPrivateDataset(dataset)) return `${PRIVATE_ICON} ${label}`
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
    (dataset.subcategory === 'user' || dataset.subcategory === 'user-interactive')
  )
}

export const groupDatasetsByGeometryType = (datasets: Dataset[]): Record<string, Dataset[]> => {
  const orderedObject: Record<string, Dataset[]> = {
    tracks: [],
    polygons: [],
    points: [],
    bigQuery: [],
  }

  return datasets.reduce((acc, dataset) => {
    if (getIsBQEditorDataset(dataset)) {
      if (dataset.status !== DatasetStatus.Deleted) {
        acc.bigQuery.push(dataset)
      }
      return acc
    }
    const geometryType = getDatasetConfigurationProperty({
      dataset,
      property: 'geometryType',
    })
    if (!geometryType) {
      return acc
    }
    if (!acc[geometryType]) {
      acc[geometryType] = []
    }
    acc[geometryType].push(dataset)
    return acc
  }, orderedObject)
}

export const getDatasetSourceIcon = (dataset: Dataset): IconType | null => {
  const source = dataset?.source?.toLowerCase()
  if (!source) {
    return null
  }
  // Activity, Detections & Events
  if (source === 'global fishing watch' || source === 'gfw') return 'gfw-logo'
  // Environment
  if (source.includes('hycom')) return 'hycom-logo'
  if (source.includes('copernicus')) return 'copernicus-logo'
  if (source.includes('nasa')) return 'nasa-logo'
  if (source.includes('pacioos')) return 'pacioos-logo'
  if (source.includes('gebco')) return 'gebco-logo'
  if (source.includes('geospatial conservation atlas')) return 'gca-logo'
  if (source.includes('unep')) return 'unep-logo'
  if (source.includes('blue habitats')) return 'blue-habitats-logo'
  // Reference
  if (source.includes('protectedplanet')) return 'protected-planet-logo'
  if (source.includes('protectedseas')) return 'protected-seas-logo'
  if (source.includes('marineregions')) return 'marine-regions-logo'
  if (source.includes('fao')) return 'fao-logo'
  if (source.includes('mpatlas')) return 'mci-logo'
  if (source.includes('duke')) return 'duke-logo'

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
    const sourceType = dataviewInstance.id
      .toString()
      .toLowerCase()
      .includes(VMS_DATAVIEW_INSTANCE_ID)
      ? 'VMS'
      : 'AIS'
    datasetTitle = `${t((t) => t.common.apparentFishing)} (${sourceType})`
  } else if (category === DatasetCategory.Activity && subcategory === DatasetSubCategory.Presence) {
    datasetTitle = t((t) => t.common.presence)
  } else if (category === DatasetCategory.Detections && subcategory === DatasetSubCategory.Viirs) {
    datasetTitle = t((t) => t.common.viirs)
  } else if (category === DatasetCategory.Detections && subcategory === DatasetSubCategory.Sar) {
    datasetTitle = t((t) => t.common.sar)
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
      ? `(${dataview.datasets?.length} ${t((t) => t.common.sources)})`
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
  const allDataviews = [...(dataviews || []), ...(dataviewInstances || [])]
  if (!allDataviews?.length) {
    return []
  }
  const datasets = allDataviews.flatMap((dataview) => {
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

export const getActiveDatasetsInDataview = (dataview: DataviewWithFilters) => {
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

export const hasDatasetConfigVesselData = (datasetConfig: DataviewDatasetConfig) => {
  return (
    datasetConfig?.query?.find((q) => q.id === 'vessels')?.value ||
    datasetConfig?.params?.find((q) => q.id === 'vesselId')?.value
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
            d.category === DatasetCategory.Event ||
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
  const dataviewDatasets = dataviews
    .flatMap((dataview) => getActiveDatasetsInDataview(dataview) || [])
    .map((d) => d.id)
  const datasetsDownloadSupported = getActivityDatasetsReportSupported(dataviews, permissions)
  return dataviewDatasets.filter((dataset) => datasetsDownloadSupported.includes(dataset))
}

export const getDatasetsReportNotSupported = (
  dataviews: UrlDataviewInstance<DataviewType>[],
  permissions: UserPermission[] = []
) => {
  const dataviewDatasets = dataviews
    .flatMap((dataview) => getActiveDatasetsInDataview(dataview) || [])
    .map((d) => d.id)
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

export const getDatasetFiltersAllowed = (dataset: Dataset) => {
  if (!dataset?.filters) {
    return []
  }
  const flattenFilters = getFlattenDatasetFilters(dataset.filters)
  return flattenFilters.flatMap((filter) => (filter.enabled ? filter.id : []))
}

const isDataviewFilterSupported = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter
) => {
  const activeDatasets = dataview.config?.datasets
  const filtersSupported = dataview?.datasets
    ?.filter((dataset) => activeDatasets?.includes(dataset.id))
    .every((dataset) => {
      const filtersAllowed = getDatasetFiltersAllowed(dataset)
      const filterAllowed = filtersAllowed.includes(filter)
      const incompatibleSelection = getIncompatibleFilterSelection(dataview, filter)
      return filterAllowed && incompatibleSelection?.length === 0
    })
  return filtersSupported
}

// TODO:DR review if filterOrigin is still needed
const getFilterConfigByOrigin = (
  dataset: Dataset,
  filter: SupportedDatasetFilter,
  filterOrigin: Exclude<FilterOriginParam, 'all'>
) => {
  const filters = getFlattenDatasetFilters(dataset.filters)
  const filterConfig = filters.find((f) => f.id === `${filterOrigin}.${filter}`)
  if (filterConfig) {
    return filterConfig
  }
  // combinedSourcesInfo so far only applies for selfReportInfo properties
  if (filterOrigin !== 'registryInfo' && (filter === 'geartypes' || filter === 'shiptypes')) {
    return filters.find((f) => f.id === `combinedSourcesInfo.${filter}.name`)
  }
}

// TODO:DR review if filterOrigin is still needed
const combineFilterConfigs = (filterConfig1: DatasetFilter, filterConfig2: DatasetFilter) => {
  if (!filterConfig1 || !filterConfig2) {
    return filterConfig1 || filterConfig2
  }

  if (filterConfig1.array && filterConfig2.array) {
    return {
      ...filterConfig1,
      enum: uniq([...(filterConfig1?.enum || []), ...(filterConfig2?.enum || [])]).sort(),
    } as DatasetFilter
  }

  console.warn('filter configs not compatible to merge, returing first filter config')
  return filterConfig1 || filterConfig2
}

export const getDatasetFilterItem = (
  dataset: Dataset,
  filter: SupportedDatasetFilter
  // filterOrigin: FilterOriginParam = 'selfReportedInfo'
): DatasetFilter | null => {
  const filters = getFlattenDatasetFilters(dataset.filters)
  const filterItem = filters.find((f) => f.id === filter)
  if (filterItem) {
    return filterItem
  }
  // TODO:DR review if filterOrigin 'all' is still needed
  // if (filterOrigin === 'all') {
  //   const selfReportedInfo = getDatasetFilterConfig(dataset, filter, 'selfReportedInfo')
  //   const registryInfo = getDatasetFilterConfig(dataset, filter, 'registryInfo')
  //   if (selfReportedInfo && registryInfo) {
  //     return combineFilterConfigs(selfReportedInfo, registryInfo)
  //   }
  //   return selfReportedInfo || registryInfo || null
  // } else {
  //   const nestedFilterConfig = getFilterConfigByOrigin(dataset, filter, filterOrigin)
  //   if (nestedFilterConfig) {
  //     return nestedFilterConfig
  //   }
  // }

  return null
}

const datasetHasFilter = (dataset: Dataset, filter: SupportedDatasetFilter) => {
  if (filter === 'vessel-groups') {
    // returning true as the filter fields enum comes from the dynamic fetch list passed as props
    return true
  }
  if (filter === 'flag') {
    const fieldsAllowed = getDatasetFiltersAllowed(dataset)
    return fieldsAllowed.some((f) => f.includes(filter))
  }
  const filterConfig = getDatasetFilterItem(dataset, filter)
  if (!filterConfig) {
    return false
  }
  if (
    filterConfig.type === 'range' ||
    filterConfig.array === true ||
    filterConfig.type === 'boolean'
  ) {
    const filterEnum = filterConfig?.enum
    return filterEnum !== undefined && filterEnum.length > 0
  }
  return filterConfig.type === 'string' || filterConfig.type === 'number'
}

export const isFilterInFiltersAllowed = ({
  filter,
  filtersAllowed,
  infoSource,
}: {
  filter: SupportedDatasetFilter
  filtersAllowed: string[]
  // TODO:DR review if infoSource is still needed
  infoSource?: VesselIdentitySourceEnum
}): boolean => {
  return filtersAllowed?.some((f) => {
    return (
      f === filter ||
      f.includes(filter) ||
      // TODO:DR review if infoSource is still needed
      f === `${infoSource}.${filter}` ||
      (filter === 'owner' && f === 'registryOwners.name') ||
      (filter === 'shiptypes' && f === 'combinedSourcesInfo.shiptypes.name') ||
      (filter === 'geartypes' && f === 'combinedSourcesInfo.geartypes.name')
    )
  })
}

const datasetHasFilterAllowed = (dataset: Dataset, filter: SupportedDatasetFilter) => {
  return isFilterInFiltersAllowed({
    filter,
    filtersAllowed: getDatasetFiltersAllowed(dataset),
  })
}

const getSupportedFilterDatasets = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter
) => {
  const datasetsWithFiltersSupport = dataview?.datasets?.flatMap((dataset) => {
    const hasFilter = datasetHasFilter(dataset, filter)
    const hasFiltersAllowed = datasetHasFilterAllowed(dataset, filter)
    return hasFilter && hasFiltersAllowed ? dataset : []
  })
  return datasetsWithFiltersSupport
}

export const getNotSupportedFilterDatasets = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter
) => {
  const datasetsWithoutFiltersSupport = dataview?.datasets?.flatMap((dataset) => {
    const hasFilter = datasetHasFilter(dataset, filter)
    const datasetSelected = dataview.config?.datasets?.includes(dataset.id)
    if (!datasetSelected || hasFilter) {
      return []
    }
    return dataset
  })
  return datasetsWithoutFiltersSupport
}

export const getIncompatibleFilterSelection = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter
) => {
  return dataview?.datasets?.flatMap((dataset) => {
    const incompatibilityDict = dataview.filtersConfig?.incompatibility?.[dataset.id]
    if (!incompatibilityDict?.length) {
      return []
    }
    return incompatibilityDict.filter(({ id, value, valueNot, disabled }) => {
      const selectedFilterValue = dataview.config?.filters?.[id]
      if (value === 'undefined' && selectedFilterValue === undefined && valueNot === undefined) {
        return disabled.includes(filter)
      }

      const selectedFilterValues = Array.isArray(selectedFilterValue)
        ? selectedFilterValue
        : [selectedFilterValue]

      if (value !== undefined) {
        const matchedValue =
          selectedFilterValue?.length === 1 &&
          (selectedFilterValue?.includes(value) || selectedFilterValue?.includes(value.toString()))
        return matchedValue && disabled.includes(filter)
      }
      if (valueNot !== undefined) {
        const matchedValue = selectedFilterValue
          ? selectedFilterValues.some((f) => f !== value && f !== valueNot.toString())
          : true
        return matchedValue && disabled.includes(filter)
      }
      return false
    })
  })
}

const getCommonFilterTypeInDataview = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter
) => {
  const activeDatasets = getActiveDatasetsInDataview(dataview)
  const datasetFilters = activeDatasets
    ?.map((d) => getDatasetFilterItem(d, filter)?.type)
    .filter(Boolean)
  return datasetFilters?.[0]
}

type DaataviewFilterSelection = {
  id: string
  label: any
}

export const VESSEL_GROUPS_MODAL_ID = 'vesselGroupsOpenModalId'

export const getCommonFiltersInDataview = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter,
  {
    vesselGroups = [],
    isGuestUser = true,
    compatibilityOperation = 'every',
  } = {} as GetFiltersInDataviewParams
): DaataviewFilterSelection[] => {
  const activeDatasets = getActiveDatasetsInDataview(dataview)
  if (dataview.category !== DataviewCategory.User && filter === 'flag') {
    return getFlags()
  } else if (filter === 'next_port_id') {
    return getPorts()
  } else if (filter === 'vessel-groups') {
    if (activeDatasets?.every((d) => getDatasetFiltersAllowed(d)?.includes(filter))) {
      if (isGuestUser) {
        return vesselGroups
      }
      const addNewGroup = {
        id: VESSEL_GROUPS_MODAL_ID,
        label: t((t) => t.vesselGroup.createNewGroup),
        disableSelection: true,
        className: styles.openModalLink,
      } as MultiSelectOption
      return [addNewGroup, ...vesselGroups]
    }
    return []
  }
  const filterType = getCommonFilterTypeInDataview(dataview, filter)
  let filterFields = (activeDatasets || [])?.map((d) => {
    const filterConfig = getDatasetFilterItem(d, filter)
    const filterEnum = filterConfig?.enum || []
    return Array.isArray(filterEnum)
      ? filterEnum.filter((e) => e !== null && e !== undefined)
      : filterEnum
  })
  if (filterType === 'number' || filterType === 'range') {
    const filterConfig = getDatasetFilterItem(activeDatasets?.[0] as Dataset, filter)
    if (filterConfig && filterConfig.min && filterConfig.max) {
      filterFields = [[filterConfig?.min?.toString(), filterConfig?.max?.toString()]]
    }
  }
  const cleanFilterFields =
    compatibilityOperation === 'every' ? intersection(...filterFields) : uniq(filterFields.flat())
  const datasetId = removeDatasetVersion(activeDatasets?.[0]?.id as string)
  let commonFilters = filterFields
    ? cleanFilterFields.map((field) => {
        let label =
          filterType === 'range' || filterType === 'number'
            ? field
            : t((t: any) => t[datasetId]?.schema?.[filter]?.enum?.[field as string], {
                ns: 'datasets',
                defaultValue: field?.toString(),
              })
        if (EXPERIMENTAL_FIELDS_BY_FILTER[filter]?.includes(field as string)) {
          label += ' (Experimental)'
        }
        if (label === field) {
          if (filter === 'geartypes' || filter === 'geartype') {
            // There is an fixed list of gearTypes independant of the dataset
            label = getVesselGearTypeLabel({ geartypes: field as string })
          } else if (filter === 'vessel_type') {
            label = getVesselShipTypeLabel({ shiptypes: field as string })
          } else if (
            dataview.category !== DataviewCategory.Context &&
            filter !== 'vessel_id' &&
            filter !== 'speed' &&
            filter !== 'encounter_type'
          ) {
            const fallbackValue = typeof field === 'string' ? field : (field || '').toString()
            label = t((t: any) => t.vessel?.[filter]?.[field as string], {
              defaultValue: fallbackValue,
            })
          }
        }
        return { id: field?.toString(), label: label as string }
      })
    : []

  if (filter === 'encounter_type') {
    commonFilters = commonFilters.filter((field, index, self) => {
      const [first, second] = field.id.split('-')
      const reverseId = `${second}-${first}`
      const isReverse = !self.some((f, i) => i < index && f.id === reverseId)
      return isReverse
    })
  }

  return commonFilters.sort(sortFields)
}

const getFilterOptionsSelectedInDataview = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter,
  options: ReturnType<typeof getCommonFiltersInDataview>
) => {
  const filterType = getCommonFilterTypeInDataview(dataview, filter)
  if (dataview.category !== DataviewCategory.User && filter === 'flag') {
    return getFlagsByIds(dataview.config?.filters?.flag || [])
  }
  if (filterType === 'range' && dataview.config?.filters?.[filter]) {
    return dataview.config?.filters?.[filter]?.map((o: string) => [
      {
        id: o.toString(),
        label: o.toString(),
      },
    ])
  }
  if (
    filter === 'visibleValues' &&
    (dataview.config?.minVisibleValue || dataview.config?.maxVisibleValue)
  ) {
    const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings) as Dataset
    const layerRange = getEnvironmentalDatasetRange(dataset)
    const min = dataview.config?.minVisibleValue || layerRange?.min
    const max = dataview.config?.maxVisibleValue || layerRange?.max
    return [
      {
        id: min.toString(),
        label: min,
      },
      {
        id: max.toString(),
        label: max,
      },
    ]
  }

  if (filter === 'next_port_id' && dataview.config?.filters?.next_port_id) {
    const ports = getPortsByIds(dataview.config?.filters?.next_port_id || [])
    if (ports.length) {
      return ports
    }
    const nextPortIds = Array.isArray(dataview.config?.filters?.next_port_id)
      ? dataview.config?.filters?.next_port_id
      : [dataview.config?.filters?.next_port_id]
    return nextPortIds.map((id) => ({ id, label: id }))
  }

  return options?.filter((option) => {
    const filterValues = dataview.config?.filters?.[filter] as string | string[]
    return Array.isArray(filterValues)
      ? filterValues.map((f) => f.toString()).includes(option.id)
      : filterValues?.toString() === option.id
  })
}

export const getFilterOperationInDataview = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter
) => {
  if (
    filter === 'vessel-groups' ||
    filter === 'neural_vessel_type' ||
    dataview.category === DataviewCategory.Context
  ) {
    return
  }
  return dataview.config?.filterOperators?.[filter] || INCLUDE_FILTER_ID
}

const getIsFilterSingleSelection = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter
) => {
  // TODO:DR replace this with singleSelection
  // return SINGLE_SELECTION_FILTERS.includes(filter)
  const filterConfig = getDatasetFilterItem(dataview.datasets?.[0] as Dataset, filter)
  return filterConfig?.singleSelection
}

const getFilterOperation = (dataview: DataviewWithFilters, filter: SupportedDatasetFilter) => {
  const filterConfig = getDatasetFilterItem(dataview.datasets?.[0] as Dataset, filter)
  return filterConfig?.operation
}

export const getFilterUnitInDataview = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter
) => {
  return getDatasetFilterItem(dataview.datasets?.[0] as Dataset, filter)?.unit
}

export const getFiltersSelectedInDataview = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter,
  params = {} as Pick<GetFiltersInDataviewParams, 'vesselGroups' | 'isGuestUser'>
) => {
  const options = getCommonFiltersInDataview(dataview, filter, params)
  const optionsSelected = getFilterOptionsSelectedInDataview(dataview, filter, options)
  return optionsSelected
}

export const getFilterLabel = (filter: SupportedDatasetFilter, datasetId: string) => {
  if (datasetId && i18n.exists(`datasets:${datasetId}.schema.${filter}.keyword`)) {
    const label = t((t) => t[datasetId]?.schema?.[filter]?.keyword, {
      ns: 'datasets',
      defaultValue: filter.toString(),
    })
    if (label !== filter) {
      return label
    }
  }
  if (i18n.exists(`vessel.${filter}`)) {
    const label = t((t: any) => t.vessel[filter], { defaultValue: filter.toString(), count: 2 })
    if (label !== filter) {
      return label
    }
  }
  return t((t: any) => t.layer[filter], { defaultValue: filter.toString() })
}

export type DataviewFilterConfig = {
  type: DatasetFilterType
  id: SupportedDatasetFilter
  label: string
  disabled: boolean
  options: ReturnType<typeof getCommonFiltersInDataview>
  optionsSelected: ReturnType<typeof getCommonFiltersInDataview>
  unit?: string
  operation?: DatasetFilterOperation
  filterOperator: FilterOperator
  singleSelection?: boolean
}

export const getDataviewFilterConfig = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter,
  {
    vesselGroups = [],
    compatibilityOperation = 'every',
    filterOrigin,
    isGuestUser,
  } = {} as GetFiltersInDataviewParams
): DataviewFilterConfig => {
  const options = getCommonFiltersInDataview(dataview, filter, {
    vesselGroups,
    compatibilityOperation,
    filterOrigin,
    isGuestUser,
  })
  const type = getCommonFilterTypeInDataview(dataview, filter) as DatasetFilterType
  const singleSelection = getIsFilterSingleSelection(dataview, filter)
  const operation = getFilterOperation(dataview, filter) as DatasetFilterOperation
  const filterOperator = getFilterOperationInDataview(dataview, filter) as FilterOperator
  const optionsSelected = getFilterOptionsSelectedInDataview(dataview, filter, options)
  const unit = getFilterUnitInDataview(dataview, filter)
  const datasetsWithFilter = getSupportedFilterDatasets(dataview, filter)?.map((d) => d.id)
  const activeDatasets = getActiveDatasetsInDataview(dataview)?.map((d) => d.id)
  const hasDatasetsWithFilter =
    compatibilityOperation === 'some'
      ? activeDatasets?.some((d) => (datasetsWithFilter as string[]).includes(d))
      : activeDatasets?.every((d) => (datasetsWithFilter as string[]).includes(d))

  const incompatibleFilterSelection = getIncompatibleFilterSelection(dataview, filter)
  const hasIncompatibleFilterSelection =
    incompatibleFilterSelection !== undefined && incompatibleFilterSelection?.length > 0
  const disabled = !hasDatasetsWithFilter || hasIncompatibleFilterSelection
  const datasetId = removeDatasetVersion(getActiveDatasetsInDataview(dataview)?.[0]?.id as string)
  const label = getFilterLabel(filter, datasetId)

  return {
    id: filter,
    label,
    unit,
    disabled,
    options,
    optionsSelected,
    type,
    operation,
    filterOperator,
    singleSelection,
  }
}

export const getFiltersInDataview = (
  dataview: DataviewWithFilters,
  { vesselGroups, fieldsToInclude, isGuestUser } = {} as GetFiltersInDataviewParams
): { filtersAllowed: DataviewFilterConfig[]; filtersDisabled: DataviewFilterConfig[] } => {
  let fieldsIds = uniq(
    dataview.datasets?.flatMap((dataset) => getDatasetFiltersAllowed(dataset)) || []
  ) as SupportedDatasetFilter[]
  if (fieldsToInclude?.length) {
    fieldsIds = fieldsIds.filter((f) => fieldsToInclude.includes(f))
  }
  if (dataview.datasets?.some((t) => t.type === DatasetTypes.Fourwings)) {
    // This filter avoids to show the selector for the vessel ids in fourwings layers
    fieldsIds = fieldsIds.filter((f) => f !== 'vessel_id')
  }

  const fieldsOrder = dataview.filtersConfig?.order as SupportedDatasetFilter[]
  const fieldsAllowed = fieldsIds.filter((f) => isDataviewFilterSupported(dataview, f))
  const fieldsDisabled = fieldsIds.filter((f) => !isDataviewFilterSupported(dataview, f))
  const fielsAllowedOrdered =
    fieldsOrder && fieldsOrder.length > 0
      ? fieldsAllowed.sort((a, b) => {
          const aIndex = fieldsOrder.findIndex((f) => f === a)
          const bIndex = fieldsOrder.findIndex((f) => f === b)
          return aIndex - bIndex
        })
      : fieldsAllowed
  const filtersAllowed = fielsAllowedOrdered.map((id) => {
    return getDataviewFilterConfig(dataview, id, {
      vesselGroups,
      isGuestUser,
      compatibilityOperation: id === 'speed' || id === 'elevation' ? 'some' : 'every',
    })
  })
  const filtersDisabled = fieldsDisabled.map((id) => {
    return getDataviewFilterConfig(dataview, id, {
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
