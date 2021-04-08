import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'
import Button from '@globalfishingwatch/ui-components/dist/button'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { HOME } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import { SUPPORT_EMAIL } from 'data/config'
import styles from './User.module.css'
import { fetchUserThunk, GUEST_USER_TYPE, logoutUserThunk, selectUserData } from './user.slice'
import { isUserLogged } from './user.selectors'

const DEFAULT_GROUP_ID = 'Default'

function UserInfo() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const userLogged = useSelector(isUserLogged)
  const userData = useSelector(selectUserData)
  const [logoutLoading, setLogoutLoading] = useState(false)

  const onLogoutClick = useCallback(async () => {
    setLogoutLoading(true)
    await dispatch(logoutUserThunk())
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
  const cleanGroups = userData.groups?.filter((g) => g !== DEFAULT_GROUP_ID)

  return (
    <div className={styles.userInfo}>
      <div className={styles.views}>
        <div className={styles.viewsHeader}>
          <div>
            <label>{t('user.title', 'User')}</label>
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
        {cleanGroups && <p className={styles.textSpaced}>{cleanGroups.join(', ')}</p>}
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
