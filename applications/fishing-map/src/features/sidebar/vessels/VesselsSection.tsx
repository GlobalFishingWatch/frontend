import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { IconButton } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import { SEARCH } from 'routes/routes'
import { selectVesselsDataviews } from 'features/workspace/workspace.selectors'
import styles from 'features/sidebar/common/Sections.module.css'
import LayerPanel from './VesselLayerPanel'

function VesselsSection(): React.ReactElement {
  const { dispatchLocation } = useLocationConnect()
  const dataviews = useSelector(selectVesselsDataviews)
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
      {dataviews?.map((dataview) => (
        <LayerPanel key={dataview.uid} dataview={dataview} />
      ))}
    </div>
  )
}

export default VesselsSection
