import { createSelector } from '@reduxjs/toolkit'
import { selectAOIById } from 'features/areas-of-interest/areas-of-interest.slice'
import { selectCurrentWorkspace } from 'features/workspaces/workspaces.slice'

export const getCurrentAOI = createSelector(
  [(state) => state, selectCurrentWorkspace],
  (state, currentWorkspace) => {
    if (!currentWorkspace) return
    return selectAOIById(state, currentWorkspace.aoiId)
  }
)
