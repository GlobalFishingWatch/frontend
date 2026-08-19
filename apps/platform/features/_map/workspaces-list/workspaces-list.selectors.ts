import { createSelector } from '@reduxjs/toolkit'
import type { Entries } from 'type-fest'

import { WorkspaceCategory } from '@platform/config/map/workspaces'

import {
  selectUserWorkspaces,
  selectUserWorkspacesPrivate,
} from 'features/_user/selectors/user.permissions.selectors'
import { selectUserLanguage } from 'features/_user/selectors/user.selectors'
import { t } from 'features/i18n/i18n'
import { USER } from 'router/routes'
import { selectLocationCategory, selectLocationType } from 'router/routes.selectors'

// Static data + types live in the config leaf so chrome components don't pull this selector graph.
import type { HighlightedWorkspace, HighlightedWorkspaces } from './workspaces-list.config'
import { WORKSPACES_BY_CATEGORY } from './workspaces-list.config'
import { selectWorkspaces } from './workspaces-list.slice'

export * from './workspaces-list.config'

export const selectHighlightedWorkspaces = createSelector(
  [selectUserLanguage],
  (locale): HighlightedWorkspaces[] => {
    return (Object.entries(WORKSPACES_BY_CATEGORY) as Entries<typeof WORKSPACES_BY_CATEGORY>).map(
      ([category, workspaces]) => {
        return {
          category: category,
          workspaces: workspaces.map((workspace) => ({
            ...workspace,
            name: t((resources: any) => resources[category][workspace.id].name, {
              ns: 'workspaces',
              lng: locale,
            }),
            description: t((resources: any) => resources[category][workspace.id].description, {
              ns: 'workspaces',
              lng: locale,
            }),
            visible: workspace.visible !== false,
            cta: t((resources: any) => resources[category][workspace.id].cta, {
              ns: 'workspaces',
              lng: locale,
              defaultValue:
                category === 'marine-manager'
                  ? t((resources) => resources.workspace.marineManagerLink, { lng: locale })
                  : category === 'reports'
                    ? t((resources) => resources.analysis.see, { lng: locale })
                    : t((resources) => resources.common.see, { lng: locale }),
            }),
          })),
        }
      }
    )
  }
)

export const selectCurrentHighlightedWorkspacesIds = createSelector(
  [selectLocationCategory, selectHighlightedWorkspaces],
  (locationCategory, highlightedWorkspaces): string[] => {
    const highlighted = highlightedWorkspaces?.find(({ category }) => category === locationCategory)
    return highlighted?.workspaces.map(({ id }) => id) || []
  }
)

export const selectCurrentHighlightedWorkspaces = createSelector(
  [selectLocationCategory, selectHighlightedWorkspaces, selectWorkspaces],
  (locationCategory, highlightedWorkspaces, apiWorkspaces): HighlightedWorkspace[] | undefined => {
    const highlighted = highlightedWorkspaces?.find(({ category }) => category === locationCategory)
    const workspaces = highlighted?.workspaces?.map((workspace) => {
      const apiWorkspace = apiWorkspaces.find(({ id }) => workspace.id === id)
      return {
        ...workspace,
        ...(apiWorkspace && {
          viewport: apiWorkspace.viewport,
          category: apiWorkspace.category as WorkspaceCategory,
        }),
      } as HighlightedWorkspace
    })
    if (locationCategory === WorkspaceCategory.MarineManager) {
      return workspaces?.sort((a, b) => a.name.localeCompare(b.name))
    }
    return workspaces
  }
)

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
  ): HighlightedWorkspace[] | undefined => {
    if (locationType === USER) {
      return [...userWorkspaces, ...userWorkspacesPrivate]
    }
    return highlightedWorkspaces?.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
      description: workspace.description,
      viewport: workspace.viewport,
      category: workspace.category,
    }))
  }
)
