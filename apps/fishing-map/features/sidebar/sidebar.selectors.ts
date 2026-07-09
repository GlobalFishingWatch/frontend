import { createSelector } from '@reduxjs/toolkit'

import { selectIsAnyVesselLocation, selectIsWorkspaceLocation } from 'router/routes.selectors'

export const selectHasTimeModeEnabled = createSelector(
  [selectIsWorkspaceLocation, selectIsAnyVesselLocation],
  (isWorkspaceLocation, isAnyVesselLocation) => {
    if (isWorkspaceLocation || isAnyVesselLocation) {
      return true
    }
    return false
  }
)
