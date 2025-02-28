import { createSelector } from '@reduxjs/toolkit'

import type {
  HighlightedWorkspace as ApiHighlightedWorkspace,
  HighlightedWorkspaceTitle as ApiHighlightedWorkspaceTitle,
  Locale,
  WorkspaceViewport,
} from '@globalfishingwatch/api-types'

import { getHighlightedReports } from 'data/reports/reports.index'
import type { WorkspaceCategory } from 'data/workspaces'
import i18n from 'features/i18n/i18n'
import {
  selectUserWorkspaces,
  selectUserWorkspacesPrivate,
} from 'features/user/selectors/user.permissions.selectors'
import { selectUserLanguage } from 'features/user/selectors/user.selectors'
import { USER } from 'routes/routes'
import { selectLocationCategory, selectLocationType } from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import {
  selectHighlightedApiWorkspaces,
  selectWorkspaceListStatus,
  selectWorkspaces,
} from './workspaces-list.slice'

export type HighlightedWorkspaceTitle = 'reports' | ApiHighlightedWorkspaceTitle

export type HighlightedWorkspace = {
  id: string
  name: string
  description: string
  cta?: string
  img?: string
  reportUrl?: string
  visible?: 'visible' | 'hidden'
  viewport?: WorkspaceViewport
  category?: WorkspaceCategory
  viewAccess?: 'public' | 'private' | 'password'
}
export type HighlightedWorkspaces = {
  title: HighlightedWorkspaceTitle
  workspaces: HighlightedWorkspace[]
}

const geti18nProperty = (
  workspace: ApiHighlightedWorkspace,
  property: 'name' | 'description' | 'cta',
  language: Locale
) => {
  return (workspace[property][language] as string) || workspace[property].en
}

export const selectHighlightedWorkspaces = createSelector(
  [selectHighlightedApiWorkspaces, selectUserLanguage],
  (spreadsheetWorkspaces = [], locale): HighlightedWorkspaces[] => {
    return spreadsheetWorkspaces.map(({ title, workspaces }) => {
      return {
        title,
        workspaces: workspaces.map((workspace) => ({
          ...workspace,
          img: workspace.img || '',
          name: geti18nProperty(workspace, 'name', locale),
          description: geti18nProperty(workspace, 'description', locale),
          cta: geti18nProperty(workspace, 'cta', locale),
        })),
      }
    })
  }
)

export type HighlightedWorkspaceMerged = HighlightedWorkspace & {
  viewport?: WorkspaceViewport
  category?: WorkspaceCategory
}
const emptyArray: HighlightedWorkspaceTitle[] = []
export const selectAvailableWorkspacesCategories = createSelector(
  [selectWorkspaceListStatus, selectHighlightedWorkspaces],
  (workspaceListStatus, highlightedWorkspaces): HighlightedWorkspaceTitle[] => {
    if (workspaceListStatus === AsyncReducerStatus.Finished) {
      const highlightedWorkspacesWithData = (highlightedWorkspaces || [])?.filter(
        ({ workspaces }) => {
          return workspaces.length > 0
        }
      )
      const highlightedCategories = highlightedWorkspacesWithData.map(({ title }) => title)
      return [...highlightedCategories, 'reports']
    }
    return emptyArray
  }
)

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
        } as HighlightedWorkspace
      })
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
