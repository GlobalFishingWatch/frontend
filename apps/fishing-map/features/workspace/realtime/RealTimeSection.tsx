import React from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { selectRealTimeDataviews } from 'features/dataviews/dataviews.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import RealTimeLayerPanel from '../realtime/RealTimeLayerPanel'
import LayerPanelContainer from '../shared/LayerPanelContainer'

function RealTimeSection(): React.ReactElement | null {
  const { t } = useTranslation()
  const dataviews = useSelector(selectRealTimeDataviews)
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)

  if (!dataviews || dataviews.length === 0) {
    return null
  }
  return (
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{t('common.realtime', 'Real time')}</h2>
      </div>
      {dataviews?.map((dataview) => (
        <LayerPanelContainer key={dataview.id} dataview={dataview}>
          <RealTimeLayerPanel dataview={dataview} />
        </LayerPanelContainer>
      ))}
    </div>
  )
}

export default RealTimeSection
