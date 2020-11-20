import { createSelector } from '@reduxjs/toolkit'
import { resolveDataviews } from '@globalfishingwatch/dataviews-client'
import { Dataview } from '@globalfishingwatch/api-types/dist'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { getUserId } from 'features/user/user.slice'
import { selectCurrentWorkspace } from 'features/workspaces/workspaces.slice'
import { DATASET_SOURCE_IDS } from 'data/data'
import { selectAllDataviews, selectDrafDataviewSource } from './dataviews.slice'

export const selectCurrentWorkspaceDataviews = createSelector(
  [selectAllDataviews, selectCurrentWorkspace],
  (dataviews, workspace) => {
    return dataviews.filter((dataview) =>
      workspace?.dataviews?.map((d) => d.id).includes(dataview.id)
    )
  }
)

export const selectCurrentWorkspaceDataviewsResolved = createSelector(
  [selectCurrentWorkspaceDataviews, selectCurrentWorkspace],
  (dataviews, workspace) => {
    if (!workspace) return
    const dataviewsResolved = resolveDataviews(dataviews, workspace?.dataviewInstances)
    return dataviewsResolved as Dataview[]
  }
)

export const selectUserDatasets = createSelector(
  [selectAllDatasets, getUserId],
  (datasets, userId) => {
    return datasets.filter((dataset) => {
      return dataset.source === DATASET_SOURCE_IDS.user && dataset.ownerId === userId
    })
  }
)

export const selectDatasetOptionsBySource = createSelector(
  [selectUserDatasets, selectAllDataviews, selectCurrentWorkspace, selectDrafDataviewSource],
  (userDatasets, dataviews, currentWorkspace, sourceSelected) => {
    if (!sourceSelected) return []

    if (sourceSelected.id === DATASET_SOURCE_IDS.user) {
      return userDatasets.map((dataset) => ({
        id: dataset.id,
        label: dataset.name,
        type: dataset.type,
        description: dataset.description,
        category: dataset.category,
      }))
    }

    return dataviews.flatMap((dataview) => {
      const dataset = dataview.datasets?.find(
        (dataset: any) => dataset.type === '4wings:v1' || dataset.type === 'user-context-layer:v1'
      )

      const currentWorkspaceDataviews = currentWorkspace?.dataviews?.map((dataview) => dataview.id)
      if (
        !dataset ||
        dataset.source !== sourceSelected.id ||
        currentWorkspaceDataviews?.includes(dataview.id)
      ) {
        return []
      }
      return {
        id: dataset.id,
        dataviewId: dataview.id,
        label: dataset.name,
        type: dataset.type,
        description: dataset.description,
      }
    })
  }
)
