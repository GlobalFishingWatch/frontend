import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { Button } from '@globalfishingwatch/ui-components'

import { SUPPORT_EMAIL } from 'data/map/config'
import LoginLink from 'features/_user/LoginLink'
import { selectIsGuestUser, selectUserData } from 'features/_user/selectors/user.selectors'
import { usePopupLogin } from 'features/_user/user.hooks'
import type { LoginSource } from 'features/_user/user.types'

import ErrorPlaceholder from './ErrorPlaceholder'

import styles from './Workspace.module.css'

interface WorkspaceLoginErrorProps {
  title: string
  emailSubject?: string
  className?: string
  loginSource?: LoginSource
}

export default function WorkspaceLoginError({
  title,
  emailSubject,
  className,
  loginSource,
}: WorkspaceLoginErrorProps) {
  const { t } = useTranslation()
  const [logoutLoading, setLogoutLoading] = useState(false)
  const guestUser = useSelector(selectIsGuestUser)
  const userData = useSelector(selectUserData)
  const openPopupLogin = usePopupLogin()

  return (
    <ErrorPlaceholder title={title} className={cx(className, 'print-hidden')}>
      {guestUser ? (
        <LoginLink className={styles.button} loginSource={loginSource}>
          {t((t) => t.common.login)}
        </LoginLink>
      ) : (
        <Fragment>
          {emailSubject && (
            <Button href={`mailto:${SUPPORT_EMAIL}?subject=${emailSubject}`}>
              {t((t) => t.errors.requestAccess) as string}
            </Button>
          )}
          {userData?.email && (
            <p className={styles.logged}>
              {t((t) => t.common.loggedAs)} {userData.email}
            </p>
          )}
          <Button
            type="secondary"
            size="small"
            loading={logoutLoading}
            onClick={async () => {
              setLogoutLoading(true)
              openPopupLogin()
              setLogoutLoading(false)
            }}
          >
            {t((t) => t.errors.switchAccount) as string}
          </Button>
        </Fragment>
      )}
    </ErrorPlaceholder>
  )
}
