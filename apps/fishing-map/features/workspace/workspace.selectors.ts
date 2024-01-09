import { createSelector } from '@reduxjs/toolkit'
import { WorkspaceState, WorkspaceStateProperty } from 'types'
import { DEFAULT_WORKSPACE } from 'data/config'
import { selectQueryParam } from 'routes/routes.selectors'
import { DEFAULT_BASEMAP_DATAVIEW_INSTANCE, WorkspaceCategory } from 'data/workspaces'
import { RootState } from 'store'

export const selectWorkspaceSlice = (state: RootState) => state.workspace

export const selectLastVisitedWorkspace = createSelector([selectWorkspaceSlice], (workspace) => {
  return workspace?.lastVisited
})
export const selectWorkspaceStatus = createSelector([selectWorkspaceSlice], (workspace) => {
  return workspace?.status
})
export const selectWorkspaceCustomStatus = createSelector([selectWorkspaceSlice], (workspace) => {
  return workspace?.customStatus
})
export const selectWorkspace = createSelector([selectWorkspaceSlice], (workspace) => {
  return workspace?.data
})
export const selectWorkspaceError = createSelector([selectWorkspaceSlice], (workspace) => {
  return workspace?.error
})

export const selectCurrentWorkspaceId = createSelector([selectWorkspace], (workspace) => {
  return workspace?.id
})

export const selectCurrentWorkspaceCategory = createSelector([selectWorkspace], (workspace) => {
  return workspace?.category || WorkspaceCategory.FishingActivity
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

export const selectWorkspaceState = createSelector(
  [selectWorkspace],
  (workspace): WorkspaceState => {
    return workspace?.state || ({} as WorkspaceState)
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

export const selectDaysFromLatest = selectWorkspaceStateProperty('daysFromLatest')
