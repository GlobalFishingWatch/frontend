import { createSelector } from '@reduxjs/toolkit'

import type {
  HighlightedWorkspace as ApiHighlightedWorkspace,
  HighlightedWorkspaceTitle as ApiHighlightedWorkspaceTitle,
  Locale,
  WorkspaceViewport,
} from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { GLOBAL_REPORTS_ENABLED } from 'data/config'
import { REPORTS_INDEX } from 'data/reports/reports.index'
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
  workspaceId?: string
  dataviewInstances?: UrlDataviewInstance[]
  viewport?: WorkspaceViewport
  category?: WorkspaceCategory
  reportCategory?: ReportCategory
  viewAccess?: 'public' | 'private' | 'password'
}
export type HighlightedWorkspaces = {
  title: HighlightedWorkspaceTitle
  workspaces: HighlightedWorkspace[]
}

export const selectHighlightedWorkspaces = createSelector(
  [selectHighlightedApiWorkspaces, selectLanguage],
  (spreadsheetWorkspaces = [], locale): HighlightedWorkspaces[] => {
    return spreadsheetWorkspaces.map(({ title, workspaces }) => {
      return {
        title,
        workspaces: workspaces.map((workspace) => ({
          ...workspace,
          img: workspace.img || '',
          name: t(`workspaces:${workspace.id}.name`, { locale }),
          description: t(`workspaces:${workspace.id}.description`, { locale }),
          cta: t(`workspaces:${workspace.id}.cta`, {
            locale,
            defaultValue:
              title === 'marine-manager'
                ? t('workspace.marineManagerLink', 'See marine manager portal')
                : t('common.see', 'See'),
          }),
        })),
      }
    })
  }
)

export const selectHighlightedReports = createSelector(
  [selectLanguage],
  (locale): HighlightedWorkspaces => {
    if (!GLOBAL_REPORTS_ENABLED) {
      return {
        title: 'reports',
        workspaces: [],
      }
    }
    return {
      title: 'reports',
      workspaces: REPORTS_INDEX.map((workspace) => ({
        ...workspace,
        name: t(`workspaces:${workspace.id}.name`, { locale }),
        description: t(`workspaces:${workspace.id}.description`, { locale }),
        cta: t(`workspaces:${workspace.id}.cta`, {
          locale,
          defaultValue: t('analysis.see', 'See report'),
        }),
      })),
    }
  }
)

const selectAllHighlightedWorkspaces = createSelector(
  [selectHighlightedWorkspaces, selectHighlightedReports],
  (highlightedWorkspaces = [], highlightedReports) => {
    return [...highlightedWorkspaces, highlightedReports].map((highlighted) => ({
      ...highlighted,
      workspaces: highlighted.workspaces.filter((workspace) => workspace.visible !== 'hidden'),
    }))
  }
)

const emptyArray: HighlightedWorkspaceTitle[] = []
export const selectAvailableWorkspacesCategories = createSelector(
  [selectWorkspaceListStatus, selectAllHighlightedWorkspaces],
  (workspaceListStatus, highlightedWorkspaces = []): HighlightedWorkspaceTitle[] => {
    if (workspaceListStatus === AsyncReducerStatus.Finished) {
      const highlightedWorkspacesWithData = highlightedWorkspaces?.filter(({ workspaces }) => {
        return workspaces.length > 0
      })
      const highlightedCategories = highlightedWorkspacesWithData.map(({ title }) => title)
      return highlightedCategories
    }
    return emptyArray
  }
)

export const selectCurrentHighlightedWorkspaces = createSelector(
  [selectLocationCategory, selectAllHighlightedWorkspaces, selectWorkspaces],
  (locationCategory, highlightedWorkspaces, apiWorkspaces): HighlightedWorkspace[] | undefined => {
    const highlighted = highlightedWorkspaces?.find(({ title }) => title === locationCategory)
    const workspaces = highlighted?.workspaces
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
