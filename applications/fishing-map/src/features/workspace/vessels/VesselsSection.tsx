import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import { selectVesselsDataviews } from 'features/dataviews/dataviews.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import { isBasicSearchAllowed } from 'features/search/search.selectors'
import VesselLayerPanel from './VesselLayerPanel'

function VesselsSection(): React.ReactElement {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const dataviews = useSelector(selectVesselsDataviews)
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)
  const searchAllowed = useSelector(isBasicSearchAllowed)

  const onSearchClick = useCallback(() => {
    dispatchQueryParams({ query: '' })
  }, [dispatchQueryParams])

  return (
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{t('common.vessel_plural', 'Vessels')}</h2>
        <IconButton
          icon="search"
          type="border"
          size="medium"
          disabled={!searchAllowed}
          tooltip={
            searchAllowed
              ? t('search.vessels', 'Search vessels')
              : t('search.notAllowed', 'Search not allowed')
          }
          tooltipPlacement="top"
          className="print-hidden"
          onClick={onSearchClick}
        />
      </div>
      {dataviews?.map((dataview) => (
        <VesselLayerPanel key={dataview.id} dataview={dataview} />
      ))}
    </div>
  )
}

export default VesselsSection
