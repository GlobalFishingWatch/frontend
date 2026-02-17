import { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'

import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { Button, Icon, Spinner } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import I18nDate from 'features/i18n/i18nDate'
import I18nNumber from 'features/i18n/i18nNumber'
import VesselLink from 'features/vessel/VesselLink'
import VesselPin from 'features/vessel/VesselPin'
import { formatInfoField } from 'utils/info'

import type { ExtendedFeatureSingleEvent, SliceExtendedClusterPickingObject } from '../../map.slice'

import styles from '../Popup.module.css'

type EventsGapTooltipRowProps = {
  feature: SliceExtendedClusterPickingObject<ExtendedFeatureSingleEvent>
  showFeaturesDetails: boolean
  error?: string
  loading?: boolean
}

function EventsGapTooltipRow({
  feature,
  showFeaturesDetails,
  error,
  loading,
}: EventsGapTooltipRowProps) {
  const { t } = useTranslation()

  const seeGapEventClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.GlobalReports,
      action: `Clicked see gap event`,
    })
  }, [])

  const event = feature.event || ({} as ExtendedFeatureSingleEvent)

  const interval = getFourwingsInterval(feature.startTime, feature.endTime)
  const title = feature.title || getDatasetLabel({ id: feature.datasetId! })
  const gapStart = feature.properties.stime
    ? feature.properties.stime * 1000
    : event?.start
      ? getUTCDateTime(event?.start as string).toMillis()
      : undefined
  const gapEnd = event?.end ? getUTCDateTime(event?.end as string).toMillis() : undefined

  return (
    <div className={styles.popupSection}>
      <Icon icon="encounters" className={styles.layerIcon} style={{ color: feature.color }} />
      <div className={styles.popupSectionContent}>
        {showFeaturesDetails ? (
          <h3 className={styles.popupSectionTitle}>{title}</h3>
        ) : (
          feature.count && (
            <div className={styles.row}>
              <span className={styles.rowText}>
                <I18nNumber number={feature.count} />{' '}
                {t((t) => t.event.gap, {
                  count: feature.count,
                })}
                {!feature.properties.cluster && gapStart && interval && (
                  <span className={styles.rowTextSecondary}>
                    {' '}
                    <I18nDate date={gapStart} />
                    {gapEnd && (
                      <Fragment>
                        - <I18nDate date={gapEnd} />
                      </Fragment>
                    )}
                  </span>
                )}
              </span>
            </div>
          )
        )}
        {showFeaturesDetails && (
          <div className={styles.row}>
            <div className={styles.rowContainer}>
              {gapStart && (
                <span className={styles.rowText}>
                  <I18nDate date={gapStart} format={DateTime.DATETIME_MED} />
                  {gapEnd && (
                    <Fragment>
                      {' - '}
                      <I18nDate date={gapEnd} format={DateTime.DATETIME_MED} />
                    </Fragment>
                  )}
                </span>
              )}
              {loading ? (
                <Spinner className={styles.eventSpinner} inline size="small" />
              ) : (
                <Fragment>
                  {event ? (
                    <Fragment>
                      <div className={styles.flex}>
                        {event.vessel && (
                          <div className={styles.rowColum}>
                            {event.vessel.type && (
                              <p className={styles.rowTitle}>
                                {t((t) => t.vessel.vesselTypes[event.vessel.type], {
                                  defaultValue: event.vessel.type,
                                })}
                              </p>
                            )}
                            {event.vessel && (
                              <div className={styles.centered}>
                                <span className={styles.rowText}>
                                  <VesselLink
                                    vesselId={event.vessel.id}
                                    datasetId={event.vessel.dataset}
                                    query={{
                                      vesselIdentitySource: VesselIdentitySourceEnum.SelfReported,
                                      vesselSelfReportedId: event.vessel.id,
                                    }}
                                  >
                                    {formatInfoField(event.vessel?.name, 'shipname')}
                                  </VesselLink>
                                </span>
                                {event.vessel.dataset && (
                                  <VesselPin
                                    vesselToResolve={{
                                      ...event.vessel,
                                      datasetId: event.vessel.dataset,
                                    }}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {event.vessel && (
                        <div className={styles.row}>
                          <VesselLink
                            vesselId={event.vessel.id}
                            datasetId={event.vessel.dataset}
                            query={{
                              vesselIdentitySource: VesselIdentitySourceEnum.SelfReported,
                              vesselSelfReportedId: event.vessel.id,
                            }}
                            eventId={event.id ? event.id.split('.')[0] : undefined}
                            eventType={'encounter'}
                            showTooltip={false}
                            className={styles.btnLarge}
                          >
                            <Button
                              target="_blank"
                              size="small"
                              className={styles.btnLarge}
                              onClick={seeGapEventClick}
                            >
                              {t((t) => t.common.seeMore)}
                            </Button>
                          </VesselLink>
                        </div>
                      )}
                    </Fragment>
                  ) : error ? (
                    <p className={styles.error}>{error}</p>
                  ) : (
                    t((t) => t.event.noData)
                  )}
                </Fragment>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventsGapTooltipRow
