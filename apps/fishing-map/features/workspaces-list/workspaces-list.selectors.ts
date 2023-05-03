import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'reducers'
import { Workspace, WorkspaceViewport } from '@globalfishingwatch/api-types'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategory } from 'data/workspaces'
import { selectLocationCategory, selectLocationType } from 'routes/routes.selectors'
import { USER } from 'routes/routes'
import { selectUserWorkspaces } from 'features/user/user.selectors'
import {
  HighlightedWorkspace,
  selectHighlightedWorkspaces,
  selectWorkspaces,
} from './workspaces-list.slice'

export const selectDefaultWorkspace = createSelector(
  [(state: RootState) => selectWorkspaces(state)],
  (workspaces) => {
    return workspaces?.find(
      // To ensure this is the local workspace and not overlaps with a new one on the api with the same id
      (w) => w.id === DEFAULT_WORKSPACE_ID && w.description === DEFAULT_WORKSPACE_ID
    )
  }
)

export const selectWorkspaceByCategory = (category: WorkspaceCategory) => {
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
  category?: WorkspaceCategory
}

export const selectCurrentHighlightedWorkspaces = createSelector(
  [
    selectLocationCategory,
    selectHighlightedWorkspaces,
    (state: RootState) => selectWorkspaces(state),
  ],
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
}

export const selectCurrentWorkspacesList = createSelector(
  [selectLocationType, selectCurrentHighlightedWorkspaces, selectUserWorkspaces],
  (locationType, highlightedWorkspaces, userWorkspaces): HighlightedMapWorkspace[] | undefined => {
    if (locationType === USER) {
      return userWorkspaces
    }
    return highlightedWorkspaces?.map((workspace) => ({
      id: workspace.id,
      name: workspace.name.en,
      viewport: workspace.viewport,
      category: workspace.category,
    }))
  }
)

export const selectWorkspacesByUserGroup = createSelector(
  [selectHighlightedWorkspaces],
  (highlightedWorkspace) => {
    if (!highlightedWorkspace?.length) return
    const workspaces = highlightedWorkspace.flatMap(({ workspaces }) => workspaces)
    const groups = workspaces
      .flatMap((w) => w)
      ?.filter(({ userGroup }) => userGroup !== undefined)
      .map(({ id, userGroup }) => [userGroup, id])
    return Object.fromEntries(groups)
  }
)
