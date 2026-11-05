import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@globalfishingwatch/ui-components/button'
import { Spinner } from '@globalfishingwatch/ui-components/spinner'

import { useHumanSession } from 'features/human-session/human-session.hooks'

import styles from './HumanSessionGate.module.css'

// Renders its children only for sessions that passed the captcha. An interactive challenge
// shows in the CaptchaChallenge overlay, so there is no widget here
function HumanSessionGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const { status, ensure } = useHumanSession()

  useEffect(() => {
    if (status === 'unknown') {
      ensure()
    }
  }, [status, ensure])

  if (status === 'verified') {
    return children
  }

  if (status === 'failed') {
    return (
      <div className={styles.gate} role="alert">
        <p className={styles.message}>{t((t) => t.humanSession.failed)}</p>
        <Button onClick={ensure}>{t((t) => t.rateLimit.verify)}</Button>
      </div>
    )
  }

  return (
    <div className={styles.gate}>
      <Spinner size="small" />
    </div>
  )
}

export default HumanSessionGate
