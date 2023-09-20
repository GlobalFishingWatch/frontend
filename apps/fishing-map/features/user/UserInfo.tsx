import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'
import { Button, Spinner } from '@globalfishingwatch/ui-components'
import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import { HOME } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import { SUPPORT_EMAIL } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import styles from './User.module.css'
import { fetchUserThunk, logoutUserThunk, selectUserData, isUserLogged } from './user.slice'
import { selectUserGroupsClean } from './user.selectors'

function UserInfo() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const userLogged = useSelector(isUserLogged)
  const userData = useSelector(selectUserData)
  const userGroups = useSelector(selectUserGroupsClean)
  const [logoutLoading, setLogoutLoading] = useState(false)

  const onLogoutClick = useCallback(async () => {
    setLogoutLoading(true)
    await dispatch(logoutUserThunk({ loginRedirect: false }))
    dispatch(updateLocation(HOME, { replaceQuery: true }))
    await dispatch(fetchUserThunk({ guest: true }))
    setLogoutLoading(false)
  }, [dispatch])

  if (!userLogged || !userData) return null

  if (!userLogged || !userData || userData?.type === GUEST_USER_TYPE) {
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    )
  }

  return (
    <div className={styles.userInfo}>
      <div className={styles.views}>
        <div className={styles.viewsHeader}>
          <div>
            <p>{`${userData.firstName} ${userData.lastName || ''}`}</p>
            <p className={styles.secondary}>{userData.email}</p>
          </div>
          <Button
            type="secondary"
            loading={logoutLoading}
            disabled={logoutLoading}
            onClick={onLogoutClick}
          >
            <span>{t('common.logout', 'Log out')}</span>
          </Button>
        </div>
        <label>{t('user.groups', 'User Groups')}</label>
        {userGroups && <p className={styles.textSpaced}>{userGroups.join(', ')}</p>}
        <p className={styles.missingGroup}>
          <Trans i18nKey="user.groupMissing">
            Do you belong to a user group that doesn’t appear here?{' '}
            <a
              className={styles.link}
              href={`mailto:${SUPPORT_EMAIL}?subject=Requesting access in user group`}
            >
              Request access
            </a>
          </Trans>
        </p>
      </div>
    </div>
  )
}

export default UserInfo
