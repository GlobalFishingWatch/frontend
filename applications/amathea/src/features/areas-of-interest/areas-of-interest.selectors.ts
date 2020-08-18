import { createSelector } from '@reduxjs/toolkit'
import { selectAllAOI } from 'features/areas-of-interest/areas-of-interest.slice'
import { selectCurrentWorkspace } from 'features/workspaces/workspaces.slice'

export const getCurrentAOI = createSelector(
  [selectAllAOI, selectCurrentWorkspace],
  (aois, currentWorkspace) => {
    if (!currentWorkspace) return
    return aois.find((aoi) => aoi.id === currentWorkspace.aoiId)
  }
)
