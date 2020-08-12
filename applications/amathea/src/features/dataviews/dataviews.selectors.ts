import { createSelector } from '@reduxjs/toolkit'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { getUserId } from 'features/user/user.slice'
import { selectCurrentWorkspace } from 'features/workspaces/workspaces.slice'
import { selectAllDataviews, selectDrafDataviewSource } from './dataviews.slice'

export const selectCurrentWorkspaceDataviews = createSelector(
  [selectAllDataviews, selectCurrentWorkspace],
  (dataviews, workspace) => {
    return dataviews.filter((dataview) => workspace?.dataviewsId.includes(dataview.id))
  }
)

export const selectDatasetOptionsBySource = createSelector(
  [selectAllDatasets, selectDrafDataviewSource, getUserId],
  (datasetOptions, source, userId) => {
    const options = !source
      ? datasetOptions
      : datasetOptions.filter((dataset) => {
          if (source.id === 'gfw') {
            return dataset.ownerId !== userId
          }
          return dataset.ownerId === userId
        })
    return options.map((dataset) => ({
      id: dataset.id,
      label: dataset.name,
      description: dataset.description,
      type: dataset.type,
    }))
  }
)
