import { createSelector } from '@reduxjs/toolkit'
import { ThinningLevels, THINNING_LEVELS } from 'data/config'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { isGuestUser } from 'features/selectors/user.selectors'

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
