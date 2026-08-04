import { createSelector } from '@reduxjs/toolkit'

import { ThinningLevels } from '@globalfishingwatch/api-client'
import {} from '@globalfishingwatch/dataviews-client'

import {
  selectIsTurningTidesWorkspace,
  selectTimeMode,
} from 'features/_map/workspace/workspace.selectors'
import { selectIsGuestUser } from 'features/_user/selectors/user.selectors'
import { selectDebugOptions } from 'features/debug/debug.slice'

const TRACK_THINNING_BY_ZOOM_GUEST = {
  0: ThinningLevels.Insane,
  4: ThinningLevels.Aggressive,
}
const TRACK_THINNING_BY_ZOOM_USER = { ...TRACK_THINNING_BY_ZOOM_GUEST, 7: ThinningLevels.Default }

export const selectTrackThinningConfig = createSelector(
  [selectIsGuestUser, selectDebugOptions, selectIsTurningTidesWorkspace, selectTimeMode],
  (guestUser, { thinning, vesselGapsThresholdFilter }, isTurningTidesWorkspace, timeMode) => {
    if (
      !thinning ||
      isTurningTidesWorkspace ||
      vesselGapsThresholdFilter ||
      timeMode === 'realTime'
    ) {
      return { 0: ThinningLevels.None }
    }
    return guestUser ? TRACK_THINNING_BY_ZOOM_GUEST : TRACK_THINNING_BY_ZOOM_USER
  }
)
