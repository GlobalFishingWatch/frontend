import { createSelector } from '@reduxjs/toolkit'
import { Generators } from '@globalfishingwatch/layer-composer'
import { Dataview } from '@globalfishingwatch/dataviews-client'
import { selectWorkspace } from 'features/workspace/workspace.slice'

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

export const selectFishingDatasets = createSelector([selectFishingDataviews], (dataviews) => {
  if (!dataviews) return

  return dataviews.flatMap((dataview) => getDatasetsByDataview(dataview))
})
