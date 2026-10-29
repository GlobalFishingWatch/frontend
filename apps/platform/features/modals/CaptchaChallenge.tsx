import { Fragment, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { CAPTCHA_ACTIONS, GFWAPI } from '@globalfishingwatch/api-client'
import {
  useCaptchaChallengeState,
  useRateLimitChallengeState,
} from '@globalfishingwatch/api-client/hooks'
import { Button } from '@globalfishingwatch/ui-components/button'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'

import styles from './CaptchaChallenge.module.css'

// GFWAPI renders the Turnstile widget here for every captcha protected request, e.g. the
// track/events limit reset (429) or the token refresh.
// It stays invisible unless Cloudflare asks for an interaction, so the node must never remount:
// moving the iframe reloads the challenge.
function CaptchaChallenge() {
  const { t } = useTranslation()
  const captcha = useCaptchaChallengeState()
  const rateLimitState = useRateLimitChallengeState()
  const containerRef = useCallback((container: HTMLDivElement) => {
    GFWAPI.setCaptchaContainer(container)
    return () => GFWAPI.clearCaptchaContainer(container)
  }, [])

  const previousRateLimitState = useRef(rateLimitState)
  useEffect(() => {
    const previous = previousRateLimitState.current
    previousRateLimitState.current = rateLimitState
    // From 'failed' it is a user retry, same reset
    if (rateLimitState === 'resetting' && (previous === 'idle' || previous === 'cancelled')) {
      trackEvent({ category: TrackCategory.Tracks, action: 'rate_limit_reset_needed' })
    }
  }, [rateLimitState])

  const interactive = captcha.status === 'interactive'
  const rateLimitCaptcha = captcha.action === CAPTCHA_ACTIONS.visualizeLimitReset
  useEffect(() => {
    if (interactive && rateLimitCaptcha) {
      trackEvent({ category: TrackCategory.Tracks, action: 'rate_limit_challenge_interactive' })
    }
  }, [interactive, rateLimitCaptcha])

  const failed = rateLimitState === 'failed'

  return (
    <div className={cx(styles.overlay, { [styles.visible]: interactive || failed })}>
      <div className={styles.content}>
        {interactive && (
          <div className={styles.message}>
            <h2 className={styles.title}>{t((t) => t.rateLimit.challengeTitle)}</h2>
            {rateLimitCaptcha && <p>{t((t) => t.rateLimit.challenge)}</p>}
          </div>
        )}
        {failed && (
          <Fragment>
            <div className={styles.message} role="alert">
              <h2 className={styles.title}>{t((t) => t.rateLimit.failedTitle)}</h2>
              <p>{t((t) => t.rateLimit.failed)}</p>
            </div>
            <div className={styles.actions}>
              <Button type="secondary" onClick={GFWAPI.cancelRateLimitChallenge}>
                {t((t) => t.rateLimit.notNow)}
              </Button>
              <Button onClick={GFWAPI.retryRateLimitChallenge}>
                {t((t) => t.rateLimit.verify)}
              </Button>
            </div>
          </Fragment>
        )}
        <div className={styles.challengeContainer} ref={containerRef} />
      </div>
    </div>
  )
}

export default CaptchaChallenge
