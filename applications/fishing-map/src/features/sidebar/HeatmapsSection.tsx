import React from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import LayerPanel from './LayerPanel'
import styles from './HeatmapsSection.module.css'

function HeatmapsSection(): React.ReactElement {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.heatmapSelector}>FISHING</div>
        <IconButton icon="plus" type="border" />
      </div>
      <LayerPanel />
      <LayerPanel />
      <LayerPanel />
      <LayerPanel />
    </div>
  )
}

export default HeatmapsSection
