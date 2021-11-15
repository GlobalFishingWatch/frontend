import { createSelector } from '@reduxjs/toolkit'
import { WorkspaceState } from 'types'
import { RootState } from 'store'
import { PUBLIC_SUFIX } from 'data/config'

export const selectLastVisitedWorkspace = (state: RootState) => state.workspace.lastVisited
export const selectWorkspace = (state: RootState) => state.workspace.data
export const selectWorkspaceStatus = (state: RootState) => state.workspace.status
export const selectWorkspaceCustomStatus = (state: RootState) => state.workspace.customStatus
export const selectWorkspaceError = (state: RootState) => state.workspace.error

export const isWorkspacePublic = createSelector([selectWorkspace], (workspace) => {
  return workspace?.id.slice(-PUBLIC_SUFIX.length) === PUBLIC_SUFIX
})

export const selectCurrentWorkspaceId = createSelector([selectWorkspace], (workspace) => {
  return workspace?.id
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

export const selectWorkspaceDataviews = createSelector([selectWorkspace], (workspace) => {
  return workspace?.dataviews
})

export const selectWorkspaceDataviewInstances = createSelector([selectWorkspace], (workspace) => {
  return workspace?.dataviewInstances
})

export const selectWorkspaceState = createSelector(
  [selectWorkspace],
  (workspace): WorkspaceState => {
    return workspace?.state || ({} as WorkspaceState)
  }
)
