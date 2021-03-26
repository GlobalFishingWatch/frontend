import { createSelector } from '@reduxjs/toolkit'
import { Workspace, WorkspaceViewport } from '@globalfishingwatch/api-types/dist'
import { WorkspaceCategories } from 'data/workspaces'
import { selectLocationCategory, selectLocationType } from 'routes/routes.selectors'
import { USER } from 'routes/routes'
import { selectUserWorkspaces } from 'features/user/user.selectors'
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

export const selectAvailableWorkspacesCategories = createSelector(
  [selectHighlightedWorkspaces],
  (highlightedWorkspaces) => {
    return highlightedWorkspaces?.filter(({ workspaces }) => {
      return workspaces.length > 0
    })
  }
)

export type HighlightedWorkspaceMerged = HighlightedWorkspace & {
  viewport?: WorkspaceViewport
  category?: WorkspaceCategories
}

export const selectCurrentHighlightedWorkspaces = createSelector(
  [selectLocationCategory, selectHighlightedWorkspaces, selectWorkspaces],
  (
    locationCategory,
    highlightedWorkspaces,
    apiWorkspaces
  ): HighlightedWorkspaceMerged[] | undefined => {
    const highlighted = highlightedWorkspaces?.find(({ title }) => title === locationCategory)
    return highlighted?.workspaces?.map((workspace) => {
      const apiWorkspace = apiWorkspaces.find(({ id }) => workspace.id === id)

      if (!apiWorkspace) return workspace

      return {
        ...workspace,
        viewport: apiWorkspace.viewport,
        category: apiWorkspace.category as WorkspaceCategories,
      }
    })
  }
)

export const selectCurrentWorkspacesList = createSelector(
  [selectLocationType, selectCurrentHighlightedWorkspaces, selectUserWorkspaces],
  (
    locationType,
    highlightedWorkspaces,
    userWorkspaces
  ): HighlightedWorkspaceMerged[] | undefined => {
    return locationType === USER ? userWorkspaces : highlightedWorkspaces
  }
)
