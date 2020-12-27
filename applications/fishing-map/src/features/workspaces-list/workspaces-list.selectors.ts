import { createSelector } from '@reduxjs/toolkit'
import { Workspace } from '@globalfishingwatch/api-types/dist'
import { WorkspaceCategories } from 'data/workspaces'
import { selectLocationCategory } from 'routes/routes.selectors'
import { selectWorkspaces } from './workspaces-list.slice'

export const selectWorkspaceByCategory = (category: WorkspaceCategories) => {
  return createSelector([selectWorkspaces], (workspaces) => {
    return workspaces.filter((workspace) => workspace.app === category)
  })
}

export const selectCurrentWorkspaces = createSelector(
  [selectLocationCategory, (state) => state],
  (category, state): Workspace[] => {
    return selectWorkspaceByCategory(category)(state)
  }
)
