import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { Button } from '@globalfishingwatch/ui-components'

import styles from './ErrorBoundary.module.css'

interface ErrorBoundaryUIProps {
  error: Error
}

export default function ErrorBoundaryUI({ error }: ErrorBoundaryUIProps) {
  const { t } = useTranslation()
  const [showError, setShowError] = useState(false)
  const { message, stack } = error
  const errorInfo = [message, stack, document.URL]

  const mailto = [
    'mailto:support@globalfishingwatch.org?',
    Object.entries({
      subject: 'Reporting an error',
      body: errorInfo.join('\n'),
    })
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&'),
  ].join('')

  return (
    <div className={styles.errorBoundary}>
      <h1 className={styles.title}>{t('errors.genericShort', 'Something went wrong')}</h1>
      <div>
        <Button type="secondary" size="small" onClick={() => setShowError(!showError)}>
          {t('errors.showError', 'Show error')} ▾
        </Button>
        <div className={styles.error}>
          {showError && errorInfo.map((info, i) => <div key={i}>{info}</div>)}
        </div>
      </div>
      <div className={styles.mailto}>
        <Trans i18nKey="errors.contactUs">
          Please <a href={mailto}>contact us</a> to report the problem.
        </Trans>
      </div>
    </div>
  )
}
