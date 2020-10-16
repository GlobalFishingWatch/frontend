import React, { useCallback, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { IconButton, Logo } from '@globalfishingwatch/ui-components'
import { selectUserData, logoutUserThunk } from 'features/user/user.slice'
import { selectWorkspaceStatus } from 'features/workspace/workspace.slice'
import Search from 'features/search/Search'
import { selectSearchQuery } from 'routes/routes.selectors'
import styles from './Sidebar.module.css'
import HeatmapsSection from './heatmaps/HeatmapsSection'
import VesselsSection from './vessels/VesselsSection'

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

function Sidebar({ onMenuClick }: SidebarProps) {
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const searchQuery = useSelector(selectSearchQuery)

  if (searchQuery !== undefined) {
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
        <Fragment>
          <HeatmapsSection />
          <VesselsSection />
        </Fragment>
      )}
    </Fragment>
  )
}

export default Sidebar
