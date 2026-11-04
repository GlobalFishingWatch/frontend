import { useSyncExternalStore } from 'react'

import { GFWAPI, IDLE_CAPTCHA_CHALLENGE } from '../api-client'

/** Turnstile widget GFWAPI is solving: its status and the action of the protected route */
export const useCaptchaChallengeState = () =>
  useSyncExternalStore(
    GFWAPI.subscribeChallengeState,
    GFWAPI.getCaptchaChallengeState,
    () => IDLE_CAPTCHA_CHALLENGE
  )
