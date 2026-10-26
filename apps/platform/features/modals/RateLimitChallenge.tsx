import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { useRateLimitChallengeState } from '@globalfishingwatch/api-client/hooks'
import { Button } from '@globalfishingwatch/ui-components/button'

import styles from './RateLimitChallenge.module.css'

// GFWAPI renders the Turnstile widget here when track/events requests approach the rate limit.
// It stays invisible unless Cloudflare asks for an interaction, so the node must never remount:
// moving the iframe reloads the challenge.
function RateLimitChallenge() {
  const { t } = useTranslation()
  const challengeState = useRateLimitChallengeState()
  const containerRef = useCallback((container: HTMLDivElement) => {
    GFWAPI.setRateLimitChallengeContainer(container)
    return () => GFWAPI.clearRateLimitChallengeContainer(container)
  }, [])
  const interactive = challengeState === 'interactive'
  const failed = challengeState === 'failed'

  return (
    <div className={cx(styles.overlay, { [styles.visible]: interactive || failed })}>
      <div className={styles.content}>
        {interactive && <p>{t((t) => t.rateLimit.challenge)}</p>}
        {failed && (
          <div className={styles.failed} role="alert">
            <p>{t((t) => t.rateLimit.failed)}</p>
            <div className={styles.actions}>
              <Button type="secondary" onClick={GFWAPI.cancelRateLimitChallenge}>
                {t((t) => t.common.cancel)}
              </Button>
              <Button onClick={GFWAPI.retryRateLimitChallenge}>
                {t((t) => t.rateLimit.retry)}
              </Button>
            </div>
          </div>
        )}
        <div ref={containerRef} />
      </div>
    </div>
  )
}

export default RateLimitChallenge
