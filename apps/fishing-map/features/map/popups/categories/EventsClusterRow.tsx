import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import type { Dataset } from '@globalfishingwatch/api-types'
import { DatasetTypes, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import { getDatasetSource } from '@globalfishingwatch/datasets-client'
import { Icon, Spinner } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import I18nDate from 'features/i18n/i18nDate'
import I18nNumber from 'features/i18n/i18nNumber'
import VesselLink from 'features/vessel/VesselLink'
import VesselPin from 'features/vessel/VesselPin'
import { getEventLabel } from 'utils/analytics'
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
  const source = getDatasetSource(infoDataset?.id)
  const timestamp = feature.properties.stime
    ? feature.properties.stime * 1000
    : event?.start
      ? getUTCDateTime(event?.start as string).toMillis()
      : undefined

  const seeEventClick = useCallback((dataset: Dataset) => {
    trackEvent({
      category: TrackCategory.VesselProfile,
      action: `Clicked see loitering event`,
      label: getEventLabel(
        [` dataset_name: ${dataset.name} `, ` source: ${dataset.source} `, dataset.id].filter(
          Boolean
        ) as string[]
      ),
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
                {t((t) => t.event.loitering, {
                  count: feature.count,
                })}
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
                    onClick={() => seeEventClick(event.dataset)}
                  >
                    {formatInfoField(event.vessel.name, 'shipname')}
                  </VesselLink>
                  ({formatInfoField(event.vessel.flag, 'flag')}){' '}
                  <span className={styles.secondary} style={{ display: 'inline' }}>
                    {getEventDescription(event, { source })?.description}
                  </span>
                </div>
              ) : (
                t((t) => t.event.noData)
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default ClusterEventTooltipRow
