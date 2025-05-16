import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { DataviewCategory } from '@globalfishingwatch/api-types'
import { formatDateForInterval } from '@globalfishingwatch/data-transforms'
import { CONFIG_BY_INTERVAL, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { Button, Icon, Spinner } from '@globalfishingwatch/ui-components'

import { getDatasetLabel } from 'features/datasets/datasets.utils'
import I18nNumber from 'features/i18n/i18nNumber'
import PortsReportLink from 'features/reports/report-port/PortsReportLink'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
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
  const isGFWUser = useSelector(selectIsGFWUser)
  const interval = getFourwingsInterval(feature.startTime, feature.endTime)

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
                {!feature.properties.cluster && feature.properties.htime && interval && (
                  <span className={styles.rowTextSecondary}>
                    {' '}
                    {formatDateForInterval(
                      CONFIG_BY_INTERVAL['HOUR'].getIntervalTimestamp(feature.properties.htime),
                      interval
                    )}
                    {interval === 'HOUR' && ' UTC'}
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
            {isGFWUser && event?.port && !isPortReportLocation && (
              <PortsReportLink port={event.port}>
                <Button className={styles.portCTA}>
                  {t('portsReport.seePortReport', 'See all entry events to this port')}{' '}
                  {event.port.name && `(${event.port.name})`}
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
