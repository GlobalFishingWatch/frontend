import { createSelector } from '@reduxjs/toolkit'

import { IS_REALTIME_ENABLED } from 'data/config'
import { selectIsAnyVesselLocation, selectIsWorkspaceLocation } from 'router/routes.selectors'

export const selectHasTimeModeEnabled = createSelector(
  [selectIsWorkspaceLocation, selectIsAnyVesselLocation],
  (isWorkspaceLocation, isAnyVesselLocation) => {
    if (!IS_REALTIME_ENABLED) {
      return false
    }
    if (isWorkspaceLocation || isAnyVesselLocation) {
      return true
    }
    return false
  }
)
