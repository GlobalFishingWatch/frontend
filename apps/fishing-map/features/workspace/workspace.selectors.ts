import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from 'reducers'
import { EventTypes } from '@globalfishingwatch/api-types'
import { WorkspaceState, WorkspaceStateProperty } from 'types'
import { DEFAULT_WORKSPACE, PREFERRED_FOURWINGS_VISUALISATION_MODE } from 'data/config'
import { selectQueryParam } from 'routes/routes.selectors'
import {
  DEFAULT_BASEMAP_DATAVIEW_INSTANCE,
  DEFAULT_WORKSPACE_CATEGORY,
  DEFAULT_WORKSPACE_ID,
} from 'data/workspaces'
import { selectUserData, selectUserSettings } from 'features/user/selectors/user.selectors'
import { UserSettings } from 'features/user/user.slice'

export const selectWorkspace = (state: RootState) => state.workspace?.data
export const selectWorkspacePassword = (state: RootState) => state.workspace?.password
export const selectWorkspaceError = (state: RootState) => state.workspace?.error
export const selectWorkspaceStatus = (state: RootState) => state.workspace?.status
export const selectLastVisitedWorkspace = (state: RootState) => state.workspace?.lastVisited
export const selectWorkspaceCustomStatus = (state: RootState) => state.workspace?.customStatus

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

export const selectIsWorkspaceOwner = createSelector(
  [selectWorkspace, selectUserData],
  (workspace, userData) => {
    return workspace?.ownerId === userData?.id
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

const EMPTY_OBJECT: {} = {}
const selectWorkspaceState = createSelector([selectWorkspace], (workspace): WorkspaceState => {
  return workspace?.state || (EMPTY_OBJECT as WorkspaceState)
})

type WorkspaceProperty<P extends WorkspaceStateProperty> = Required<WorkspaceState>[P]

const USER_SETTINGS_FALLBACKS: Record<string, string> = {
  activityVisualizationMode: PREFERRED_FOURWINGS_VISUALISATION_MODE,
  detectionsVisualizationMode: PREFERRED_FOURWINGS_VISUALISATION_MODE,
}

export function selectWorkspaceStateProperty<P extends WorkspaceStateProperty>(property: P) {
  return createSelector(
    [selectQueryParam(property), selectWorkspaceState, selectUserSettings],
    (urlProperty, workspaceState, userSettings): WorkspaceProperty<P> => {
      if (urlProperty !== undefined) return urlProperty
      if (workspaceState[property]) return workspaceState[property] as WorkspaceProperty<P>
      const userSettingsProperty =
        userSettings[USER_SETTINGS_FALLBACKS[property] as keyof UserSettings]
      return (userSettingsProperty || DEFAULT_WORKSPACE[property]) as WorkspaceProperty<P>
    }
  )
}

export const selectWorkspaceVisibleEventsArray = createSelector(
  [selectWorkspaceStateProperty('visibleEvents')],
  (visibleEvents) => {
    return typeof visibleEvents === 'string'
      ? visibleEvents === 'all'
        ? Object.values(EventTypes)
        : []
      : (visibleEvents as EventTypes[])
  }
)

export const selectDaysFromLatest = selectWorkspaceStateProperty('daysFromLatest')
