import React from 'react'
import { useSelector } from 'react-redux'
import { IconButton } from '@globalfishingwatch/ui-components'
import { selectFishingDataviews } from 'features/workspace/workspace.selectors'
import LayerPanel from '../layer-panel/LayerPanel'
import styles from './HeatmapsSection.module.css'

function HeatmapsSection(): React.ReactElement {
  const dataviews = useSelector(selectFishingDataviews)
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>FISHING</h2>
        <IconButton icon="plus" type="border" tooltip="Add layer" tooltipPlacement="top" />
      </div>
      {dataviews?.map((dataview) => (
        <LayerPanel key={dataview.id} dataview={dataview} />
      ))}
    </div>
  )
}

export default HeatmapsSection
