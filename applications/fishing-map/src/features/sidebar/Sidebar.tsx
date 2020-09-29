import React from 'react'
import { IconButton, Logo } from '@globalfishingwatch/ui-components'
import styles from './Sidebar.module.css'
import HeatmapsSection from './HeatmapsSection'
import VesselsSection from './VesselsSection'

function Sidebar(): React.ReactElement {
  return (
    <div className={styles.aside}>
      <div className={styles.sidebarHeader}>
        <IconButton icon="menu" />
        <Logo className={styles.logo} />
        <IconButton icon="share" tooltip="Click to share this view" tooltipPlacement="bottom" />
        <IconButton icon="user" />
      </div>
      <HeatmapsSection />
      <VesselsSection />
    </div>
  )
}

export default Sidebar
