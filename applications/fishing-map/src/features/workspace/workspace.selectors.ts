import { createSelector } from '@reduxjs/toolkit'
import uniqBy from 'lodash/uniqBy'
import { UrlDataviewInstance } from 'types'
import { Generators } from '@globalfishingwatch/layer-composer'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import { Dataset, DataviewDatasetConfig } from '@globalfishingwatch/api-types'
import { selectWorkspace } from 'features/workspace/workspace.slice'
import { ResourceQuery } from 'features/resources/resources.slice'
import { selectDataviewInstances } from 'routes/routes.selectors'
import { selectDatasets } from 'features/datasets/datasets.slice'
import { selectDataviews } from 'features/dataviews/dataviews.slice'
import { TRACKS_DATASET_TYPE, VESSELS_DATASET_TYPE, FISHING_DATASET_TYPE } from './workspace.mock'

export const getDatasetsByDataview = (dataview: UrlDataviewInstance) =>
  Object.entries(dataview.datasetsConfig || {}).flatMap(([id, value]) => {
    const dataset = dataview.datasets?.find((dataset) => dataset.id === id)
    if (!dataset) return []
    return {
      id,
      label: dataset.name,
    }
  })

export const selectWorkspaceViewport = createSelector([selectWorkspace], (workspace) => {
  return workspace?.viewport
})

export const selectWorkspaceDataviewInstances = createSelector([selectWorkspace], (workspace) => {
  return workspace?.dataviewInstances
})

export const selectDataviewInstancesResolved = createSelector(
  [selectWorkspace, selectDatasets, selectDataviews, selectDataviewInstances],
  (
    workspace,
    datasets,
    dataviews,
    urlDataviewInstances = []
  ): UrlDataviewInstance[] | undefined => {
    if (!workspace) return
    const urlDataviews = urlDataviewInstances.reduce<
      Record<'workspace' | 'new', UrlDataviewInstance[]>
    >(
      (acc, urlDataview) => {
        const isInWorkspace = workspace.dataviewInstances.some(
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
    const dataviewInstances = [...workspace.dataviewInstances, ...urlDataviews.new]
    let dataviewInstancesResolved: UrlDataviewInstance[] = dataviewInstances.flatMap(
      (dataviewInstance) => {
        const dataview = dataviews?.find((dataview) => dataview.id === dataviewInstance.dataviewId)
        if (!dataview) {
          console.warn(
            `DataviewInstance id: ${dataviewInstance.id} doesn't have a valid dataview (${dataviewInstance.dataviewId})`
          )
          return []
        }

        const urlDataview = urlDataviews.workspace.find(
          (urlDataview) => urlDataview.id === dataviewInstance.id
        )
        if (urlDataview?.deleted) {
          return []
        }
        const config = {
          ...dataview.config,
          ...dataviewInstance.config,
          ...urlDataview?.config,
        }
        config.visible = config?.visible ?? true
        const dataviewDatasets: Dataset[] = []
        const datasetsConfig = dataview.datasetsConfig?.map((datasetConfig) => {
          const dataset = datasets.find((dataset) => dataset.id === datasetConfig.datasetId)
          if (dataset) {
            dataviewDatasets.push(dataset)
          }
          const workspaceDataviewDatasetConfig = dataviewInstance.datasetsConfig?.find(
            (wddc) =>
              wddc.datasetId === datasetConfig.datasetId && wddc.endpoint === datasetConfig.endpoint
          )
          if (!workspaceDataviewDatasetConfig) return datasetConfig

          return { ...datasetConfig, ...workspaceDataviewDatasetConfig }
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
      if (dataviewInstance.config.type === Generators.Type.HeatmapAnimated) {
        const dataviewInstanceWithUrlFilter = {
          ...dataviewInstance,
        }
        if (dataviewInstanceWithUrlFilter.config.filters) {
          dataviewInstanceWithUrlFilter.config.filter = dataviewInstanceWithUrlFilter.config.filters
            .map((flag: string) => `flag='${flag}'`)
            .join(' OR ')
        }
        return dataviewInstanceWithUrlFilter
      }
      return dataviewInstance
    })
    return dataviewInstancesResolved
  }
)

type DatasetTypes =
  | typeof TRACKS_DATASET_TYPE
  | typeof VESSELS_DATASET_TYPE
  | typeof FISHING_DATASET_TYPE
export const selectDatasetsByType = (type: DatasetTypes) => {
  return createSelector([selectDatasets], (datasets) => {
    return uniqBy(
      datasets.flatMap((dataset) => {
        if (dataset.type === type) return dataset
        const relatedDatasetId = dataset.relatedDatasets?.find(
          (relatedDataset) => relatedDataset.type === type
        )?.id
        if (!relatedDatasetId) return []
        const relatedDataset = datasets.find((dataset) => dataset.id === relatedDatasetId)
        return relatedDataset || []
      }),
      'id'
    )
  })
}

export const selectVesselsDatasets = createSelector(
  [selectDatasetsByType(VESSELS_DATASET_TYPE)],
  (datasets) => {
    return datasets
  }
)
export const selectTracksDatasets = createSelector(
  [selectDatasetsByType(TRACKS_DATASET_TYPE)],
  (datasets) => {
    return datasets
  }
)

export const selectDataviewInstancesByType = (type: Generators.Type) => {
  return createSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => dataview.config?.type === type)
  })
}

export const selectVesselsDataviews = createSelector(
  [selectDataviewInstancesByType(Generators.Type.Track)],
  (dataviews) => dataviews
)

export const selectTemporalgridDataviews = createSelector(
  [selectDataviewInstancesByType(Generators.Type.HeatmapAnimated)],
  (dataviews) => {
    console.log(dataviews)
    return dataviews
  }
)

export const selectTemporalgridDatasets = createSelector(
  [selectTemporalgridDataviews],
  (dataviews) => {
    if (!dataviews) return

    return dataviews.flatMap((dataview) => getDatasetsByDataview(dataview))
  }
)

export const getRelatedDatasetByType = (dataset: Dataset, datasetType: DatasetTypes) => {
  return dataset?.relatedDatasets?.find((relatedDataset) => relatedDataset.type === datasetType)
}

export const resolveDataviewDatasetResource = (
  dataview: UrlDataviewInstance,
  datasetType: DatasetTypes
): {
  dataset?: Dataset
  datasetConfig?: DataviewDatasetConfig
  url?: string
} => {
  const dataset = dataview.datasets?.find((dataset) => dataset.type === datasetType)
  if (!dataset) return {}
  const datasetConfig = dataview?.datasetsConfig?.find(
    (datasetConfig) => datasetConfig.datasetId === dataset.id
  )
  if (!datasetConfig) return {}
  const url = resolveEndpoint(dataset, datasetConfig)
  if (!url) return {}

  return { dataset, datasetConfig, url }
}

export const selectDataviewsResourceQueries = createSelector(
  [selectDataviewInstancesResolved],
  (dataviewInstances) => {
    if (!dataviewInstances) return

    const resourceQueries: ResourceQuery[] = dataviewInstances.flatMap((dataview) => {
      if (dataview.config?.type !== Generators.Type.Track || dataview.deleted) {
        return []
      }
      let trackQuery: any = [] // initialized as empty array to be filter by flatMap if not used
      if (dataview.config.visible === true) {
        const trackResource = resolveDataviewDatasetResource(dataview, TRACKS_DATASET_TYPE)
        if (!trackResource.url || !trackResource.dataset || !trackResource.datasetConfig) {
          return []
        }
        trackQuery = {
          dataviewId: dataview.dataviewId as number,
          url: trackResource.url,
          datasetType: trackResource.dataset.type,
          datasetConfig: trackResource.datasetConfig,
        }
      }

      const infoResource = resolveDataviewDatasetResource(dataview, VESSELS_DATASET_TYPE)
      if (!infoResource.url || !infoResource.dataset || !infoResource.datasetConfig) {
        return trackQuery as ResourceQuery
      }
      const infoQuery: ResourceQuery = {
        dataviewId: dataview.dataviewId as number,
        url: infoResource.url,
        datasetType: infoResource.dataset.type,
        datasetConfig: infoResource.datasetConfig,
      }
      return [trackQuery, infoQuery]
    })

    return resourceQueries
  }
)
