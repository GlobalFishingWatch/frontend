import React from 'react'
import { useSelector } from 'react-redux'
import { IconButton } from '@globalfishingwatch/ui-components'
import { selectTemporalgridDataviews } from 'features/workspace/workspace.selectors'
import styles from 'features/sidebar/common/Sections.module.css'
import LayerPanel from './HeatmapLayerPanel'

function HeatmapsSection(): React.ReactElement {
  const dataviews = useSelector(selectTemporalgridDataviews)
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>FISHING</h2>
        <IconButton icon="plus" type="border" tooltip="Add layer" tooltipPlacement="top" />
      </div>
      {dataviews?.map((dataview) => (
        <LayerPanel key={dataview.configId} dataview={dataview} />
      ))}
    </div>
  )
}

export default HeatmapsSection
