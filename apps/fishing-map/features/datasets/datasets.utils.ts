import { uniq } from 'es-toolkit'

import type {
  Dataset,
  Dataview,
  DataviewInstance,
  DataviewType,
} from '@globalfishingwatch/api-types'
import {
  DatasetCategory,
  DatasetStatus,
  DatasetSubCategory,
  DatasetTypes,
  DataviewCategory,
  EventTypes,
} from '@globalfishingwatch/api-types'
import {
  getDatasetConfigurationProperty,
  getDatasetGeometryType,
  getDatasetsLatestEndDate,
} from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { IconType } from '@globalfishingwatch/ui-components'

import { DEFAULT_TIME_RANGE, FULL_SUFIX, PRIVATE_ICON, PUBLIC_SUFIX } from 'data/config'
import { VMS_DATAVIEW_INSTANCE_ID } from 'data/dataviews'
import { t } from 'features/i18n/i18n'
import { getDatasetNameTranslated } from 'features/i18n/utils.datasets'

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
  dataview: Dataview | UrlDataviewInstance | undefined,
  { showPrivateIcon = true, withSources = false } = {}
): string => {
  if (!dataview) return ''
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
      const value = dataview.config?.[d]
      return Array.isArray(value) ? value : []
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
  return getDatasetsLatestEndDate(datasets, datasetCategory) || DEFAULT_TIME_RANGE.end
}

export const getActiveDatasetsInDataview = (dataview: Dataview | UrlDataviewInstance) => {
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
