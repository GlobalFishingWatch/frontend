import { createSelector } from '@reduxjs/toolkit'
import { WorkspaceState } from 'types'
import { RootState } from 'store'

export const selectWorkspace = (state: RootState) => state.workspace

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

export const selectWorkspaceDataviewInstances = createSelector([selectWorkspace], (workspace) => {
  return workspace?.dataviewInstances
})

export const selectWorkspaceState = createSelector(
  [selectWorkspace],
  (workspace): WorkspaceState => {
    return workspace?.state || ({} as WorkspaceState)
  }
)

export const selectWorkspaceProfileView = createSelector([selectWorkspace], (workspace) => {
  return workspace?.profileView
})
