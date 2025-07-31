import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { IS_PRODUCTION_WORKSPACE_ENV } from 'data/config'

import styles from './App.module.css'

function ShutdownDisclaimerToast() {
  const { t } = useTranslation()
  return (
    <p>
      <h2 className={styles.disclaimerTitle}>{t('toasts.shutdownDisclaimerTitle')}</h2>
      {t('toasts.shutdownDisclaimer')}
    </p>
  )
}

export const useShutdownDisclaimerToast = () => {
  useEffect(() => {
    if (IS_PRODUCTION_WORKSPACE_ENV) {
      toast(<ShutdownDisclaimerToast />, {
        toastId: 'shutdownDisclaimer',
        autoClose: 5000,
      })
    }
  }, [])
}
