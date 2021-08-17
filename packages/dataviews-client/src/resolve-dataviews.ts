import { uniqBy } from 'lodash'
import {
  Dataset,
  DatasetTypes,
  Dataview,
  DataviewDatasetConfig,
  DataviewInstance,
  EndpointId,
  Resource,
} from '@globalfishingwatch/api-types'
import { Generators } from '@globalfishingwatch/layer-composer'
import { GeneratorType } from '@globalfishingwatch/layer-composer/dist/generators'
import { resolveEndpoint } from '.'

export type UrlDataviewInstance<T = GeneratorType> = Omit<DataviewInstance<T>, 'dataviewId'> & {
  dataviewId?: number // making this optional as sometimes we just need to reference the id
  deleted?: boolean // needed when you want to override from url an existing workspace config
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

const getDatasetConfigsByDatasetType = (
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
  return datasetConfigs
}

const getDatasetConfigByDatasetType = (
  dataview: UrlDataviewInstance,
  type: DatasetTypes
): DataviewDatasetConfig => {
  return getDatasetConfigsByDatasetType(dataview, type)[0]
}

export type TrackDatasetConfigs = {
  info: DataviewDatasetConfig
  track: DataviewDatasetConfig
  events: DataviewDatasetConfig[]
}

const getTrackDataviewDatasetConfigs = (
  dataviewInstance: UrlDataviewInstance
): TrackDatasetConfigs => {
  const info = getDatasetConfigByDatasetType(dataviewInstance, DatasetTypes.Vessels)

  const trackDatasetType =
    dataviewInstance.datasets && dataviewInstance.datasets?.[0]?.type === DatasetTypes.UserTracks
      ? DatasetTypes.UserTracks
      : DatasetTypes.Tracks
  const track = { ...getDatasetConfigByDatasetType(dataviewInstance, trackDatasetType) }

  const events = getDatasetConfigsByDatasetType(dataviewInstance, DatasetTypes.Events).filter(
    (datasetConfig) => datasetConfig.query?.find((q) => q.id === 'vessels')?.value
  ) // Loitering

  return {
    info,
    track,
    events,
  }
}

export const getDataviewsForResourceQuerying = (
  dataviewInstances: UrlDataviewInstance[],
  trackDatasetConfigsTransform?: (
    trackDatasetConfigs: TrackDatasetConfigs
  ) => DataviewDatasetConfig[]
) => {
  if (!dataviewInstances) return []
  const preparedDataviewsInstances = dataviewInstances.map((dataviewInstance) => {
    if (dataviewInstance.config?.type !== Generators.Type.Track) return dataviewInstance

    const { track, info, events } = getTrackDataviewDatasetConfigs(dataviewInstance)
    let preparedDatasetConfigs

    if (trackDatasetConfigsTransform) {
      preparedDatasetConfigs = trackDatasetConfigsTransform({ track, info, events })
    } else {
      preparedDatasetConfigs = [track, info, ...events] as DataviewDatasetConfig[]
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
 * Collect available datasetConfigs from dataviews and prepare resource queries
 */
export const resolveResourcesFromDatasetConfigs = (
  dataviews: UrlDataviewInstance[]
): Resource[] => {
  return dataviews
    .filter((dataview) => dataview.config?.type === Generators.Type.Track)
    .flatMap((dataview) => {
      if (!dataview.datasetsConfig) return []
      return dataview.datasetsConfig.flatMap((datasetConfig) => {
        const dataset = dataview.datasets?.find((dataset) => dataset.id === datasetConfig.datasetId)
        if (!dataset) return []
        const url = resolveEndpoint(dataset, datasetConfig)
        if (!url) return []
        return [{ dataset, datasetConfig, url, dataviewId: dataview.dataviewId as number }]
      })
    })
}

export const resolveDataviewDatasetResources = (
  dataview: UrlDataviewInstance,
  datasetTypeOrId: DatasetTypes | DatasetTypes[] | string
): Resource[] => {
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

  const resources = datasets?.flatMap((dataset) => {
    const datasetConfig = dataview?.datasetsConfig?.find(
      (datasetConfig) => datasetConfig.datasetId === dataset.id
    )
    if (!datasetConfig) return []
    const url = resolveEndpoint(dataset, datasetConfig)
    if (!url) return []
    return [{ dataset, datasetConfig, url, dataviewId: dataview.dataviewId as number }]
  })

  return resources
}

export const resolveDataviewDatasetResource = (
  dataview: UrlDataviewInstance,
  datasetTypeOrId: DatasetTypes | DatasetTypes[] | string
): Resource => {
  return resolveDataviewDatasetResources(dataview, datasetTypeOrId)[0] || {}
}

// TODO Deprecate
export const resolveDataviewResourceByDatasetType = (
  dataview: UrlDataviewInstance<Generators.Type>,
  datasetType: DatasetTypes
): Resource | undefined => {
  const { url, dataset, datasetConfig } = resolveDataviewDatasetResource(dataview, datasetType)
  if (url && dataset && datasetConfig) {
    return {
      dataviewId: dataview.dataviewId as number,
      url: url,
      dataset: dataset,
      datasetConfig: datasetConfig,
    }
  }
}

// TODO Deprecate
// Workaround to support multiple resource for the same dataset type (fishing, loitering...)
// Ideally we move the `resolveDataviewDatasetResource` method to support it natively
export const resolveDataviewEventsResources = (dataview: UrlDataviewInstance): Resource[] => {
  if (!dataview.datasetsConfig?.length) {
    return []
  }
  const dataviews = dataview.datasetsConfig?.flatMap((datasetConfig) => {
    if (datasetConfig.endpoint !== EndpointId.Events) {
      return []
    }
    const vesselID = datasetConfig.query?.find((q) => q.id === 'vessels')?.value
    if (!vesselID) {
      return []
    }
    const dataset = dataview.datasets?.find((dataset) => dataset.id === datasetConfig.datasetId)
    if (!dataset) {
      return []
    }
    return { ...dataview, datasets: [dataset], datasetsConfig: [datasetConfig] }
  })
  const resources = dataviews?.flatMap(
    (dataview) => resolveDataviewResourceByDatasetType(dataview, DatasetTypes.Events) ?? []
  )
  return resources
}

/**
 * Gets list of dataviews and those present in the workspace, and applies any config or datasetConfig
 * from it (merges dataview.config and workspace's dataviewConfig and datasetConfig).
 * @param dataviews
 * @param dataviewInstances
 */
export default function resolveDataviews(
  dataviewInstances: UrlDataviewInstance[],
  dataviews: Dataview[],
  datasets: Dataset[]
) {
  let dataviewInstancesResolved: UrlDataviewInstance[] = dataviewInstances.flatMap(
    (dataviewInstance) => {
      if (dataviewInstance?.deleted) {
        return []
      }

      const dataview = dataviews?.find((dataview) => dataview.id === dataviewInstance.dataviewId)
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
        id: dataviewInstance.id as string,
        dataviewId: dataview.id,
        config,
        datasets: dataviewDatasets,
        datasetsConfig,
      }
      return resolvedDataview
    }
  )

  // resolved array filters to url filters
  dataviewInstancesResolved = dataviewInstancesResolved.map((dataviewInstance) => {
    if (dataviewInstance.config?.type === GeneratorType.HeatmapAnimated) {
      const { filters } = dataviewInstance.config
      if (filters) {
        const sqlFilters = Object.keys(filters).flatMap((filterKey) => {
          if (!filters[filterKey]) return []
          const filterValues = Array.isArray(filters[filterKey])
            ? filters[filterKey]
            : [filters[filterKey]]
          return `${filterKey} IN (${filterValues.map((f: string) => `'${f}'`).join(', ')})`
        })
        if (sqlFilters.length) {
          dataviewInstance.config.filter = sqlFilters.join(' AND ')
        }
      }
      return dataviewInstance
    }
    return dataviewInstance
  })

  return dataviewInstancesResolved
}
