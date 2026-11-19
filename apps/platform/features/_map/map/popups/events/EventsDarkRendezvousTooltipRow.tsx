import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'

import type { SelfReportedInfo } from '@globalfishingwatch/api-types'
import { DatasetSubCategory, DatasetTypes } from '@globalfishingwatch/api-types'
import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import { getRelatedDatasetByType } from '@globalfishingwatch/datasets-client'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { Spinner } from '@globalfishingwatch/ui-components'

import { selectDatasetById } from 'features/_map/datasets/datasets.slice'
import I18nDate from 'features/i18n/i18nDate'
import I18nNumber from 'features/i18n/i18nNumber'

import type {
  ExtendedFeatureSingleEvent,
  ExtendedFeatureVessel,
  SliceExtendedClusterPickingObject,
} from '../../map.slice'
import { getIntervalDateFormat } from '../map-popups.utils'
import PopupSectionLayout from '../shared/PopupSectionLayout'
import VesselsTable from '../shared/VesselsTable'

import styles from '../Popup.module.css'

type EventsDarkRendezvousTooltipRowProps = {
  feature: SliceExtendedClusterPickingObject<ExtendedFeatureSingleEvent>
  showFeaturesDetails: boolean
  error?: string
  loading?: boolean
}

function EventsDarkRendezvousTooltipRow({
  feature,
  showFeaturesDetails,
  error,
  loading,
}: EventsDarkRendezvousTooltipRowProps) {
  const { t } = useTranslation()
  const event = feature.event
  // Datasets VesselsTable needs to show the pin for vessels matched with GFW records
  const infoDataset = useSelector(
    selectDatasetById(getRelatedDatasetByType(event?.dataset, DatasetTypes.Vessels)?.id as string)
  )
  const trackDataset = useSelector(
    selectDatasetById(
      getRelatedDatasetByType(infoDataset, DatasetTypes.Tracks, { fullDatasetAllowed: true })
        ?.id as string
    )
  )
  const interval = getFourwingsInterval(feature.startTime, feature.endTime)
  const timestampStart = event?.start
    ? getUTCDateTime(event.start as string).toMillis()
    : feature.properties.stime
      ? feature.properties.stime * 1000
      : undefined
  const timestampEnd = event?.end ? getUTCDateTime(event.end as string).toMillis() : undefined
  // Skylight vessels usually have no GFW vessel id, so VesselsTable renders the
  // search + Skylight links, same as skylight detections
  const vessels: ExtendedFeatureVessel[] = (event?.dark_rendezvous?.vessels || []).map(
    (vessel) =>
      ({
        id: vessel.id || '',
        shipname: vessel.name,
        flag: vessel.flag,
        skylight_id: vessel.skylightId,
        ...(vessel.id && infoDataset && { dataset: infoDataset, infoDataset, trackDataset }),
        selfReportedInfo: [
          {
            id: vessel.id,
            shipname: vessel.name,
            flag: vessel.flag,
            shiptypes: [vessel.type],
          } as SelfReportedInfo,
        ],
      }) as ExtendedFeatureVessel
  )

  return (
    <PopupSectionLayout
      icon="encounters"
      iconColor={feature.color}
      title={showFeaturesDetails ? feature.title : undefined}
    >
      {!showFeaturesDetails && feature.count && (
        <div className={styles.row}>
          <span className={styles.rowText}>
            <I18nNumber number={feature.count} />{' '}
            {t((t) => t.event.darkRendezvous, { count: feature.count })}
            {!feature.properties.cluster && timestampStart && interval && (
              <span className={styles.rowTextSecondary}>
                {' '}
                <I18nDate date={timestampStart} format={getIntervalDateFormat(interval)} />
              </span>
            )}
          </span>
        </div>
      )}
      {showFeaturesDetails && (
        <div className={styles.row}>
          <div className={styles.rowContainer}>
            {timestampStart && (
              <span className={styles.rowText}>
                <I18nDate date={timestampStart} format={DateTime.DATETIME_SHORT} />{' '}
                {timestampEnd && (
                  <>
                    {t((t) => t.common.to)}{' '}
                    <I18nDate date={timestampEnd} format={DateTime.DATETIME_SHORT} />
                  </>
                )}
              </span>
            )}
            {loading ? (
              <Spinner className={styles.loading} size="small" />
            ) : vessels.length ? (
              <VesselsTable
                feature={
                  {
                    vessels,
                    category: feature.category,
                  } as ComponentProps<typeof VesselsTable>['feature']
                }
                activityType={DatasetSubCategory.Presence}
                showValue={false}
              />
            ) : error ? (
              <p className={styles.error}>{error}</p>
            ) : (
              t((t) => t.event.noData)
            )}
          </div>
        </div>
      )}
    </PopupSectionLayout>
  )
}

export default EventsDarkRendezvousTooltipRow
