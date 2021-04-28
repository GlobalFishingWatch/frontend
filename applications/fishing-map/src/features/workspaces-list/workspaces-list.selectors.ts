import { createSelector } from '@reduxjs/toolkit'
import { Workspace, WorkspaceViewport } from '@globalfishingwatch/api-types/dist'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategories } from 'data/workspaces'
import { selectLocationCategory, selectLocationType } from 'routes/routes.selectors'
import { USER } from 'routes/routes'
import { selectUserWorkspaces } from 'features/user/user.selectors'
import {
  HighlightedWorkspace,
  selectHighlightedWorkspaces,
  selectWorkspaces,
} from './workspaces-list.slice'

export const selectDefaultWorkspace = createSelector([selectWorkspaces], (workspaces) => {
  return workspaces?.find(
    // To ensure this is the local workspace and not overlaps with a new one on the api with the same id
    (w) => w.id === DEFAULT_WORKSPACE_ID && w.description === DEFAULT_WORKSPACE_ID
  )
})

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
    return (
      highlightedWorkspaces &&
      Object.entries(highlightedWorkspaces)
        .filter(([category, entries]) => {
          const hasEntries = entries.length > 0
          const isInSupportedCategories = Object.values(WorkspaceCategories).includes(
            category as WorkspaceCategories
          )
          return hasEntries && isInSupportedCategories
        })
        .map(([category]) => category as WorkspaceCategories)
    )
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
    const workspaces = highlightedWorkspaces?.[locationCategory]
    return workspaces
      ?.filter((workspace) => workspace.visible !== 'hidden')
      .map((workspace) => {
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

export const selectWorkspacesByUserGroup = createSelector(
  [selectHighlightedWorkspaces],
  (workspaces) => {
    if (!workspaces) return
    const groups = Object.values(workspaces)
      .flatMap((w) => w)
      ?.filter(({ userGroup }) => userGroup !== undefined)
      .map(({ id, userGroup }) => [userGroup, id])
    return Object.fromEntries(groups)
  }
)
