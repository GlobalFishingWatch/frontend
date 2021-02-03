import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Button from '@globalfishingwatch/ui-components/dist/button'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import GFWAPI from '@globalfishingwatch/api-client'
import { fetchWorkspacesThunk } from 'features/workspaces-list/workspaces-list.slice'
import { HOME } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import { AsyncReducerStatus } from 'types'
import styles from './User.module.css'
import {
  fetchUserDatasetsThunk,
  fetchUserThunk,
  GUEST_USER_TYPE,
  logoutUserThunk,
  selectUserData,
  selectUserDatasetsStatus,
} from './user.slice'
import { isUserLogged } from './user.selectors'
import UserWorkspaces from './UserWorkspaces'
import UserDatasets from './UserDatasets'

function User() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const userLogged = useSelector(isUserLogged)
  const userData = useSelector(selectUserData)
  const userDatasetStatus = useSelector(selectUserDatasetsStatus)
  const [logoutLoading, setLogoutLoading] = useState(false)

  useEffect(() => {
    if (userLogged && userData?.id) {
      dispatch(fetchWorkspacesThunk({ userId: userData?.id }))
      if (userDatasetStatus === AsyncReducerStatus.Idle) {
        dispatch(fetchUserDatasetsThunk())
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userData?.id, userLogged])

  useEffect(() => {
    if (userData?.type === GUEST_USER_TYPE) {
      window.location.href = GFWAPI.getLoginUrl(window.location.toString())
    }
  }, [userData?.type])

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

  return (
    <div className={styles.container}>
      <div className={styles.userInfo}>
        <div>
          <label>User</label>
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
      <UserWorkspaces />
      <UserDatasets />
    </div>
  )
}

export default User
