import { useSyncExternalStore } from 'react'

import type { CaptchaChallengeState } from '../api-client'
import { GFWAPI } from '../api-client'

const IDLE: CaptchaChallengeState = { status: 'idle' }

/** Turnstile widget GFWAPI is solving: its status and the action of the protected route */
export const useCaptchaChallengeState = () =>
  useSyncExternalStore(GFWAPI.subscribeChallengeState, GFWAPI.getCaptchaChallengeState, () => IDLE)
