import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { selectEnvironmentalDataviews } from 'features/workspace/workspace.selectors'
import styles from 'features/workspace/Sections.module.css'
import LayerPanel from './EnvironmentalLayerPanel'

function ContextAreaSection(): React.ReactElement | null {
  const { t } = useTranslation()
  const dataviews = useSelector(selectEnvironmentalDataviews)
  if (!dataviews?.length) {
    return null
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{t('common.environment', 'Environment')}</h2>
      </div>
      {dataviews?.map((dataview) => (
        <LayerPanel key={dataview.id} dataview={dataview} />
      ))}
    </div>
  )
}

export default ContextAreaSection
