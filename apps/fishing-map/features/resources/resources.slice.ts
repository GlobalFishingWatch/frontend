import { createSelector } from '@reduxjs/toolkit'
import {
  ResourcesState as CommonResourcesState,
  resourcesSlice,
} from '@globalfishingwatch/dataviews-client'
import { ThinningLevels, THINNING_LEVELS } from 'data/config'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { isGuestUser } from 'features/user/user.slice'

export {
  fetchResourceThunk,
  selectResourceByUrl,
  selectResources,
} from '@globalfishingwatch/dataviews-client'

export const selectThinningConfig = createSelector(
  [(state) => isGuestUser(state), selectDebugOptions],
  (guestUser, { thinning }) => {
    if (!thinning) return null
    const thinningConfig = guestUser
      ? THINNING_LEVELS[ThinningLevels.Aggressive]
      : THINNING_LEVELS[ThinningLevels.Default]
    return thinningConfig
  }
)

export type ResourcesState = CommonResourcesState
export default resourcesSlice.reducer
