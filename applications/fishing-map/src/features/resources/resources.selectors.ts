import { createSelector } from '@reduxjs/toolkit'
import { selectVisibleEvents } from 'features/app/app.selectors'
import { ThinningLevels, THINNING_LEVELS } from 'data/config'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { isGuestUser } from 'features/user/user.selectors'
import { RootState } from 'store'
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
  [(state) => isGuestUser(state), selectDebugOptions],
  (guestUser, { thinning }) => {
    if (!thinning) return null
    const thinningConfig = guestUser
      ? THINNING_LEVELS[ThinningLevels.Aggressive]
      : THINNING_LEVELS[ThinningLevels.Default]
    return thinningConfig
  }
)
