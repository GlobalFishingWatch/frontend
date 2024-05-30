import { uniqBy } from 'lodash'
import {
  Dataset,
  DatasetSchema,
  DatasetSchemaItem,
  DatasetTypes,
  Dataview,
  DataviewCategory,
  DataviewType,
  DataviewDatasetConfig,
  DataviewInstance,
  EndpointId,
  EXCLUDE_FILTER_ID,
  FilterOperator,
  INCLUDE_FILTER_ID,
  Resource,
} from '@globalfishingwatch/api-types'
import { resolveEndpoint } from '@globalfishingwatch/datasets-client'

export function getMergedDataviewId(dataviews: UrlDataviewInstance[]) {
  if (!dataviews.length) {
    console.warn('Trying to merge empty dataviews')
    return 'EMPTY_DATAVIEW'
  }
  return dataviews.map((d) => d.id).join(',')
}

export type UrlDataviewInstance<T = DataviewType> = Omit<DataviewInstance<T>, 'dataviewId'> & {
  dataviewId?: Dataview['id'] | Dataview['slug'] // making this optional as sometimes we just need to reference the id
  deleted?: boolean // needed when you want to override from url an existing workspace config
}

export const FILTER_OPERATOR_SQL: Record<FilterOperator, string> = {
  [INCLUDE_FILTER_ID]: 'IN',
  [EXCLUDE_FILTER_ID]: 'NOT IN',
}

export const FILTERABLE_GENERATORS: DataviewType[] = [
  DataviewType.HeatmapAnimated,
  DataviewType.HeatmapStatic,
  DataviewType.TileCluster,
  DataviewType.UserContext,
  DataviewType.UserPoints,
]

function getDatasetSchemaItem(dataset: Dataset, schema: string) {
  return (
    (dataset?.schema?.[schema] as DatasetSchemaItem) ||
    (dataset?.schema?.selfReportedInfo as DatasetSchema)?.items?.[schema]
  )
}

function isFilterableDataviewInstanceGenerator(dataviewInstance: UrlDataviewInstance) {
  return FILTERABLE_GENERATORS.some((generator) => generator === dataviewInstance.config?.type)
}

/**
 * Detects newly instanciated dataviews in workspaceDataviewInstances
 * @param workspaceDataviewInstances
 * @param urlDataviewInstances
 * @returns
 */
export const mergeWorkspaceUrlDataviewInstances = (
  workspaceDataviewInstances: DataviewInstance<any>[],
  urlDataviewInstances: UrlDataviewInstance[]
): UrlDataviewInstance[] | undefined => {
  // Split url dataviews by new or just overwriting the workspace to easily grab them later
  const urlDataviews = (urlDataviewInstances || []).reduce<
    Record<'workspace' | 'new', UrlDataviewInstance[]>
  >(
    (acc, urlDataview) => {
      const isInWorkspace = workspaceDataviewInstances?.some(
        (dataviewInstance) => dataviewInstance.id === urlDataview.id
      )
      if (isInWorkspace) {
        acc.workspace.push(urlDataview)
      } else {
        acc.new.push(urlDataview)
      }
      return acc
    },
    { workspace: [], new: [] }
  )

  const workspaceDataviewInstancesMerged = (workspaceDataviewInstances || []).map(
    (workspaceDataviewInstance) => {
      const urlDataviewInstance = urlDataviews.workspace.find(
        (d) => d.id === workspaceDataviewInstance.id
      )
      if (!urlDataviewInstance) return workspaceDataviewInstance
      const datasetsConfig =
        urlDataviewInstance.datasetsConfig || workspaceDataviewInstance.datasetsConfig || []
      return {
        ...workspaceDataviewInstance,
        ...urlDataviewInstance,
        config: {
          ...workspaceDataviewInstance.config,
          ...urlDataviewInstance.config,
        },
        datasetsConfig,
      }
    }
  )

  return [...urlDataviews.new, ...workspaceDataviewInstancesMerged]
}

export const getDatasetConfigsByDatasetType = (
  dataview: UrlDataviewInstance,
  type: DatasetTypes
): DataviewDatasetConfig[] => {
  const availableDatasets = dataview.datasets || []
  const availableDatasetConfigs = dataview.datasetsConfig || []
  const datasets = availableDatasets.filter((dataset) => dataset.type === type)
  const datasetIds = datasets.map((dataset) => dataset.id)
  const datasetConfigs = availableDatasetConfigs.filter((datasetConfig) =>
    datasetIds.includes(datasetConfig.datasetId)
  )
  if (type === DatasetTypes.Tracks && !datasetConfigs.length) {
    // This supports legacy dataviewInstances with no datasetConfig
    // for example: a pinned vessel with public-global-carriers-tracks:v20201001 dataset
    // won't work as the defuault dataview now points to public-global-all-tracks
    const legacyDatasetConfig = availableDatasetConfigs.find(
      (d) => d.endpoint === EndpointId.Tracks
    )
    if (legacyDatasetConfig) {
      return [legacyDatasetConfig]
    }
  }
  return datasetConfigs
}

export const getDatasetConfigByDatasetType = (
  dataview: UrlDataviewInstance,
  type: DatasetTypes
): DataviewDatasetConfig => {
  return getDatasetConfigsByDatasetType(dataview, type)[0]
}

/**
 * Collect only necessary datasetConfigs for track dataviews
 */
const getTrackDataviewDatasetConfigs = (
  dataviewInstance: UrlDataviewInstance
): DataviewDatasetConfig[] => {
  const info = getDatasetConfigByDatasetType(dataviewInstance, DatasetTypes.Vessels)

  const trackDatasetType =
    dataviewInstance.datasets && dataviewInstance.datasets?.[0]?.type === DatasetTypes.UserTracks
      ? DatasetTypes.UserTracks
      : DatasetTypes.Tracks
  const track = { ...getDatasetConfigByDatasetType(dataviewInstance, trackDatasetType) }

  const events = getDatasetConfigsByDatasetType(dataviewInstance, DatasetTypes.Events).filter(
    (datasetConfig) => datasetConfig.query?.find((q) => q.id === 'vessels')?.value
  ) // Loitering

  return [info, track, ...events]
}

export type DatasetConfigsTransforms = Partial<
  Record<DataviewType, (datasetConfigs: DataviewDatasetConfig[]) => DataviewDatasetConfig[]>
>

/**
 * DEPRECATED: use resources/getResources
 * Prepare dataviews for querying resources, by altering datasetConfigs
 * - Filter out non track dvs
 * - Add thinning query params
 * - Add extra dataset config for track speed, if needed
 * - Filter events dataset configs
 */
export const getDataviewsForResourceQuerying = (
  dataviewInstances: UrlDataviewInstance[],
  datasetConfigsTransform?: DatasetConfigsTransforms
) => {
  if (!dataviewInstances) return []
  const preparedDataviewsInstances = dataviewInstances.map((dataviewInstance) => {
    let preparedDatasetConfigs
    switch (dataviewInstance.config?.type) {
      case DataviewType.Track:
        preparedDatasetConfigs = getTrackDataviewDatasetConfigs(dataviewInstance)
        preparedDatasetConfigs =
          datasetConfigsTransform?.[DataviewType.Track]?.(preparedDatasetConfigs)
        break

      default:
        return dataviewInstance
    }
    const preparedDataview = {
      ...dataviewInstance,
      datasetsConfig: preparedDatasetConfigs,
    }
    return preparedDataview
  })
  return preparedDataviewsInstances
}

/**
 * DEPRECATED: use resources/getResources
 * Collect available datasetConfigs from dataviews and prepare resource
 */
export const resolveResourcesFromDatasetConfigs = (
  dataviews: UrlDataviewInstance[]
): Resource[] => {
  return dataviews
    .filter((dataview) => dataview.config?.type === DataviewType.Track)
    .flatMap((dataview) => {
      if (!dataview.datasetsConfig) return []
      return dataview.datasetsConfig.flatMap((datasetConfig) => {
        // Only load info endpoint when dataview visibility is set to false
        if (!dataview.config?.visible && datasetConfig.endpoint !== EndpointId.Vessel) return []
        const dataset = dataview.datasets?.find((dataset) => dataset.id === datasetConfig.datasetId)
        if (!dataset) return []
        const url = resolveEndpoint(dataset, datasetConfig)
        if (!url) return []
        return [{ dataset, datasetConfig, url, dataviewId: dataview.dataviewId as string }]
      })
    })
}

export const generateDataviewDatasetResourceKey = (
  dataset: Dataset,
  datasetConfig: DataviewDatasetConfig
) => {
  return [
    dataset.id,
    ...(datasetConfig.params || []).map((p) => p.value),
    ...(datasetConfig.query || []).map((q) => q.value),
  ].join(',')
}

/**
 * Get resources for a dataview
 */
export const resolveDataviewDatasetResources = (
  dataview: UrlDataviewInstance,
  datasetTypeOrId: DatasetTypes | DatasetTypes[] | string
) => {
  const isArray = Array.isArray(datasetTypeOrId)
  const isType = isArray || Object.values(DatasetTypes).includes(datasetTypeOrId as DatasetTypes)
  let types: DatasetTypes[]
  if (isType) {
    types = isArray ? (datasetTypeOrId as DatasetTypes[]) : [datasetTypeOrId as DatasetTypes]
  }

  const dataviewDatasets = dataview.datasets || []

  const datasets = isType
    ? dataviewDatasets.filter((dataset) => types.includes(dataset.type))
    : dataviewDatasets.filter((dataset) => dataset.id === datasetTypeOrId)

  const dataviewDatasetConfigs = dataview.datasetsConfig || []

  const resources = datasets.flatMap((dataset) => {
    const datasetDatasetConfigs = dataviewDatasetConfigs.filter(
      (datasetConfig) => datasetConfig.datasetId === dataset.id
    )
    const datasetResources = datasetDatasetConfigs.flatMap((datasetConfig) => {
      const url = resolveEndpoint(dataset, datasetConfig)
      if (!url) return []
      return [
        {
          url,
          dataset,
          datasetConfig,
          dataviewId: dataview.dataviewId,
          key: generateDataviewDatasetResourceKey(dataset, datasetConfig),
        } as Resource,
      ]
    })
    return datasetResources
  })
  return resources
}

export const resolveDataviewDatasetResource = (
  dataview: UrlDataviewInstance,
  datasetTypeOrId: DatasetTypes | DatasetTypes[] | string
) => {
  return resolveDataviewDatasetResources(dataview, datasetTypeOrId)[0] || ({} as Resource)
}

export function getDataviewSqlFiltersResolved(dataview: UrlDataviewInstance) {
  if (!dataview.config?.filters) {
    return ''
  }
  const { filters, filterOperators } = dataview.config

  const sqlFilters = Object.keys(filters)
    .filter((key) => key !== 'vessel-groups')
    .flatMap((filterKey) => {
      if (!filters[filterKey]) return []
      const filterValues = Array.isArray(filters[filterKey])
        ? filters[filterKey]
        : [filters[filterKey]]

      const dataset = dataview.datasets?.find(
        (d) => getDatasetSchemaItem(d, filterKey) !== undefined
      )
      const datasetSchema = getDatasetSchemaItem(dataset as Dataset, filterKey)
      const isUserDataset = dataview.category === DataviewCategory.User
      const queryFilterKey =
        // User context layers requires wrapping the filter key with double quotes
        filterKey.includes('_') && isUserDataset ? `"${filterKey}"` : filterKey
      if (datasetSchema && datasetSchema.type === 'range') {
        const minPossible = Number(datasetSchema?.enum?.[0])
        const minSelected = Number(filterValues[0])
        const minValue = isUserDataset ? `'${minSelected}'` : minSelected
        const maxPossible = Number(datasetSchema?.enum?.[datasetSchema.enum.length - 1])
        const maxSelected = Number(filterValues[filterValues.length - 1])
        const maxValue = isUserDataset ? `'${maxSelected}'` : maxSelected
        if (minSelected !== minPossible && maxSelected !== maxPossible) {
          return `${queryFilterKey} >= ${minValue} AND ${queryFilterKey} <= ${maxValue}`
        }
        if (minSelected !== minPossible) {
          return `${queryFilterKey} >= ${minValue}`
        }
        if (maxSelected !== maxPossible) {
          return `${queryFilterKey} <= ${maxValue}`
        }
      }
      const filterOperator = filterOperators?.[filterKey] || INCLUDE_FILTER_ID
      const query = `${queryFilterKey} ${FILTER_OPERATOR_SQL[filterOperator]} (${filterValues
        .map((f: string) => `'${f}'`)
        .join(', ')})`
      if (filterOperator === EXCLUDE_FILTER_ID) {
        // workaround as bigquery exludes null values
        return `(${queryFilterKey} IS NULL OR ${query})`
      }
      return query
    })

  return sqlFilters.length ? sqlFilters.join(' AND ') : ''
}

/**
 * Gets list of dataviews and those present in the workspace, and applies any config or datasetConfig
 * from it (merges dataview.config and workspace's dataviewConfig and datasetConfig).
 * @param dataviews
 * @param dataviewInstances
 */
export function resolveDataviews(
  dataviewInstances: UrlDataviewInstance[],
  dataviews: Dataview[],
  datasets: Dataset[]
) {
  let dataviewInstancesResolved: UrlDataviewInstance[] = dataviewInstances.flatMap(
    (dataviewInstance) => {
      if (dataviewInstance?.deleted) {
        return []
      }
      const dataview = dataviews?.find((dataview) => {
        return (
          dataview.slug === dataviewInstance.dataviewId ||
          // We need to parse the dataviewId as a string because now it is always a string to support slugs
          dataview.id === parseInt(dataviewInstance.dataviewId as string, 10)
        )
      })
      if (!dataview) {
        console.warn(
          `DataviewInstance id: ${dataviewInstance.id} doesn't have a valid dataview (${dataviewInstance.dataviewId})`
        )
        return []
      }

      const config = {
        ...dataview.config,
        ...dataviewInstance.config,
      }
      config.visible = config?.visible ?? true
      // Ensure the datasetConfig is defined in the base template dataview
      const datasetsConfig =
        dataview.datasetsConfig && dataview.datasetsConfig.length > 0
          ? dataview.datasetsConfig?.map((datasetConfig) => {
              const instanceDatasetConfig = dataviewInstance.datasetsConfig?.find(
                (instanceDatasetConfig) => {
                  if (datasetConfig.endpoint === EndpointId.Events) {
                    return (
                      datasetConfig.endpoint === instanceDatasetConfig.endpoint &&
                      // As the events could have multiple datasets we also have to validate this
                      // which also enforces to set the datasetConfig in the dataviewInstance used
                      datasetConfig.datasetId === instanceDatasetConfig.datasetId
                    )
                  }
                  return datasetConfig.endpoint === instanceDatasetConfig.endpoint
                }
              )
              if (!instanceDatasetConfig) return datasetConfig
              // using the instance query and params first as the uniqBy from lodash doc says:
              // the order of result values is determined by the order they occur in the array
              // so the result will be overriding the default dataview config
              return {
                ...datasetConfig,
                ...instanceDatasetConfig,
                query: uniqBy(
                  [...(instanceDatasetConfig.query || []), ...(datasetConfig.query || [])],
                  'id'
                ),
                params: uniqBy(
                  [...(instanceDatasetConfig.params || []), ...(datasetConfig.params || [])],
                  'id'
                ),
              }
            })
          : dataviewInstance.datasetsConfig || []

      const dataviewDatasets: Dataset[] = datasetsConfig.flatMap((datasetConfig) => {
        const dataset = datasets.find((dataset) => dataset.id === datasetConfig.datasetId)
        return dataset || []
      })

      const resolvedDataview = {
        ...dataview,
        // Supports overriding the category so we can easily move user layers to context section
        category: dataviewInstance.category || dataview.category,
        id: dataviewInstance.id,
        dataviewId: dataview.slug,
        config,
        datasets: dataviewDatasets,
        datasetsConfig,
      }
      return resolvedDataview
    }
  )

  // resolved array filters to url filters
  dataviewInstancesResolved = dataviewInstancesResolved.map((dataviewInstance) => {
    if (dataviewInstance.config && isFilterableDataviewInstanceGenerator(dataviewInstance)) {
      const { filters } = dataviewInstance.config
      if (filters) {
        dataviewInstance.config.filter = getDataviewSqlFiltersResolved(dataviewInstance)
      }
      if (filters?.['vessel-groups']) {
        dataviewInstance.config['vessel-groups'] = filters['vessel-groups'].join(',')
      }
      return dataviewInstance
    }
    return dataviewInstance
  })

  return dataviewInstancesResolved
}
