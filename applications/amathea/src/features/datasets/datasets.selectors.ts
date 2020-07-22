import { createSelector } from '@reduxjs/toolkit'
import { selectAll } from 'features/datasets/datasets.slice'
import { getUserId } from 'features/user/user.slice'

export const selectShared = createSelector([selectAll, getUserId], (workspaces, userId) =>
  // TODO: make this real when editors in workspaces API
  workspaces.filter((w: any) => w.editors?.includes(userId))
)

export const selectDatasetSources = createSelector([selectAll], (datasets) =>
  datasets.map((dataset) => ({ id: dataset.id, label: dataset.description }))
)
