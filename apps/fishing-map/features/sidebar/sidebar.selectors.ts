import { createSelector } from '@reduxjs/toolkit'

import {
  selectIsAnyReportLocation,
  selectIsAnyVesselLocation,
  selectIsWorkspaceLocation,
} from 'router/routes.selectors'

export const selectHasTimeModeEnabled = createSelector(
  [selectIsWorkspaceLocation, selectIsAnyVesselLocation, selectIsAnyReportLocation],
  (isWorkspaceLocation, isAnyVesselLocation, isAnyReportLocation) => {
    if (isWorkspaceLocation || isAnyVesselLocation || isAnyReportLocation) {
      return true
    }
    return false
  }
)
