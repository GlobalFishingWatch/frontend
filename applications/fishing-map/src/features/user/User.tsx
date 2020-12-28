import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Link from 'redux-first-router-link'
import Button from '@globalfishingwatch/ui-components/dist/button'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { AsyncReducerStatus } from 'types'
import {
  fetchWorkspacesThunk,
  selectWorkspaceListStatus,
  selectWorkspaces,
} from 'features/workspaces-list/workspaces-list.slice'
import { WORKSPACE } from 'routes/routes'
import { WorkspaceCategories } from 'data/workspaces'
import styles from './User.module.css'
import { isUserLogged, logoutUserThunk, selectUserData } from './user.slice'

function User() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const userLogged = useSelector(isUserLogged)
  const userData = useSelector(selectUserData)
  const workspaces = useSelector(selectWorkspaces)
  const workspacesStatus = useSelector(selectWorkspaceListStatus)

  useEffect(() => {
    if (userLogged) {
      dispatch(fetchWorkspacesThunk(WorkspaceCategories.FishingActivity))
    }
  }, [dispatch, userLogged])

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
      {/* <div className={styles.views}>
        <label>Your private views</label>
      </div> */}
      <div className={styles.views}>
        <label>Your latest saved views</label>
        {workspacesStatus === AsyncReducerStatus.Loading ? (
          <Spinner size="small" />
        ) : (
          <ul>
            {[...workspaces]
              .reverse()
              .slice(0, 10)
              .map((workspace) => {
                return (
                  <li className={styles.workspace} key={workspace.id}>
                    <Link
                      className={styles.workspaceLink}
                      to={{
                        type: WORKSPACE,
                        payload: {
                          category: WorkspaceCategories.FishingActivity,
                          workspaceId: workspace.id,
                        },
                        query: {},
                      }}
                    >
                      <span className={styles.workspaceTitle}>{workspace.name}</span>
                      <IconButton icon="arrow-right" />
                    </Link>
                  </li>
                )
              })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default User
