import { createSelector } from '@reduxjs/toolkit'

import { IS_REALTIME_ENABLED } from 'data/map/config'
import { selectIsGFWUser } from 'features/_user/selectors/user.selectors'
import { selectIsAnyVesselLocation, selectIsWorkspaceLocation } from 'router/routes.selectors'

export const selectHasTimeModeEnabled = createSelector(
  [selectIsWorkspaceLocation, selectIsAnyVesselLocation, selectIsGFWUser],
  (isWorkspaceLocation, isAnyVesselLocation, isGFWUser) => {
    if (!IS_REALTIME_ENABLED || !isGFWUser) {
      return false
    }
    if (isWorkspaceLocation || isAnyVesselLocation) {
      return true
    }
    return false
  }
)
