import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from 'store'
import type { WorkspaceState, WorkspaceStateProperty } from 'types'

import { DEFAULT_WORKSPACE } from 'data/config'
import { selectLocationQuery } from 'routes/routes.selectors'

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

export const selectWorkspaceStateProperty = (property: WorkspaceStateProperty) =>
  createSelector([selectLocationQuery, selectWorkspaceState], (locationQuery, workspaceState) => {
    const urlProperty = locationQuery?.[property]
    if (urlProperty !== undefined) return urlProperty
    return workspaceState[property] ?? DEFAULT_WORKSPACE[property]
  })
