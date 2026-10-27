import { createSelector } from '@reduxjs/toolkit'

import { ThinningLevels } from '@globalfishingwatch/api-client'
import {} from '@globalfishingwatch/dataviews-client'

import {
  selectIsTurningTidesWorkspace,
  selectTimeMode,
} from 'features/_map/workspace/workspace.selectors'
import { selectDebugOptions } from 'features/debug/debug.slice'

const TRACK_THINNING_BY_ZOOM = {
  0: ThinningLevels.Insane,
  4: ThinningLevels.Aggressive,
  7: ThinningLevels.Default,
}

export const selectTrackThinningConfig = createSelector(
  [selectDebugOptions, selectIsTurningTidesWorkspace, selectTimeMode],
  ({ thinning, vesselGapsThresholdFilter }, isTurningTidesWorkspace, timeMode) => {
    if (
      !thinning ||
      isTurningTidesWorkspace ||
      vesselGapsThresholdFilter ||
      timeMode === 'realTime'
    ) {
      return { 0: ThinningLevels.None }
    }
    return TRACK_THINNING_BY_ZOOM
  }
)
