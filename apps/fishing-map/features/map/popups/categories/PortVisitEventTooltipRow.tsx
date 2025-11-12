import { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DataviewCategory } from '@globalfishingwatch/api-types'
import { Button, Icon, Spinner } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import I18nDate from 'features/i18n/i18nDate'
import I18nNumber from 'features/i18n/i18nNumber'
import PortsReportLink from 'features/reports/report-port/PortsReportLink'
import { selectIsPortReportLocation } from 'routes/routes.selectors'

import type {
  ExtendedFeatureByVesselEvent,
  SliceExtendedClusterPickingObject,
} from '../../map.slice'

import VesselsTable from './VesselsTable'

import styles from '../Popup.module.css'

type PortVisitLayerProps = {
  feature: SliceExtendedClusterPickingObject<ExtendedFeatureByVesselEvent>
  showFeaturesDetails: boolean
  error?: string
  loading?: boolean
}

function PortVisitEventTooltipRow({
  feature,
  showFeaturesDetails,
  error,
  loading,
}: PortVisitLayerProps) {
  const { t } = useTranslation()
  const isPortReportLocation = useSelector(selectIsPortReportLocation)
  const { datasetId, event, color } = feature
  const title = getDatasetLabel({ id: datasetId! })

  const seePortReportClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.GlobalReports,
      action: `Clicked see port report`,
    })
  }, [])

  return (
    <div className={styles.popupSection}>
      <Icon icon="clusters" className={styles.layerIcon} style={{ color }} />
      <div className={styles.popupSectionContent}>
        {showFeaturesDetails ? (
          <h3 className={styles.popupSectionTitle}>{title}</h3>
        ) : (
          feature.count && (
            <div className={styles.row}>
              <span className={styles.rowText}>
                <I18nNumber number={feature.count} />{' '}
                {t('event.port_visit', { count: feature.count })}
                {!feature.properties.cluster && feature.properties.stime && (
                  <span className={styles.rowTextSecondary}>
                    {' '}
                    <I18nDate date={feature.properties.stime * 1000} />
                  </span>
                )}
              </span>
            </div>
          )
        )}
        {error && <p className={styles.error}>{error}</p>}
        {loading ? (
          <Spinner inline size="small" />
        ) : (
          <Fragment>
            {showFeaturesDetails && (
              <VesselsTable
                feature={
                  {
                    vessels: event?.vessels,
                    category: DataviewCategory.Events,
                  } as any
                }
                vesselProperty="events"
              />
            )}
            {event?.port?.id && !isPortReportLocation && (
              <PortsReportLink port={event.port}>
                <Button
                  className={cx(styles.portCTA, styles.rowMarginTop)}
                  onClick={seePortReportClick}
                >
                  {t('portsReport.seePortReport')} {event.port.name && `(${event.port.name})`}
                </Button>
              </PortsReportLink>
            )}
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default PortVisitEventTooltipRow
