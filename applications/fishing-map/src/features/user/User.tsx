import React, { useCallback, useEffect, useState } from 'react'
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
} from 'features/workspaces-list/workspaces-list.slice'
import { WORKSPACE } from 'routes/routes'
import { WorkspaceCategories } from 'data/workspaces'
import styles from './User.module.css'
import { logoutUserThunk, selectUserData } from './user.slice'
import { isUserLogged, selectUserWorkspaces } from './user.selectors'

function User() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const userLogged = useSelector(isUserLogged)
  const userData = useSelector(selectUserData)
  const workspaces = useSelector(selectUserWorkspaces)
  const workspacesStatus = useSelector(selectWorkspaceListStatus)
  const [logoutLoading, setLogoutLoading] = useState(false)

  useEffect(() => {
    if (userLogged && workspacesStatus !== AsyncReducerStatus.Finished) {
      dispatch(fetchWorkspacesThunk({ userId: userData?.id }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onLogoutClick = useCallback(() => {
    setLogoutLoading(true)
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
        <Button
          type="secondary"
          loading={logoutLoading}
          disabled={logoutLoading}
          onClick={onLogoutClick}
        >
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
            {workspaces?.map((workspace) => {
              return (
                <li className={styles.workspace} key={workspace.id}>
                  <Link
                    className={styles.workspaceLink}
                    to={{
                      type: WORKSPACE,
                      payload: {
                        // TODO change to workspace category (save in API)
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
