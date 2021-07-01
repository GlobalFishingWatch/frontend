import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { uniqBy } from 'lodash'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { EVENTS_COLORS } from 'data/config'
import { useLocationConnect } from 'routes/routes.hook'
import { selectVesselsDataviews } from 'features/dataviews/dataviews.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import { isBasicSearchAllowed } from 'features/search/search.selectors'
import { getEventsDatasetsInDataview } from 'features/datasets/datasets.utils'
import VesselLayerPanel from './VesselLayerPanel'
import layerStyles from './VesselSection.module.css'

function VesselsSection(): React.ReactElement {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const dataviews = useSelector(selectVesselsDataviews)
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)
  const searchAllowed = useSelector(isBasicSearchAllowed)
  const eventDatasets = uniqBy(
    dataviews.flatMap((dataview) => getEventsDatasetsInDataview(dataview)),
    'id'
  )
  const showLegend =
    eventDatasets && eventDatasets?.length > 0 && dataviews.some((d) => d.config?.visible)

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
      {showLegend && (
        <div className={styles.content}>
          <ul className={layerStyles.eventsLegendContainer}>
            {eventDatasets.map((dataset) => {
              const eventType = dataset.configuration?.type
              if (!eventType) return null
              return (
                <li className={layerStyles.eventsLegend}>
                  <span
                    className={layerStyles.eventLegendIcon}
                    style={{ backgroundColor: EVENTS_COLORS[eventType] }}
                  ></span>
                  <span className={layerStyles.eventLegendLabel}>
                    {t(`event.${eventType}` as any, eventType)}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default VesselsSection
