import { createSelector } from '@reduxjs/toolkit'

import { selectFeatureFlags } from 'features/debug/debug.slice'

export const selectIsGlobalReportsEnabled = createSelector(
  [selectFeatureFlags],
  (featureFlags) => featureFlags.globalReports === true
)
export const selectIsWorkspaceGeneratorEnabled = createSelector(
  [selectFeatureFlags],
  (featureFlags) => featureFlags.workspaceGenerator === true
)
