import { createSelector } from '@reduxjs/toolkit'
import {
  ResourcesState as CommonResourcesState,
  resourcesSlice,
} from '@globalfishingwatch/dataviews-client'
import { THINNING_CONFIG } from 'data/config'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { isGuestUser } from 'features/user/user.slice'

export {
  fetchResourceThunk,
  selectResourceByUrl,
  selectResources,
} from '@globalfishingwatch/dataviews-client'

// DO NOT MOVE TO RESOURCES.SELECTORS, IT CREATES A CIRCULAR DEPENDENCY
export const selectTrackThinningConfig = createSelector(
  [(state) => isGuestUser(state), selectDebugOptions],
  (guestUser, { thinning }) => {
    if (!thinning) return null
    const config = THINNING_CONFIG[guestUser ? 'guest' : 'user']

    return { config }
  }
)

export type ResourcesState = CommonResourcesState
export default resourcesSlice.reducer
