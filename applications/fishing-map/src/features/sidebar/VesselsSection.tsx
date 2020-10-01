import React, { useCallback } from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import { SEARCH } from 'routes/routes'
import styles from './VesselsSection.module.css'

function VesselsSection(): React.ReactElement {
  const { dispatchLocation } = useLocationConnect()
  const onSearchClick = useCallback(() => {
    dispatchLocation(SEARCH)
  }, [dispatchLocation])
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>VESSELS</h2>
        <IconButton
          icon="search"
          type="border"
          tooltip="Search vessels"
          tooltipPlacement="top"
          onClick={onSearchClick}
        />
      </div>
    </div>
  )
}

export default VesselsSection
