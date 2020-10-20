import React from 'react'
import { useSelector } from 'react-redux'
import { selectContextAreasDataviews } from 'features/workspace/workspace.selectors'
import styles from 'features/sidebar/common/Sections.module.css'
import LayerPanel from './ContextAreaLayerPanel'

function ContextAreaSection(): React.ReactElement {
  const dataviews = useSelector(selectContextAreasDataviews)
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>CONTEXT AREAS</h2>
      </div>
      {dataviews?.map((dataview) => (
        <LayerPanel key={dataview.id} dataview={dataview} />
      ))}
    </div>
  )
}

export default ContextAreaSection
