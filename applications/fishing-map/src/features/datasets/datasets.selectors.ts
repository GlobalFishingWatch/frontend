import { createSelector } from '@reduxjs/toolkit'
import { selectWorkspaceDatasets } from 'features/datasets/datasets.slice'
import { selectAllUserDatasets } from 'features/user/user.slice'

export const selectDatasets = createSelector(
  [selectWorkspaceDatasets, selectAllUserDatasets],
  (workspaceDatasets, userDatasets) => {
    if (!userDatasets) return workspaceDatasets
    if (!workspaceDatasets) return userDatasets
    return [...workspaceDatasets, ...userDatasets]
  }
)
