import React from 'react'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Logo from '@globalfishingwatch/ui-components/dist/logo'
import styles from './SidebarHeader.module.css'

function SidebarHeader(): React.ReactElement {
  return (
    <header className={styles.container}>
      <IconButton icon="menu" />
      <Logo subBrand="Marine Reserves" />
      <div className={styles.righSide}>
        <IconButton icon="share" />
      </div>
    </header>
  )
}

export default SidebarHeader
