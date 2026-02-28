import { useEffect, useRef } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { useAppDispatch } from 'features/app/app.hooks'
import LocalStorageLoginLink from 'routes/LoginLink'

import {
  selectIsGuestUser,
  selectIsUserExpired,
  selectUserTokenExpirationTimestamp,
} from './selectors/user.selectors'
import { setLoginExpired } from './user.slice'

import styles from './User.module.css'

const TOKEN_CHECK_INTERVAL = 60 * 5 * 1000 // Check every 5 minutes

export const useUserExpiredToast = () => {
  const dispatch = useAppDispatch()
  const isUserExpired = useSelector(selectIsUserExpired)
  const tokenExpirationTimestamp = useSelector(selectUserTokenExpirationTimestamp)
  const isGuestUser = useSelector(selectIsGuestUser)
  const toastId = useRef<any>(undefined)

  const ToastContent = () => (
    <div className={styles.disclaimer}>
      <Trans i18nKey={(t) => t.errors.sessionExpired}>
        Your session has expired, please
        <LocalStorageLoginLink className={styles.link}>log in</LocalStorageLoginLink> again.
      </Trans>
    </div>
  )

  useEffect(() => {
    if (isGuestUser || !tokenExpirationTimestamp) {
      return
    }

    const checkTokenExpiration = () => {
      const now = Date.now()
      if (tokenExpirationTimestamp && tokenExpirationTimestamp <= now) {
        dispatch(setLoginExpired(true))
      }
    }

    checkTokenExpiration()

    const interval = setInterval(checkTokenExpiration, TOKEN_CHECK_INTERVAL)

    return () => clearInterval(interval)
  }, [dispatch, tokenExpirationTimestamp, isGuestUser])

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
