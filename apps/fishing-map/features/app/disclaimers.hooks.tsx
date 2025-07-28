import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

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
    toast(<ShutdownDisclaimerToast />, {
      toastId: 'shutdownDisclaimer',
      autoClose: 5000,
    })
  }, [])
}
