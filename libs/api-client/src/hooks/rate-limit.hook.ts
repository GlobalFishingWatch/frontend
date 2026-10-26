import { useSyncExternalStore } from 'react'

import { GFWAPI } from '../api-client'

/** State of the GFWAPI rate limit challenge: 'idle' | 'solving' | 'interactive' | 'failed' */
export const useRateLimitChallengeState = () =>
  useSyncExternalStore(
    GFWAPI.subscribeRateLimitChallenge,
    GFWAPI.getRateLimitChallengeState,
    () => 'idle' as const
  )
