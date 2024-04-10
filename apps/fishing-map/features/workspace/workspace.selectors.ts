import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from 'reducers'
import { EventTypes } from '@globalfishingwatch/api-types'
import { WorkspaceState, WorkspaceStateProperty } from 'types'
import { DEFAULT_WORKSPACE } from 'data/config'
import { selectQueryParam } from 'routes/routes.selectors'
import { DEFAULT_BASEMAP_DATAVIEW_INSTANCE, DEFAULT_WORKSPACE_CATEGORY } from 'data/workspaces'

export const selectWorkspace = (state: RootState) => state.workspace?.data
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
export const selectWorkspaceState = createSelector(
  [selectWorkspace],
  (workspace): WorkspaceState => {
    return workspace?.state || (EMPTY_OBJECT as WorkspaceState)
  }
)

type WorkspaceProperty<P extends WorkspaceStateProperty> = Required<WorkspaceState>[P]
export function selectWorkspaceStateProperty<P extends WorkspaceStateProperty>(property: P) {
  return createSelector(
    [selectQueryParam(property), selectWorkspaceState],
    (urlProperty, workspaceState): WorkspaceProperty<P> => {
      if (urlProperty !== undefined) return urlProperty
      return (workspaceState[property] ?? DEFAULT_WORKSPACE[property]) as WorkspaceProperty<P>
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
