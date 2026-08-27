import { createSelector } from '@reduxjs/toolkit'

import type { Workspace } from '@globalfishingwatch/api-types'
import { EventTypes, WORKSPACE_PASSWORD_ACCESS } from '@globalfishingwatch/api-types'
import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from '@platform/config/map/workspaces'

import {
  DEFAULT_WORKSPACE,
  PREFERRED_FOURWINGS_VISUALISATION_MODE,
  VALID_PASSWORD,
} from 'data/map/config'
import { DEFAULT_BASEMAP_DATAVIEW_INSTANCE } from 'data/map/dataviews'
import { cleanVesselProfileDataviewInstances } from 'features/_map/sidebar/sidebar-header.hooks'
import { selectUserData, selectUserSettings } from 'features/_user/selectors/user.selectors'
import type { UserSettings } from 'features/_user/user.slice'
import { EMPTY_SEARCH_FILTERS } from 'features/_vessels/search/search.config'
import type { TurningTidesWorkspaceId } from 'features/_vessels/track-correction/track-correction.config'
import { TURNING_TIDES_WORKSPACES_IDS } from 'features/_vessels/track-correction/track-correction.config'
import type { RootState } from 'reducers'
import {
  PORT_REPORT,
  REPORT,
  REPORT_ROUTES,
  ROUTES_WITH_DEFAULT_WORKSPACE,
  VESSEL_GROUP_REPORT,
  WORKSPACE,
  WORKSPACE_REPORT,
  WORKSPACE_ROUTES,
  WORKSPACE_SEARCH,
  WORKSPACE_VESSEL,
} from 'router/routes'
import {
  selectIsRouteWithWorkspace,
  selectLocationCategory,
  selectLocationQuery,
  selectLocationType,
  selectReportId,
  selectWorkspaceId,
} from 'router/routes.selectors'
import type { LinkToPayload } from 'router/routes.types'
import { mapRoutePathToType } from 'router/routes.utils'
import type { WorkspaceState, WorkspaceStateProperty } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'

import { cleanReportPayload, cleanReportQuery, EMPTY_REPORT_PARAMS } from './workspace.utils'

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
      const routeType = mapRoutePathToType(navigation.to)
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

    const previousRouteType = mapRoutePathToType(lastWorkspaceVisited.to)
    const isPreviousLocationReport = REPORT_ROUTES.includes(previousRouteType)
    const baseSearch = !isPreviousLocationReport
      ? { ...cleanReportQuery(lastWorkspaceVisited.search || {}), ...EMPTY_SEARCH_FILTERS }
      : lastWorkspaceVisited.search
    const search = {
      ...baseSearch,
      dataviewInstances: cleanVesselProfileDataviewInstances(baseSearch.dataviewInstances),
    }

    const params: LinkToPayload = isPreviousLocationReport
      ? { ...EMPTY_REPORT_PARAMS, ...lastWorkspaceVisited.params }
      : cleanReportPayload(lastWorkspaceVisited.params)

    return {
      to: lastWorkspaceVisited.to,
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

export const selectWorkspaceCategory = createSelector(
  [selectLocationCategory, selectWorkspace],
  (locationCategory, workspace) => {
    return locationCategory || workspace?.category || DEFAULT_WORKSPACE_CATEGORY
  }
)

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
export const selectTimeMode = selectWorkspaceStateProperty('timeMode')

export const selectMigramarLayer = selectWorkspaceStateProperty('migramarLayer')
export const selectLonglineSetsInsight = selectWorkspaceStateProperty('longlineSetsInsight')

export const selectIsRealTimeMode = createSelector([selectTimeMode], (timeMode) => {
  return timeMode === 'realTime'
})

export type WorkspaceFetchParams = { workspaceId: string; reportId?: string }

function getDefaultWorkspaceFetchParams(
  currentWorkspaceId: string | undefined,
  workspaceStatus: AsyncReducerStatus
): WorkspaceFetchParams | null {
  const hasDefaultWorkspace =
    currentWorkspaceId === DEFAULT_WORKSPACE_ID && workspaceStatus === AsyncReducerStatus.Finished
  return hasDefaultWorkspace ? null : { workspaceId: DEFAULT_WORKSPACE_ID }
}

export function getReportWorkspaceFetchNeeded(
  currentReportId: string | null | undefined,
  reportId: string | undefined,
  workspaceStatus: AsyncReducerStatus
) {
  if (!reportId) {
    return false
  }
  return currentReportId !== reportId || workspaceStatus !== AsyncReducerStatus.Finished
}

export const selectWorkspaceFetchParams = createSelector(
  [
    selectLocationType,
    selectCurrentWorkspaceId,
    selectWorkspaceStatus,
    selectWorkspaceReportId,
    selectWorkspaceId,
    selectReportId,
  ],
  (
    locationType,
    currentWorkspaceId,
    workspaceStatus,
    currentReportId,
    urlWorkspaceId,
    reportId
  ): WorkspaceFetchParams | null => {
    if (ROUTES_WITH_DEFAULT_WORKSPACE.includes(locationType)) {
      return getDefaultWorkspaceFetchParams(currentWorkspaceId, workspaceStatus)
    }

    switch (locationType) {
      // Routes under /$category/$workspaceId/* — fetch the workspace named in the URL
      case WORKSPACE:
      case WORKSPACE_SEARCH:
      case WORKSPACE_VESSEL:
      case WORKSPACE_REPORT:
      case VESSEL_GROUP_REPORT:
      case PORT_REPORT: {
        if (!urlWorkspaceId || urlWorkspaceId === DEFAULT_WORKSPACE_ID) {
          return getDefaultWorkspaceFetchParams(currentWorkspaceId, workspaceStatus)
        }
        return currentWorkspaceId !== urlWorkspaceId ? { workspaceId: urlWorkspaceId } : null
      }

      // Standalone report (/report/$reportId) — workspace comes from the report
      case REPORT: {
        return getReportWorkspaceFetchNeeded(currentReportId, reportId, workspaceStatus)
          ? { workspaceId: urlWorkspaceId || '', reportId: reportId as string }
          : null
      }
      default:
        return null
    }
  }
)
