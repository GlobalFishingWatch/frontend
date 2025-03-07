import { createSelector } from '@reduxjs/toolkit'

import { selectFeatureFlags } from 'routes/routes.selectors'
import type { FeatureFlag } from 'types'

export const selectIsFeatureFlagEnabled = (flag: FeatureFlag) =>
  createSelector([selectFeatureFlags], (featureFlags = []) => featureFlags?.includes(flag))

export const selectIsGlobalReportsEnabled = selectIsFeatureFlagEnabled('globalReports')
export const selectIsResponsiveVisualizationEnabled =
  selectIsFeatureFlagEnabled('responsiveVisualization')
