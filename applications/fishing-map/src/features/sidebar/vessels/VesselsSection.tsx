import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import { selectVesselsDataviews } from 'features/workspace/workspace.selectors'
import styles from 'features/sidebar/Sections.module.css'
import LayerPanel from './VesselLayerPanel'

function VesselsSection(): React.ReactElement {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const dataviews = useSelector(selectVesselsDataviews)
  const onSearchClick = useCallback(() => {
    dispatchQueryParams({ query: '' })
  }, [dispatchQueryParams])
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{t('common.vessel_plural', 'Vessels')}</h2>
        <IconButton
          icon="search"
          type="border"
          size="medium"
          tooltip={t('vessel.search.search', 'Search vessels')}
          tooltipPlacement="top"
          onClick={onSearchClick}
        />
      </div>
      {dataviews?.map((dataview) => (
        <LayerPanel key={dataview.id} dataview={dataview} />
      ))}
    </div>
  )
}

export default VesselsSection
