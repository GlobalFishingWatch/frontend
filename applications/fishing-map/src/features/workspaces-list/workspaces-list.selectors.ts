import { createSelector } from '@reduxjs/toolkit'
import { Workspace } from '@globalfishingwatch/api-types/dist'
import { WorkspaceCategories } from 'data/workspaces'
import { selectLocationCategory } from 'routes/routes.selectors'
import {
  HighlightedWorkspace,
  selectHighlightedWorkspaces,
  selectWorkspaces,
} from './workspaces-list.slice'

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

export const selectHighlightedWorkspacesMerged = createSelector(
  [selectHighlightedWorkspaces, selectWorkspaces],
  (highlightedWorkspaces, apiWorkspaces): HighlightedWorkspace[] | undefined => {
    return highlightedWorkspaces?.map((workspace) => {
      const apiWorkspace = apiWorkspaces.find(({ id }) => workspace.id === id)
      if (!apiWorkspace) return workspace

      return { ...workspace, viewport: apiWorkspace.viewport }
    })
  }
)
