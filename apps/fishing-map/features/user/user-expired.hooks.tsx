import { useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { Trans } from 'react-i18next'
import LocalStorageLoginLink from 'routes/LoginLink'
import styles from './User.module.css'
import { selectIsUserExpired } from './selectors/user.selectors'

export const useUserExpiredToast = () => {
  const isUserExpired = useSelector(selectIsUserExpired)
  const toastId = useRef<any>()

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserExpired])
}
