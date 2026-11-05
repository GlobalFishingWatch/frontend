import { useSyncExternalStore } from 'react'

import { GFWAPI } from '../api-client'

/** State of the GFWAPI rate limit reset: 'idle' | 'resetting' | 'failed' | 'cancelled' */
export const useRateLimitChallengeState = () =>
  useSyncExternalStore(
    GFWAPI.subscribeChallengeState,
    GFWAPI.getRateLimitChallengeState,
    () => 'idle' as const
  )
