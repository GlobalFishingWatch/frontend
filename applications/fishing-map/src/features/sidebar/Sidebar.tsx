import React from 'react'
import { useSelector } from 'react-redux'
import { IconButton, Logo } from '@globalfishingwatch/ui-components'
import { selectUserData } from 'features/user/user.slice'
import styles from './Sidebar.module.css'
import HeatmapsSection from './HeatmapsSection'
import VesselsSection from './VesselsSection'

function Sidebar(): React.ReactElement {
  const userData = useSelector(selectUserData)
  const initials = `${userData?.firstName?.slice(0, 1)}${userData?.lastName?.slice(0, 1)}`
  return (
    <div className={styles.aside}>
      <div className={styles.sidebarHeader}>
        <IconButton icon="menu" />
        <Logo className={styles.logo} />
        <IconButton icon="share" tooltip="Click to share this view" tooltipPlacement="bottom" />
        {userData ? (
          <IconButton
            tooltip={
              <span>
                {`${userData.firstName} ${userData.lastName}`}
                <br />
                {userData.email}
              </span>
            }
            tooltipPlacement="bottom"
            className={styles.userBtn}
          >
            {initials}
          </IconButton>
        ) : (
          <IconButton icon="user" tooltip="Login" tooltipPlacement="bottom" />
        )}
      </div>
      <HeatmapsSection />
      <VesselsSection />
    </div>
  )
}

export default Sidebar
