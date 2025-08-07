import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { IS_PRODUCTION_WORKSPACE_ENV } from 'data/config'

function ShutdownDisclaimerToast() {
  const { t } = useTranslation()
  return <p>{`${t('toasts.shutdownDisclaimerTitle')}. ${t('toasts.shutdownDisclaimer')}`}</p>
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
