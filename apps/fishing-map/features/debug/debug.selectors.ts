import { createSelector } from '@reduxjs/toolkit'

import { selectFeatureFlags } from 'features/debug/debug.slice'

export const selectIsWorkspaceGeneratorEnabled = createSelector(
  [selectFeatureFlags],
  (featureFlags) => featureFlags.workspaceGenerator === true
)
