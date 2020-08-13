import { createSelector } from '@reduxjs/toolkit'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { getUserId } from 'features/user/user.slice'
import { selectCurrentWorkspace } from 'features/workspaces/workspaces.slice'
import { DATASET_SOURCE_IDS } from 'data/data'
import { selectAllDataviews, selectDrafDataviewSource } from './dataviews.slice'

export const selectCurrentWorkspaceDataviews = createSelector(
  [selectAllDataviews, selectCurrentWorkspace],
  (dataviews, workspace) => {
    return dataviews.filter((dataview) => workspace?.dataviewsId?.includes(dataview.id))
  }
)

export const selectDatasetOptionsBySource = createSelector(
  [selectAllDatasets, selectDrafDataviewSource, getUserId],
  (datasetOptions, sourceSelected, userId) => {
    if (!sourceSelected) return []
    const options = datasetOptions.filter((dataset) => {
      if (
        dataset.source === DATASET_SOURCE_IDS.user &&
        sourceSelected.id === DATASET_SOURCE_IDS.user
      ) {
        return dataset.ownerId === userId
      }
      return dataset.source === sourceSelected.id
    })
    return options.map((dataset) => ({
      id: dataset.id,
      label: dataset.name,
      type: dataset.type,
      description: dataset.description,
    }))
  }
)
