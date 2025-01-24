import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Button } from '@globalfishingwatch/ui-components'

import { SUPPORT_EMAIL } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectIsGuestUser, selectUserData } from 'features/user/selectors/user.selectors'
import { logoutUserThunk } from 'features/user/user.slice'
import LocalStorageLoginLink from 'routes/LoginLink'

import ErrorPlaceholder from './ErrorPlaceholder'

import styles from './Workspace.module.css'

interface WorkspaceLoginErrorProps {
  title: string
  emailSubject?: string
}

export default function WorkspaceLoginError({ title, emailSubject }: WorkspaceLoginErrorProps) {
  const { t } = useTranslation()
  const [logoutLoading, setLogoutLoading] = useState(false)
  const guestUser = useSelector(selectIsGuestUser)
  const userData = useSelector(selectUserData)
  const dispatch = useAppDispatch()

  return (
    <ErrorPlaceholder title={title}>
      {guestUser ? (
        <LocalStorageLoginLink className={styles.button}>
          {t('common.login', 'Log in') as string}
        </LocalStorageLoginLink>
      ) : (
        <Fragment>
          {emailSubject && (
            <Button href={`mailto:${SUPPORT_EMAIL}?subject=${emailSubject}`}>
              {t('errors.requestAccess', 'Request access') as string}
            </Button>
          )}
          {userData?.email && (
            <p className={styles.logged}>
              {t('common.loggedAs', 'Logged as')} {userData.email}
            </p>
          )}
          <Button
            type="secondary"
            size="small"
            loading={logoutLoading}
            onClick={async () => {
              setLogoutLoading(true)
              await dispatch(logoutUserThunk({ loginRedirect: true }))
              setLogoutLoading(false)
            }}
          >
            {t('errors.switchAccount', 'Switch account') as string}
          </Button>
        </Fragment>
      )}
    </ErrorPlaceholder>
  )
}
