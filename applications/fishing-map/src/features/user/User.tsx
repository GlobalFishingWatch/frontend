import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { logoutUserThunk, selectUserData } from './user.slice'

function User() {
  const { t } = useTranslation()
  const userData = useSelector(selectUserData)
  const dispatch = useDispatch()

  const onLogoutClick = useCallback(() => {
    dispatch(logoutUserThunk())
  }, [dispatch])

  if (!userData) return null
  return (
    <div>
      <h3>User</h3>
      <p>{`${userData.firstName} ${userData.lastName || ''}`}</p>
      <p>{userData.email}</p>
      <Button type="secondary" onClick={onLogoutClick}>
        <span>{t('common.logout', 'Log out')}</span>
      </Button>
    </div>
  )
}

export default User
