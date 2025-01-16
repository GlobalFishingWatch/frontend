import { createSelector } from '@reduxjs/toolkit'

import type { WorkspaceViewport } from '@globalfishingwatch/api-types'

import type { WorkspaceCategory } from 'data/workspaces'
import {
  selectUserWorkspaces,
  selectUserWorkspacesPrivate,
} from 'features/user/selectors/user.permissions.selectors'
import { USER } from 'routes/routes'
import { selectLocationCategory, selectLocationType } from 'routes/routes.selectors'

import type { HighlightedWorkspace } from './workspaces-list.slice'
import { selectHighlightedWorkspaces, selectWorkspaces } from './workspaces-list.slice'

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
  category?: WorkspaceCategory
}

export const selectCurrentHighlightedWorkspaces = createSelector(
  [selectLocationCategory, selectHighlightedWorkspaces, selectWorkspaces],
  (
    locationCategory,
    highlightedWorkspaces,
    apiWorkspaces
  ): HighlightedWorkspaceMerged[] | undefined => {
    const highlighted = highlightedWorkspaces?.find(({ title }) => title === locationCategory)
    return highlighted?.workspaces
      ?.filter((workspace) => workspace.visible !== 'hidden')
      ?.map((workspace) => {
        const apiWorkspace = apiWorkspaces.find(({ id }) => workspace.id === id)
        return {
          ...workspace,
          ...(apiWorkspace && {
            viewport: apiWorkspace.viewport,
            category: apiWorkspace.category as WorkspaceCategory,
          }),
        }
      })
  }
)

type HighlightedMapWorkspace = {
  id: string
  name: string
  viewport?: WorkspaceViewport
  category?: WorkspaceCategory
  viewAccess?: 'public' | 'private' | 'password'
}

export const selectCurrentWorkspacesList = createSelector(
  [
    selectLocationType,
    selectCurrentHighlightedWorkspaces,
    selectUserWorkspaces,
    selectUserWorkspacesPrivate,
  ],
  (
    locationType,
    highlightedWorkspaces,
    userWorkspaces,
    userWorkspacesPrivate
  ): HighlightedMapWorkspace[] | undefined => {
    if (locationType === USER) {
      return [...userWorkspaces, ...userWorkspacesPrivate]
    }
    return highlightedWorkspaces?.map((workspace) => ({
      id: workspace.id,
      name: workspace.name.en,
      viewport: workspace.viewport,
      category: workspace.category,
    }))
  }
)
