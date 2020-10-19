import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { IconButton } from '@globalfishingwatch/ui-components'
import { selectContextAreasDataviews } from 'features/workspace/workspace.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import styles from 'features/sidebar/common/Sections.module.css'
import LayerPanel from './ContextAreaLayerPanel'

function VesselsSection(): React.ReactElement {
  const { removeDataviewInstance } = useDataviewInstancesConnect()
  const dataviews = useSelector(selectContextAreasDataviews)
  const onAddClick = useCallback(() => {
    removeDataviewInstance('context-layer-1')
  }, [removeDataviewInstance])
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>CONTEXT AREAS</h2>
        <IconButton
          icon="plus"
          type="border"
          disabled={dataviews && dataviews.length > 0}
          tooltip="Add layer"
          tooltipPlacement="top"
          onClick={onAddClick}
        />
      </div>
      {dataviews?.map((dataview) => (
        <LayerPanel key={dataview.id} dataview={dataview} />
      ))}
    </div>
  )
}

export default VesselsSection
