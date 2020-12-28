import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { logoutUserThunk, selectUserData } from './user.slice'
import styles from './User.module.css'

function User() {
  const { t } = useTranslation()
  const userData = useSelector(selectUserData)
  const dispatch = useDispatch()

  const onLogoutClick = useCallback(() => {
    dispatch(logoutUserThunk())
  }, [dispatch])

  if (!userData) return null
  return (
    <div className={styles.container}>
      <div className={styles.userInfo}>
        <div>
          <label>User</label>
          <p>{`${userData.firstName} ${userData.lastName || ''}`}</p>
          <p className={styles.secondary}>{userData.email}</p>
        </div>
        <Button type="secondary" onClick={onLogoutClick}>
          <span>{t('common.logout', 'Log out')}</span>
        </Button>
      </div>
      <div className={styles.views}>
        <label>Your private views</label>
      </div>
      <div className={styles.views}>
        <label>Yopur latest saved views</label>
      </div>
    </div>
  )
}

export default User
