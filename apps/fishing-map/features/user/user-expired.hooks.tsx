import { useEffect, useRef } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import LocalStorageLoginLink from 'routes/LoginLink'

import { selectIsUserExpired } from './selectors/user.selectors'

import styles from './User.module.css'

export const useUserExpiredToast = () => {
  const isUserExpired = useSelector(selectIsUserExpired)
  const toastId = useRef<any>(undefined)

  const ToastContent = () => (
    <div className={styles.disclaimer}>
      <Trans i18nKey="errors.sessionExpired">
        Your session has expired, please
        <LocalStorageLoginLink className={styles.link}>log in</LocalStorageLoginLink> again.
      </Trans>
    </div>
  )

  useEffect(() => {
    if (isUserExpired) {
      toastId.current = toast(<ToastContent />, {
        toastId: 'user-expired',
        autoClose: false,
        closeButton: true,
      })
    }
  }, [isUserExpired])
}
