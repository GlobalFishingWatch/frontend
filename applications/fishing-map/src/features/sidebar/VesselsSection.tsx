import React from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import styles from './VesselsSection.module.css'

function VesselsSection(): React.ReactElement {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>VESSELS</h2>
        <IconButton icon="search" type="border" tooltip="Search vessels" tooltipPlacement="top" />
      </div>
    </div>
  )
}

export default VesselsSection
