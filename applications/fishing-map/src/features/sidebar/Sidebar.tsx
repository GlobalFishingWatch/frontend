import React, { useCallback, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { IconButton, Logo } from '@globalfishingwatch/ui-components'
import { selectUserData, logoutUserThunk } from 'features/user/user.slice'
import { selectWorkspaceStatus } from 'features/workspace/workspace.slice'
import { useLocationConnect } from 'routes/routes.hook'
import { SEARCH } from 'routes/routes'
import Search from 'features/search/Search'
import styles from './Sidebar.module.css'
import HeatmapsSection from './HeatmapsSection'
import VesselsSection from './VesselsSection'

type SidebarProps = {
  onMenuClick: () => void
}

function SidebarHeader({ onMenuClick }: SidebarProps) {
  const dispatch = useDispatch()
  const userData = useSelector(selectUserData)
  const initials = `${userData?.firstName?.slice(0, 1)}${userData?.lastName?.slice(0, 1)}`
  const onLogoutClick = useCallback(() => {
    dispatch(logoutUserThunk())
  }, [dispatch])

  return (
    <div className={styles.sidebarHeader}>
      <IconButton icon="menu" onClick={onMenuClick} />
      <Logo className={styles.logo} />
      <IconButton icon="share" tooltip="Click to share this view" tooltipPlacement="bottom" />
      {userData ? (
        <IconButton
          tooltip={
            <span>
              {`${userData.firstName} ${userData.lastName}`}
              <br />
              {userData.email}
              <br />
              Click to logout
            </span>
          }
          tooltipPlacement="bottom"
          className={styles.userBtn}
          onClick={onLogoutClick}
          icon="logout"
        >
          {initials}
        </IconButton>
      ) : (
        <IconButton icon="user" tooltip="Login" tooltipPlacement="bottom" />
      )}
    </div>
  )
}

function Sections() {
  return (
    <Fragment>
      <HeatmapsSection />
      <VesselsSection />
    </Fragment>
  )
}

function Sidebar({ onMenuClick }: SidebarProps) {
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const { location } = useLocationConnect()

  if (location.type === SEARCH) {
    return <Search />
  }

  return (
    <Fragment>
      <SidebarHeader onMenuClick={onMenuClick} />
      {workspaceStatus === 'error' ? (
        <div className={styles.placeholder}>
          There was an error loading the workspace, please try again later
        </div>
      ) : (
        <Sections />
      )}
    </Fragment>
  )
}

export default Sidebar
