import { createSelector } from '@reduxjs/toolkit'
import { WorkspaceCategories } from 'data/workspaces'
import { selectWorkspaces } from './workspaces-list.slice'

export const selectWorkspaceByCategory = (category: WorkspaceCategories) => {
  return createSelector([selectWorkspaces], (workspaces) => {
    return workspaces.filter((workspace) => workspace.app === category)
  })
}
