import { useTranslation } from 'react-i18next'

import { DatasetTypes, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import { Icon, Spinner } from '@globalfishingwatch/ui-components'

import { getDatasetLabel } from 'features/datasets/datasets.utils'
import I18nDate from 'features/i18n/i18nDate'
import I18nNumber from 'features/i18n/i18nNumber'
import VesselLink from 'features/vessel/VesselLink'
import VesselPin from 'features/vessel/VesselPin'
import { getEventDescription } from 'utils/events'
import { formatInfoField } from 'utils/info'

import type { ExtendedFeatureSingleEvent, SliceExtendedClusterPickingObject } from '../../map.slice'

import styles from '../Popup.module.css'

type ClusterEventTooltipRowProps = {
  feature: SliceExtendedClusterPickingObject<ExtendedFeatureSingleEvent>
  showFeaturesDetails: boolean
  error?: string
  loading?: boolean
}

function ClusterEventTooltipRow({
  feature,
  showFeaturesDetails,
  loading,
}: ClusterEventTooltipRowProps) {
  const { t } = useTranslation()
  const { datasetId, event, color } = feature
  const title = getDatasetLabel({ id: datasetId! })
  const infoDataset = event?.dataset.relatedDatasets?.find((d) => d.type === DatasetTypes.Vessels)
  const timestamp = feature.properties.stime
    ? feature.properties.stime * 1000
    : event?.start
      ? getUTCDateTime(event?.start as string).toMillis()
      : undefined

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
                {t('event.loitering', { count: feature.count })}
                {timestamp && (
                  <span className={styles.rowTextSecondary}>
                    {' '}
                    <I18nDate date={timestamp} />
                  </span>
                )}
              </span>
            </div>
          )
        )}

        {loading ? (
          <Spinner className={styles.eventSpinner} inline size="small" />
        ) : (
          showFeaturesDetails && (
            <div className={styles.row}>
              {event?.vessel ? (
                <div className={styles.rowText}>
                  <VesselPin
                    vesselToResolve={{ ...event.vessel, datasetId: infoDataset?.id as string }}
                    size="small"
                    className={styles.inlineBtn}
                  />
                  <VesselLink
                    vesselId={event.vessel.id}
                    datasetId={infoDataset?.id}
                    query={{
                      vesselIdentitySource: VesselIdentitySourceEnum.SelfReported,
                      vesselSelfReportedId: event.vessel.id,
                    }}
                    className={styles.marginRight}
                  >
                    {formatInfoField(event.vessel.name, 'shipname')}
                  </VesselLink>
                  ({formatInfoField(event.vessel.flag, 'flag')}){' '}
                  <span className={styles.secondary} style={{ display: 'inline' }}>
                    {getEventDescription(event)?.description}
                  </span>
                </div>
              ) : (
                t('event.noData', 'No data available')
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default ClusterEventTooltipRow
