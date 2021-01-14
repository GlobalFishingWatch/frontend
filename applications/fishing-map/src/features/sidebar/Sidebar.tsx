import React, { Suspense, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { logoutUserThunk } from 'features/user/user.slice'
import { isUserAuthorized, isUserLogged } from 'features/user/user.selectors'
import Search from 'features/search/Search'
import { selectSearchQuery } from 'features/app/app.selectors'
import { selectLocationType } from 'routes/routes.selectors'
import { USER, WORKSPACES_LIST } from 'routes/routes'
import User from 'features/user/User'
import Workspace from 'features/workspace/Workspace'
import WorkspacesList from 'features/workspaces-list/WorkspacesList'
import styles from './Sidebar.module.css'
import CategoryTabs from './CategoryTabs'
import SidebarHeader from './SidebarHeader'

type SidebarProps = {
  onMenuClick: () => void
}

function Sidebar({ onMenuClick }: SidebarProps) {
  const searchQuery = useSelector(selectSearchQuery)
  const locationType = useSelector(selectLocationType)
  const userLogged = useSelector(isUserLogged)
  const userAuthorized = useSelector(isUserAuthorized)
  const dispatch = useDispatch()

  const sidebarComponent = useMemo(() => {
    if (!userLogged) {
      return <Spinner />
    }
    // TODO remove once public release and permissions to use map in anonymous user
    if (!userAuthorized) {
      return (
        <div className={styles.placeholder}>
          <h2>We're sorry but your user is not authorized to use this app yet</h2>
          <Button
            onClick={async () => {
              dispatch(logoutUserThunk({ redirectToLogin: true }))
            }}
          >
            Logout
          </Button>
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
  }, [dispatch, locationType, userAuthorized, userLogged])

  if (searchQuery !== undefined) {
    return <Search />
  }
  return (
    <Suspense fallback={null}>
      <div className={styles.container}>
        <CategoryTabs onMenuClick={onMenuClick} />
        <div className="scrollContainer">
          <SidebarHeader />
          {userLogged ? sidebarComponent : <Spinner />}
        </div>
      </div>
    </Suspense>
  )
}

export default Sidebar
