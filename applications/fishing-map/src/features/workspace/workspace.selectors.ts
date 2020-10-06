import { createSelector } from '@reduxjs/toolkit'
import { Generators } from '@globalfishingwatch/layer-composer'
import { Dataview, resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import { selectWorkspace } from 'features/workspace/workspace.slice'
import { ResourceQuery } from 'features/resources/resources.slice'

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

export const selectWorkspaceDataviews = createSelector([selectWorkspace], (workspace) => {
  if (!workspace) return
  // TODO resolve them here
  return workspace.dataviews
})

export const selectFishingDataviews = createSelector([selectWorkspaceDataviews], (dataviews) => {
  if (!dataviews) return

  return dataviews.filter((dataview) => dataview.config.type === Generators.Type.HeatmapAnimated)
})

export const selectVesselsDataviews = createSelector([selectWorkspaceDataviews], (dataviews) => {
  if (!dataviews) return

  return dataviews.filter((dataview) => dataview.config.type === Generators.Type.Track)
})

export const selectFishingDatasets = createSelector([selectFishingDataviews], (dataviews) => {
  if (!dataviews) return

  return dataviews.flatMap((dataview) => getDatasetsByDataview(dataview))
})

export const selectTemporalgridDataviews = createSelector(
  [selectWorkspaceDataviews],
  (dataviews) => {
    if (!dataviews) return []
    return dataviews.filter((dataview) => dataview.config.type === Generators.Type.HeatmapAnimated)
  }
)

export const selectDataviewsResourceQueries = createSelector(
  [selectWorkspaceDataviews],
  (dataviews) => {
    if (!dataviews) return []
    const resourceQueries: ResourceQuery[] = dataviews.flatMap((dataview) => {
      if (dataview.config.type !== Generators.Type.Track) return []

      // TODO should come from search or 4wings cell - not sure how to get that when set in a workspace?
      const DATASET_ID = 'carriers-tracks:v20200507'
      const dataset = dataview.datasets?.find((dataset) => dataset.id === DATASET_ID)
      if (!dataset) return []
      const datasetConfig = dataview?.datasetsConfig?.find(
        (datasetConfig) => datasetConfig.datasetId === dataset.id
      )
      if (!datasetConfig) return []
      const url = resolveEndpoint(dataset, datasetConfig)
      if (!url) return []

      return {
        dataviewId: dataview.id,
        datasetType: dataset.type,
        datasetConfig,
        url,
      }
    })

    return resourceQueries
  }
)
