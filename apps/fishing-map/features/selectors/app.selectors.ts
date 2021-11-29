import { createSelector } from '@reduxjs/toolkit'
import { DEFAULT_WORKSPACE } from 'data/config'
import { selectWorkspaceState } from 'features/workspace/workspace.selectors'
import { selectQueryParam } from 'routes/routes.selectors'
import { WorkspaceStateProperty } from 'types'

export const selectWorkspaceStateProperty = (property: WorkspaceStateProperty) =>
  createSelector(
    [selectQueryParam(property), selectWorkspaceState],
    (urlProperty, workspaceState) => {
      if (urlProperty !== undefined) return urlProperty
      return workspaceState[property] ?? DEFAULT_WORKSPACE[property]
    }
  )
