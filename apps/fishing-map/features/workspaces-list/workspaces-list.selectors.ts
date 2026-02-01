import { createSelector } from '@reduxjs/toolkit'
import type { Entries } from 'type-fest'

import type { WorkspaceViewport } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import type { MarineManagerWorkspace } from 'data/highlighted-workspaces/marine-manager'
import { MARINE_MANAGER_WORKSPACES } from 'data/highlighted-workspaces/marine-manager'
import type { ReportWorkspace, WorkspaceReportLink } from 'data/highlighted-workspaces/reports'
import { REPORTS_INDEX } from 'data/highlighted-workspaces/reports'
import { WorkspaceCategory } from 'data/workspaces'
import { t } from 'features/i18n/i18n'
import type { ReportCategory } from 'features/reports/reports.types'
import {
  selectUserWorkspaces,
  selectUserWorkspacesPrivate,
} from 'features/user/selectors/user.permissions.selectors'
import { selectLanguage } from 'features/user/selectors/user.selectors'
import { USER } from 'routes/routes'
import { selectLocationCategory, selectLocationType } from 'routes/routes.selectors'

import type workspaceTranslations from '../../public/locales/source/workspaces.json'

import { selectWorkspaces } from './workspaces-list.slice'

export type HighlightedWorkspaceCategory = keyof typeof workspaceTranslations

export type HighlightedWorkspace = {
  id: string
  name: string
  description: string
  cta?: string
  img?: string
  reportUrl?: string
  visible?: boolean
  reports?: WorkspaceReportLink[]
  dataviewInstances?: UrlDataviewInstance[]
  viewport?: WorkspaceViewport
  category?: WorkspaceCategory
  reportCategory?: ReportCategory
  viewAccess?: 'public' | 'private' | 'password'
}
export type HighlightedWorkspaces = {
  category: HighlightedWorkspaceCategory
  workspaces: HighlightedWorkspace[]
}

export const selectHighlightedWorkspaces = createSelector(
  [selectLanguage],
  (locale): HighlightedWorkspaces[] => {
    const WORKSPACES_BY_CATEGORY: Record<
      HighlightedWorkspaceCategory,
      (MarineManagerWorkspace | ReportWorkspace)[]
    > = {
      'marine-manager': MARINE_MANAGER_WORKSPACES,
      reports: REPORTS_INDEX,
    }
    return (Object.entries(WORKSPACES_BY_CATEGORY) as Entries<typeof WORKSPACES_BY_CATEGORY>).map(
      ([category, workspaces]) => {
        return {
          category: category,
          workspaces: workspaces.map((workspace) => ({
            ...workspace,
            name: t((t: any) => t[category][workspace.id].name, { ns: 'workspaces', locale }),
            description: t((t: any) => t[category][workspace.id].description, {
              ns: 'workspaces',
              locale,
            }),
            visible: workspace.visible !== false,
            cta: t((t: any) => t[category][workspace.id].cta, {
              ns: 'workspaces',
              locale,
              defaultValue:
                category === 'marine-manager'
                  ? t((t) => t.workspace.marineManagerLink)
                  : category === 'reports'
                    ? t((t) => t.analysis.see)
                    : t((t) => t.common.see),
            }),
          })),
        }
      }
    )
  }
)

export const selectAvailableWorkspacesCategories = createSelector(
  [selectHighlightedWorkspaces],
  (highlightedWorkspaces = []): HighlightedWorkspaceCategory[] => {
    const highlightedWorkspacesWithData = highlightedWorkspaces?.filter(({ workspaces }) => {
      return workspaces.length > 0
    })
    const highlightedCategories = highlightedWorkspacesWithData.map(({ category }) => category)
    return highlightedCategories
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
