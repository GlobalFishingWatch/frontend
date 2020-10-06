import { createSelector } from '@reduxjs/toolkit'
import { Generators } from '@globalfishingwatch/layer-composer'
import { Dataview, resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import { selectWorkspace } from 'features/workspace/workspace.slice'
import { ResourceQuery } from 'features/resources/resources.slice'

// TODO should come from search or 4wings cell - not sure how to get that when set in a workspace?
const DATASET_ID = 'carriers-tracks:v20200507'

export const getUniqueDataviewId = (dataview: Dataview) => {
  const dataset = dataview.datasets?.find((dataset) => dataset.id === DATASET_ID)
  if (!dataset) return dataview.id.toString()

  const datasetConfig = dataview?.datasetsConfig?.find(
    (datasetConfig) => datasetConfig.datasetId === dataset.id
  )
  return `${dataview.id}-${datasetConfig?.params
    .map(({ id, value }) => `${id}-${value}`)
    .join(',')}`
}

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

export const selectWorkspaceDataviewsResolved = createSelector([selectWorkspace], (workspace) => {
  if (!workspace) return
  // TODO move this to use-workspace helper
  const dataviews = workspace.dataviews.flatMap((dataview) => {
    const workspaceDataviewsConfig = workspace.dataviewsConfig.filter(
      (dataviewConfig) => dataviewConfig.dataviewId === dataview.id
    )
    if (!workspaceDataviewsConfig.length) return dataview
    return workspaceDataviewsConfig.map((workspaceDataviewConfig) => {
      const config = {
        ...dataview.config,
        ...workspaceDataviewConfig.config,
      }
      const datasetsConfig = dataview.datasetsConfig?.map((datasetConfig) => {
        const workspaceDataviewDatasetConfig = workspaceDataviewConfig.datasetsConfig?.find(
          (wddc) =>
            wddc.datasetId === datasetConfig.datasetId && wddc.endpoint === datasetConfig.endpoint
        )
        if (!workspaceDataviewDatasetConfig) return datasetConfig

        return { ...datasetConfig, ...workspaceDataviewDatasetConfig }
      })
      const resolvedDataview = {
        ...dataview,
        uid: getUniqueDataviewId(dataview),
        config,
        datasetsConfig,
      }
      return {
        ...resolvedDataview,
        uid: getUniqueDataviewId(resolvedDataview),
      }
    })
  })
  return dataviews
})

export const selectVesselsDataviews = createSelector(
  [selectWorkspaceDataviewsResolved],
  (dataviews) => {
    if (!dataviews) return

    return dataviews.filter((dataview) => dataview.config.type === Generators.Type.Track)
  }
)

export const selectTemporalgridDataviews = createSelector(
  [selectWorkspaceDataviewsResolved],
  (dataviews) => {
    if (!dataviews) return []
    return dataviews.filter((dataview) => dataview.config.type === Generators.Type.HeatmapAnimated)
  }
)

export const selectTemporalgridDatasets = createSelector(
  [selectTemporalgridDataviews],
  (dataviews) => {
    if (!dataviews) return

    return dataviews.flatMap((dataview) => getDatasetsByDataview(dataview))
  }
)

export const selectDataviewsResourceQueries = createSelector(
  [selectWorkspaceDataviewsResolved],
  (dataviews) => {
    if (!dataviews) return []
    const resourceQueries: ResourceQuery[] = dataviews.flatMap((dataview) => {
      if (dataview.config.type !== Generators.Type.Track) return []
      const dataset = dataview.datasets?.find((dataset) => dataset.id === DATASET_ID)
      if (!dataset) return []
      const datasetConfig = dataview?.datasetsConfig?.find(
        (datasetConfig) => datasetConfig.datasetId === dataset.id
      )
      if (!datasetConfig) return []
      const url = resolveEndpoint(dataset, datasetConfig)
      if (!url) return []

      return {
        id: getUniqueDataviewId(dataview),
        dataviewId: dataview.id,
        datasetType: dataset.type,
        datasetConfig,
        url,
      }
    })

    return resourceQueries
  }
)
