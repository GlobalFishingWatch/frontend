import { createSelector } from '@reduxjs/toolkit'
import {
  ResourcesState as CommonResourcesState,
  resourcesSlice,
} from '@globalfishingwatch/dataviews-client'
import { THINNING_LEVEL_BY_ZOOM, THINNING_LEVEL_ZOOMS } from 'data/config'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { isGuestUser } from 'features/user/user.slice'
import { selectUrlMapZoomQuery } from 'routes/routes.selectors'

export {
  fetchResourceThunk,
  selectResourceByUrl,
  selectResources,
} from '@globalfishingwatch/dataviews-client'

export const selectThinningConfig = createSelector(
  [(state) => isGuestUser(state), selectDebugOptions, selectUrlMapZoomQuery],
  (guestUser, { thinning }, currentZoom) => {
    if (!thinning) return null

    let thinningConfig
    for (let i = 0; i < THINNING_LEVEL_ZOOMS.length; i++) {
      const zoom = THINNING_LEVEL_ZOOMS[i]
      if (currentZoom < zoom) break
      thinningConfig = THINNING_LEVEL_BY_ZOOM[zoom][guestUser ? 'guest' : 'user']
      
    }
    // console.log(currentZoom, thinningConfig)

    return thinningConfig
  }
)

export type ResourcesState = CommonResourcesState
export default resourcesSlice.reducer
