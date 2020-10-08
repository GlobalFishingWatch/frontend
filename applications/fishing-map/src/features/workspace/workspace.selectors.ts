import { createSelector } from '@reduxjs/toolkit'
import { WorkspaceDataview, UrlWorkspaceDataviewConfig } from 'types'
import { Generators } from '@globalfishingwatch/layer-composer'
import { Dataview, resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import { selectWorkspace } from 'features/workspace/workspace.slice'
import { ResourceQuery } from 'features/resources/resources.slice'
import { selectDataviewsConfig } from 'routes/routes.selectors'
import { TRACKS_DATASET_ID } from './workspace.mock'

export const getDatasetsByDataview = (dataview: Dataview) =>
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

export const selectWorkspaceDataviewConfig = createSelector([selectWorkspace], (workspace) => {
  return workspace?.dataviewsConfig
})

export const selectWorkspaceDataviewsResolved = createSelector(
  [selectWorkspace, selectDataviewsConfig],
  (workspace, urlDataviewsConfig = []): WorkspaceDataview[] | undefined => {
    if (!workspace) return
    const urlDataviews = urlDataviewsConfig.reduce<
      Record<'workspace' | 'new', UrlWorkspaceDataviewConfig[]>
    >(
      (acc, urlDataview) => {
        const isInWorkspace = workspace.dataviewsConfig.some(
          (dataviewConfig) => dataviewConfig.id === urlDataview.id
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
    const dataviewsConfig = [...workspace.dataviewsConfig, ...urlDataviews.new]
    const dataviews = dataviewsConfig.flatMap((dataviewConfig) => {
      const dataview = workspace.dataviews.find(
        (dataview) => dataview.id === dataviewConfig.dataviewId
      )
      if (!dataview) {
        console.warn(
          `DataviewConfig id: ${dataviewConfig.id} doesn't have a valid dataview (${dataviewConfig.dataviewId})`
        )
        return []
      }

      const urlDataview = urlDataviews.workspace.find(
        (urlDataview) => urlDataview.id === dataviewConfig.id
      )
      if (urlDataview?.deleted) {
        return []
      }
      const config = {
        ...dataview.config,
        ...dataviewConfig.config,
        ...urlDataview?.config,
      }
      config.visible = config?.visible ?? true
      const datasetsConfig = dataview.datasetsConfig?.map((datasetConfig) => {
        const workspaceDataviewDatasetConfig = dataviewConfig.datasetsConfig?.find(
          (wddc) =>
            wddc.datasetId === datasetConfig.datasetId && wddc.endpoint === datasetConfig.endpoint
        )
        if (!workspaceDataviewDatasetConfig) return datasetConfig

        return { ...datasetConfig, ...workspaceDataviewDatasetConfig }
      })
      const resolvedDataview = {
        ...dataview,
        config,
        datasetsConfig,
      }
      return {
        ...resolvedDataview,
        configId: dataviewConfig.id,
      }
    })
    return dataviews
  }
)

export const selectDataviewsConfigByType = (type: Generators.Type) => {
  return createSelector([selectWorkspaceDataviewsResolved], (dataviews) => {
    return dataviews?.filter((dataview) => dataview.config.type === type)
  })
}

export const selectVesselsDataviews = createSelector(
  [selectDataviewsConfigByType(Generators.Type.Track)],
  (dataviews) => dataviews
)

export const selectTemporalgridDataviews = createSelector(
  [selectDataviewsConfigByType(Generators.Type.HeatmapAnimated)],
  (dataviews) => dataviews
)

export const selectTemporalgridDatasets = createSelector(
  [selectTemporalgridDataviews],
  (dataviews) => {
    if (!dataviews) return

    return dataviews.flatMap((dataview) => getDatasetsByDataview(dataview))
  }
)

export const resolveDataviewDatasetResource = (
  dataview: Dataview,
  datasetId = TRACKS_DATASET_ID
) => {
  const dataset = dataview.datasets?.find((dataset) => dataset.id === datasetId)
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
  [selectWorkspaceDataviewsResolved],
  (dataviews) => {
    if (!dataviews) return
    const resourceQueries: ResourceQuery[] = dataviews.flatMap((dataview) => {
      if (dataview.config.type !== Generators.Type.Track) return []
      const { url, dataset, datasetConfig } = resolveDataviewDatasetResource(dataview)

      if (!url || !dataset || !datasetConfig) return []
      return {
        dataviewId: dataview.id,
        datasetType: dataset.type,
        datasetConfig: datasetConfig,
        url,
      }
    })

    return resourceQueries
  }
)
