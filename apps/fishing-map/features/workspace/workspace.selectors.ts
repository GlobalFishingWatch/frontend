import { createSelector } from '@reduxjs/toolkit'

import type { Workspace } from '@globalfishingwatch/api-types'
import { EventTypes, WORKSPACE_PASSWORD_ACCESS } from '@globalfishingwatch/api-types'

import {
  DEFAULT_WORKSPACE,
  PREFERRED_FOURWINGS_VISUALISATION_MODE,
  VALID_PASSWORD,
} from 'data/config'
import {
  DEFAULT_BASEMAP_DATAVIEW_INSTANCE,
  DEFAULT_WORKSPACE_CATEGORY,
  DEFAULT_WORKSPACE_ID,
} from 'data/workspaces'
import { EMPTY_SEARCH_FILTERS } from 'features/search/search.config'
import { cleanVesselProfileDataviewInstances } from 'features/sidebar/sidebar-header.hooks'
import type { TurningTidesWorkspaceId } from 'features/track-correction/track-correction.config'
import { TURNING_TIDES_WORKSPACES_IDS } from 'features/track-correction/track-correction.config'
import { selectUserData, selectUserSettings } from 'features/user/selectors/user.selectors'
import type { UserSettings } from 'features/user/user.slice'
import type { RootState } from 'reducers'
import {
  HOME,
  PORT_REPORT,
  REPORT,
  REPORT_ROUTES,
  SEARCH,
  USER,
  VESSEL_GROUP_REPORT,
  WORKSPACE,
  WORKSPACE_REPORT,
  WORKSPACE_ROUTES,
  WORKSPACE_SEARCH,
  WORKSPACE_VESSEL,
} from 'router/routes'
import {
  selectIsRouteWithWorkspace,
  selectLocationQuery,
  selectLocationType,
  selectReportId,
  selectWorkspaceId,
} from 'router/routes.selectors'
import { mapRouteIdToType, toValidRoutePath } from 'router/routes.utils'
import type { WorkspaceState, WorkspaceStateProperty } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'

import { cleanReportPayload, cleanReportQuery } from './workspace.utils'

export const selectWorkspace = (state: RootState) => state.workspace?.data
export const selectWorkspaceReportId = (state: RootState) => state.workspace?.reportId
export const selectWorkspacePassword = (state: RootState) => state.workspace?.password
export const selectSuggestWorkspaceSave = (state: RootState) => state.workspace?.suggestSave
export const selectWorkspaceError = (state: RootState) => state.workspace?.error
export const selectWorkspaceStatus = (state: RootState) => state.workspace?.status
export const selectWorkspaceRefreshStatus = (state: RootState) => state.workspace?.refreshStatus
export const selectIsWorkspaceRefreshing = (state: RootState) =>
  state.workspace?.refreshStatus === AsyncReducerStatus.Loading
export const selectWorkspaceHistoryNavigation = (state: RootState) =>
  state.workspace?.historyNavigation
export const selectWorkspaceCustomStatus = (state: RootState) => state.workspace?.customStatus

export const selectLastVisitedWorkspace = createSelector(
  [selectWorkspaceHistoryNavigation],
  (historyNavigation) => {
    return historyNavigation.findLast((navigation) => {
      const routeType = mapRouteIdToType(navigation.to)
      return WORKSPACE_ROUTES.includes(routeType)
    })
  }
)

export const selectLastWorkspaceNavigationProps = createSelector(
  [selectWorkspaceHistoryNavigation],
  (historyNavigation) => {
    const lastWorkspaceVisited = historyNavigation?.[historyNavigation.length - 1]
    if (!historyNavigation?.length || !lastWorkspaceVisited) {
      return null
    }

    const previousRouteType = mapRouteIdToType(lastWorkspaceVisited.to)
    const isPreviousLocationReport = REPORT_ROUTES.includes(previousRouteType)
    const baseSearch = !isPreviousLocationReport
      ? { ...cleanReportQuery(lastWorkspaceVisited.search || {}), ...EMPTY_SEARCH_FILTERS }
      : lastWorkspaceVisited.search
    const search = {
      ...baseSearch,
      dataviewInstances: cleanVesselProfileDataviewInstances(baseSearch.dataviewInstances),
    }
    const params = !isPreviousLocationReport
      ? cleanReportPayload(lastWorkspaceVisited.params || {})
      : lastWorkspaceVisited.params

    return {
      to: toValidRoutePath(lastWorkspaceVisited.to, lastWorkspaceVisited.params),
      params,
      search,
      previousRouteType,
      isPreviousLocationReport,
      lastWorkspaceVisited,
    }
  }
)
export const selectCurrentWorkspaceId = createSelector([selectWorkspace], (workspace) => {
  return workspace?.id
})

export const selectCurrentWorkspaceCategory = createSelector([selectWorkspace], (workspace) => {
  return workspace?.category || DEFAULT_WORKSPACE_CATEGORY
})

export const selectIsGFWWorkspace = createSelector([selectWorkspace], (workspace) => {
  return workspace?.ownerType === 'super-user'
})

export const selectIsDefaultWorkspace = createSelector([selectWorkspace], (workspace) => {
  return workspace?.id === DEFAULT_WORKSPACE_ID
})

export const selectIsTurningTidesWorkspace = createSelector([selectWorkspace], (workspace) => {
  if (!workspace) return false
  return TURNING_TIDES_WORKSPACES_IDS.includes(workspace?.id as TurningTidesWorkspaceId)
})

export const selectIsWorkspaceOwner = createSelector(
  [selectWorkspace, selectUserData],
  (workspace, userData) => {
    return userData?.type !== 'guest' && workspace?.ownerId === userData?.id
  }
)

export const selectIsWorkspaceOwnerOrDefault = createSelector(
  [selectIsDefaultWorkspace, selectIsWorkspaceOwner],
  (isDefaultWorkspace, isWorkspaceOwner) => {
    return isDefaultWorkspace || isWorkspaceOwner
  }
)

export function isWorkspacePasswordProtected(workspace: Workspace<any> | null) {
  if (!workspace) {
    return false
  }
  return (
    workspace?.viewAccess === WORKSPACE_PASSWORD_ACCESS &&
    // When password required dataviewInstances are not sent
    !workspace?.dataviewInstances?.length
  )
}

export const selectIsWorkspacePasswordRequired = createSelector(
  [selectWorkspace, selectWorkspacePassword],
  (workspace, workspacePassword) => {
    return isWorkspacePasswordProtected(workspace) && workspacePassword !== VALID_PASSWORD
  }
)

export const selectIsWorkspaceReady = createSelector(
  [selectIsRouteWithWorkspace, selectWorkspaceStatus, selectIsWorkspacePasswordRequired],
  (isRouteWithWorkspace, workspaceStatus, isWorkspacePasswordRequired) => {
    return isRouteWithWorkspace
      ? workspaceStatus === AsyncReducerStatus.Finished && !isWorkspacePasswordRequired
      : true
  }
)

export const selectWorkspaceViewport = createSelector([selectWorkspace], (workspace) => {
  return workspace?.viewport
})

export const selectWorkspaceTimeRange = createSelector([selectWorkspace], (workspace) => {
  return {
    start: workspace?.startAt,
    end: workspace?.endAt,
  }
})

export const selectWorkspaceDataviewInstances = createSelector([selectWorkspace], (workspace) => {
  return workspace?.dataviewInstances || [DEFAULT_BASEMAP_DATAVIEW_INSTANCE]
})

const EMPTY_OBJECT: Record<string, any> = {}
export const selectWorkspaceState = createSelector(
  [selectWorkspace],
  (workspace): WorkspaceState => {
    return workspace?.state || (EMPTY_OBJECT as WorkspaceState)
  }
)

type WorkspaceProperty<P extends WorkspaceStateProperty> = Required<WorkspaceState>[P]

const USER_SETTINGS_FALLBACKS: Record<string, string> = {
  activityVisualizationMode: PREFERRED_FOURWINGS_VISUALISATION_MODE,
  detectionsVisualizationMode: PREFERRED_FOURWINGS_VISUALISATION_MODE,
}

export function selectWorkspaceStateProperty<P extends WorkspaceStateProperty>(property: P) {
  return createSelector(
    [selectLocationQuery, selectWorkspaceState, selectUserSettings],
    (locationQuery, workspaceState, userSettings): WorkspaceProperty<P> => {
      const urlProperty = locationQuery?.[property as keyof typeof locationQuery]
      if (urlProperty !== undefined) return urlProperty as WorkspaceProperty<P>
      if (workspaceState[property]) return workspaceState[property] as WorkspaceProperty<P>
      const userSettingsProperty =
        userSettings[USER_SETTINGS_FALLBACKS[property] as keyof UserSettings]
      return (userSettingsProperty || DEFAULT_WORKSPACE[property]) as WorkspaceProperty<P>
    }
  )
}

const visibleEventsSelector = selectWorkspaceStateProperty('visibleEvents')
export const selectWorkspaceVisibleEventsArray = createSelector(
  [visibleEventsSelector],
  (visibleEvents) => {
    if (visibleEvents === 'all') {
      return Object.values(EventTypes)
    }
    return Array.isArray(visibleEvents) ? ([...visibleEvents] as EventTypes[]) : []
  }
)

export const selectDaysFromLatest = selectWorkspaceStateProperty('daysFromLatest')
export const selectCollapsedSections = selectWorkspaceStateProperty('collapsedSections')

export type WorkspaceFetchParams = { workspaceId: string; reportId?: string }

export const selectWorkspaceFetchParams = createSelector(
  [
    selectLocationType,
    selectCurrentWorkspaceId,
    selectWorkspaceReportId,
    selectWorkspaceId,
    selectReportId,
  ],
  (
    locationType,
    currentWorkspaceId,
    currentReportId,
    urlWorkspaceId,
    reportId
  ): WorkspaceFetchParams | null => {
    switch (locationType) {
      // Routes that need the default workspace (no workspaceId in the URL)
      case HOME:
      case USER:
      case SEARCH: {
        return currentWorkspaceId !== DEFAULT_WORKSPACE_ID ? { workspaceId: '' } : null
      }

      // Routes under /$category/$workspaceId/* — fetch the workspace named in the URL
      case WORKSPACE:
      case WORKSPACE_SEARCH:
      case WORKSPACE_VESSEL:
      case WORKSPACE_REPORT:
      case VESSEL_GROUP_REPORT:
      case PORT_REPORT: {
        return urlWorkspaceId && currentWorkspaceId !== urlWorkspaceId
          ? { workspaceId: urlWorkspaceId }
          : null
      }

      // Standalone report (/report/$reportId) — workspace comes from the report
      case REPORT: {
        return currentReportId !== reportId
          ? { workspaceId: urlWorkspaceId || '', reportId: reportId as string }
          : null
      }
      default:
        return null
    }
  }
)
