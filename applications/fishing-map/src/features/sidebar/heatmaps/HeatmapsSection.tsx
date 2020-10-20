import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { IconButton } from '@globalfishingwatch/ui-components'
import { selectTemporalgridDataviews } from 'features/workspace/workspace.selectors'
import styles from 'features/sidebar/common/Sections.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import LayerPanel from './HeatmapLayerPanel'

function HeatmapsSection(): React.ReactElement {
  const dataviews = useSelector(selectTemporalgridDataviews)
  const { removeDataviewInstance } = useDataviewInstancesConnect()
  const onAddClick = useCallback(() => {
    removeDataviewInstance('fishing-1')
  }, [removeDataviewInstance])
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>FISHING</h2>
        <IconButton
          icon="plus"
          type="border"
          tooltip="Add layer"
          tooltipPlacement="top"
          onClick={onAddClick}
          disabled={dataviews && dataviews.length > 0}
        />
      </div>
      {dataviews?.map((dataview) => (
        <LayerPanel key={dataview.id} dataview={dataview} />
      ))}
    </div>
  )
}

export default HeatmapsSection
