
import { createSelector } from '@reduxjs/toolkit'
import {  ThinningConfig } from '@globalfishingwatch/api-types'
import { RootState } from 'store'
import { selectVisibleEvents } from 'features/app/app.selectors'
import { THINNING_LEVEL_BY_ZOOM, THINNING_LEVEL_ZOOMS } from 'data/config'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { isGuestUser } from 'features/user/user.slice'
import { selectUrlMapZoomQuery } from 'routes/routes.selectors'
import { selectResources } from './resources.slice'

export const selectVisibleResources = createSelector(
  [selectResources, (state: RootState) => selectVisibleEvents(state)],
  (resources, visibleEvents) => {
    if (visibleEvents === 'all') {
      return resources
    }
    return Object.fromEntries(
      Object.entries(resources).filter(([url, resource]) => {
        return url.includes('events') && resource.dataset?.configuration?.type
          ? visibleEvents.includes(resource.dataset.configuration.type)
          : true
      })
    )
  }
)

export const selectThinningConfig = createSelector(
  [(state) => isGuestUser(state), selectDebugOptions, selectUrlMapZoomQuery],
  (guestUser, { thinning }, currentZoom) => {
    if (!thinning) return null
    let thinningConfig: ThinningConfig
    for (let i = 0; i < THINNING_LEVEL_ZOOMS.length; i++) {
      const zoom = THINNING_LEVEL_ZOOMS[i]
      if (currentZoom < zoom) break
      thinningConfig = THINNING_LEVEL_BY_ZOOM[zoom][guestUser ? 'guest' : 'user']
      
    }

    return thinningConfig
  }
)
