import { createSelector } from '@reduxjs/toolkit'

import type { WorkspaceViewport } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import type { MarineManagerWorkspace } from 'data/highlighted-workspaces/marine-manager'
import { MARINE_MANAGER_WORKSPACES } from 'data/highlighted-workspaces/marine-manager'
import type { ReportWorkspace } from 'data/highlighted-workspaces/reports'
import { REPORTS_INDEX } from 'data/highlighted-workspaces/reports'
import { WorkspaceCategory } from 'data/workspaces'
import { selectIsGlobalReportsEnabled } from 'features/debug/debug.selectors'
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
  reportId?: string
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
  [selectLanguage, selectIsGlobalReportsEnabled],
  (locale, isGlobalReportsEnabled): HighlightedWorkspaces[] => {
    const WORKSPACES_BY_CATEGORY: Record<
      HighlightedWorkspaceCategory,
      (MarineManagerWorkspace | ReportWorkspace)[]
    > = {
      'fishing-activity': [],
      'marine-manager': MARINE_MANAGER_WORKSPACES,
      reports: isGlobalReportsEnabled ? REPORTS_INDEX : [],
    }
    return Object.entries(WORKSPACES_BY_CATEGORY).map(([category, workspaces]) => {
      return {
        category: category as HighlightedWorkspaceCategory,
        workspaces: workspaces.map((workspace) => ({
          ...workspace,
          name: t(`workspaces:${category}.${workspace.id}.name`, { locale }),
          description: t(`workspaces:${category}.${workspace.id}.description`, { locale }),
          visible: workspace.visible !== false,
          cta: t(`workspaces:${category}.${workspace.id}.cta`, {
            locale,
            defaultValue:
              category === 'marine-manager'
                ? t('workspace.marineManagerLink', 'See marine manager portal')
                : category === 'reports'
                  ? t('analysis.see', 'See report')
                  : t('common.see', 'See'),
          }),
        })),
      }
    })
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
