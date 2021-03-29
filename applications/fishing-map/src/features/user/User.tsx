import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'
import Button from '@globalfishingwatch/ui-components/dist/button'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import GFWAPI from '@globalfishingwatch/api-client'
import { DatasetCategory } from '@globalfishingwatch/api-types/dist'
import EditDataset from 'features/datasets/EditDataset'
import { fetchWorkspacesThunk } from 'features/workspaces-list/workspaces-list.slice'
import { HOME } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import { fetchAllDatasetsThunk } from 'features/datasets/datasets.slice'
import { useDatasetModalConnect } from 'features/datasets/datasets.hook'
import { SUPPORT_EMAIL } from 'data/config'
import styles from './User.module.css'
import { fetchUserThunk, GUEST_USER_TYPE, logoutUserThunk, selectUserData } from './user.slice'
import { isUserLogged } from './user.selectors'
import UserWorkspaces from './UserWorkspaces'
import UserDatasets from './UserDatasets'

function User() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const userLogged = useSelector(isUserLogged)
  const userData = useSelector(selectUserData)
  const { datasetModal, editingDatasetId } = useDatasetModalConnect()
  const [logoutLoading, setLogoutLoading] = useState(false)

  useEffect(() => {
    if (userLogged && userData?.id) {
      dispatch(fetchWorkspacesThunk({ userId: userData?.id }))
    }
  }, [dispatch, userData?.id, userLogged])

  useEffect(() => {
    dispatch(fetchAllDatasetsThunk())
  }, [dispatch])

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
      <div className={styles.views}>
        <label>{t('user.groups', 'User Groups')}</label>
        {userData.groups && <p className={styles.textSpaced}>{userData.groups.join(', ')}</p>}
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
      <UserWorkspaces />
      <UserDatasets datasetCategory={DatasetCategory.Environment} />
      <UserDatasets datasetCategory={DatasetCategory.Context} />
      {datasetModal === 'edit' && editingDatasetId !== undefined && <EditDataset />}
    </div>
  )
}

export default User
