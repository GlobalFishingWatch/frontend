import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import { selectVesselsDataviews } from 'features/dataviews/dataviews.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import { isBasicSearchAllowed } from 'features/search/search.selectors'
import VesselEventsLegend from './VesselEventsLegend'
import VesselLayerPanel from './VesselLayerPanel'

function VesselsSection(): React.ReactElement {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const dataviews = useSelector(selectVesselsDataviews)
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)
  const searchAllowed = useSelector(isBasicSearchAllowed)

  const onSearchClick = useCallback(() => {
    uaEvent({
      category: 'Search Vessel',
      action: 'Click search icon to open search panel',
    })
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
      <VesselEventsLegend dataviews={dataviews} />
    </div>
  )
}

export default VesselsSection
