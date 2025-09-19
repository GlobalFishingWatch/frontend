import { createSelector } from '@reduxjs/toolkit'

import { selectFeatureFlags } from 'features/debug/debug.slice'

export const selectIsOthersReportEnabled = createSelector(
  [selectFeatureFlags],
  (featureFlags) => featureFlags.othersReport === true
)

export const selectIsWorkspaceGeneratorEnabled = createSelector(
  [selectFeatureFlags],
  (featureFlags) => featureFlags.workspaceGenerator === true
)
