import React, { Suspense, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import Button from '@globalfishingwatch/ui-components/dist/button'
import GFWAPI from '@globalfishingwatch/api-client'
import { logoutUserThunk } from 'features/user/user.slice'
import { isGuestUser, isUserAuthorized, isUserLogged } from 'features/user/user.selectors'
import Search from 'features/search/Search'
import { selectSearchQuery } from 'features/app/app.selectors'
import { selectLocationType } from 'routes/routes.selectors'
import { USER, WORKSPACES_LIST } from 'routes/routes'
import User from 'features/user/User'
import Workspace from 'features/workspace/Workspace'
import WorkspacesList from 'features/workspaces-list/WorkspacesList'
import NewDataset from 'features/datasets/NewDataset'
import { AsyncReducerStatus } from 'types'
import { selectHighlightedWorkspacesStatus } from 'features/workspaces-list/workspaces-list.slice'
import styles from './Sidebar.module.css'
import CategoryTabs from './CategoryTabs'
import SidebarHeader from './SidebarHeader'

type SidebarProps = {
  onMenuClick: () => void
}

function Sidebar({ onMenuClick }: SidebarProps) {
  const { t } = useTranslation()
  const searchQuery = useSelector(selectSearchQuery)
  const locationType = useSelector(selectLocationType)
  const guestUser = useSelector(isGuestUser)
  const userLogged = useSelector(isUserLogged)
  const userAuthorized = useSelector(isUserAuthorized)
  const highlightedWorkspacesStatus = useSelector(selectHighlightedWorkspacesStatus)
  const dispatch = useDispatch()

  const sidebarComponent = useMemo(() => {
    if (!userLogged || highlightedWorkspacesStatus === AsyncReducerStatus.Loading) {
      return <Spinner />
    }
    // TODO remove once public release and permissions to use map in anonymous user
    if (!userAuthorized) {
      return (
        <div className={styles.placeholder}>
          {guestUser ? (
            <h2>You need to login to see this view</h2>
          ) : (
            <h2>We're sorry but your user is not authorized to use this app yet</h2>
          )}
          {guestUser ? (
            <Button
              className={styles.errorBtn}
              href={GFWAPI.getLoginUrl(window.location.toString())}
            >
              {t('common.login', 'Log in') as string}
            </Button>
          ) : (
            <Button
              className={styles.errorBtn}
              onClick={async () => {
                dispatch(logoutUserThunk({ redirectToLogin: true }))
              }}
            >
              Logout
            </Button>
          )}
        </div>
      )
    }

    if (locationType === USER) {
      return <User />
    }
    if (locationType === WORKSPACES_LIST) {
      return <WorkspacesList />
    }
    return <Workspace />
  }, [
    dispatch,
    locationType,
    userAuthorized,
    userLogged,
    highlightedWorkspacesStatus,
    guestUser,
    t,
  ])

  if (searchQuery !== undefined) {
    return <Search />
  }
  return (
    <Suspense fallback={null}>
      <div className={styles.container}>
        <CategoryTabs onMenuClick={onMenuClick} />
        {/* New dataset modal is used in user and workspace pages*/}
        <NewDataset />
        <div className="scrollContainer">
          <SidebarHeader />
          {sidebarComponent}
        </div>
      </div>
    </Suspense>
  )
}

export default Sidebar
