import React from 'react'
import { IconButton, Logo } from '@globalfishingwatch/ui-components'
import styles from './Sidebar.module.css'
import HeatmapsSection from './HeatmapsSection'

function Sidebar(): React.ReactElement {
  return (
    <div className={styles.aside}>
      <div className={styles.sidebarHeader}>
        <IconButton icon="menu" />
        <Logo />
        <IconButton icon="share" />
      </div>

      <HeatmapsSection />
    </div>
  )
}

export default Sidebar
