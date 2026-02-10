import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from 'reducers'

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
import type { TurningTidesWorkspaceId } from 'features/track-correction/track-correction.config'
import { TURNING_TIDES_WORKSPACES_IDS } from 'features/track-correction/track-correction.config'
import { selectUserData, selectUserSettings } from 'features/user/selectors/user.selectors'
import type { UserSettings } from 'features/user/user.slice'
import { WORKSPACE_ROUTES } from 'routes/routes'
import { selectIsRouteWithWorkspace, selectLocationQuery } from 'routes/routes.selectors'
import { mapRouteIdToType } from 'routes/routes.utils'
import type { WorkspaceState, WorkspaceStateProperty } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'

export const selectWorkspace = (state: RootState) => state.workspace?.data
export const selectWorkspaceReportId = (state: RootState) => state.workspace?.reportId
export const selectWorkspacePassword = (state: RootState) => state.workspace?.password
export const selectSuggestWorkspaceSave = (state: RootState) => state.workspace?.suggestSave
export const selectWorkspaceError = (state: RootState) => state.workspace?.error
export const selectWorkspaceStatus = (state: RootState) => state.workspace?.status
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
    return workspace?.ownerId === userData?.id
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
    return typeof visibleEvents === 'string'
      ? visibleEvents === 'all'
        ? Object.values(EventTypes)
        : []
      : [...(visibleEvents as EventTypes[])]
  }
)

export const selectDaysFromLatest = selectWorkspaceStateProperty('daysFromLatest')
export const selectCollapsedSections = selectWorkspaceStateProperty('collapsedSections')
