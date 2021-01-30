import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { selectContextAreasDataviews } from 'features/workspace/workspace.selectors'
import styles from 'features/workspace/Sections.module.css'
import LayerPanel from './ContextAreaLayerPanel'

function ContextAreaSection(): React.ReactElement {
  const { t } = useTranslation()
  const dataviews = useSelector(selectContextAreasDataviews)
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{t('common.context_area_plural', 'Context areas')}</h2>
      </div>
      {dataviews?.map((dataview) => (
        <LayerPanel key={dataview.id} dataview={dataview} />
      ))}
    </div>
  )
}

export default ContextAreaSection
