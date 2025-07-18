import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { Button, Icon, Spinner } from '@globalfishingwatch/ui-components'

import { getDatasetLabel } from 'features/datasets/datasets.utils'
import I18nDate from 'features/i18n/i18nDate'
import I18nNumber from 'features/i18n/i18nNumber'
import VesselLink from 'features/vessel/VesselLink'
import VesselPin from 'features/vessel/VesselPin'
import { formatInfoField } from 'utils/info'

import type {
  ExtendedEventVessel,
  ExtendedFeatureSingleEvent,
  SliceExtendedClusterPickingObject,
} from '../../map.slice'

import styles from '../Popup.module.css'

const parseEncounterEvent = (
  event: ExtendedFeatureSingleEvent | undefined
): ExtendedFeatureSingleEvent | undefined => {
  if (!event) return event
  return {
    ...event,
    vessel: event.vessel,
    ...(event.encounter && {
      encounter: {
        ...event.encounter,
        vessel: event.encounter?.vessel,
      },
    }),
  }
}

type EncounterTooltipRowProps = {
  feature: SliceExtendedClusterPickingObject<ExtendedFeatureSingleEvent>
  showFeaturesDetails: boolean
  error?: string
  loading?: boolean
}

function EncounterTooltipRow({
  feature,
  showFeaturesDetails,
  error,
  loading,
}: EncounterTooltipRowProps) {
  const { t } = useTranslation()

  const event = parseEncounterEvent(feature.event)
  const interval = getFourwingsInterval(feature.startTime, feature.endTime)
  const title = feature.title || getDatasetLabel({ id: feature.datasetId! })
  const timestamp = feature.properties.stime
    ? feature.properties.stime * 1000
    : event?.start
      ? getUTCDateTime(event?.start as string).toMillis()
      : undefined

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
                {t('event.encounter', { count: feature.count })}
                {!feature.properties.cluster && timestamp && interval && (
                  <span className={styles.rowTextSecondary}>
                    {' '}
                    <I18nDate date={timestamp} />
                  </span>
                )}
              </span>
            </div>
          )
        )}
        {showFeaturesDetails && (
          <div className={styles.row}>
            <div className={styles.rowContainer}>
              {timestamp && <span className={styles.rowText}>{<I18nDate date={timestamp} />}</span>}
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
                                {t(`vessel.vesselTypes.${event.vessel.type}`, event.vessel.type)}
                              </p>
                            )}
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
                              {(event.vessel as ExtendedEventVessel).dataset && (
                                <VesselPin
                                  vesselToResolve={{
                                    ...event.vessel,
                                    datasetId: event.vessel.dataset,
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        )}
                        {event.encounter?.vessel && (
                          <div className={styles.row}>
                            <div className={styles.rowColum}>
                              <span className={styles.rowTitle}>
                                {t(
                                  `vessel.vesselTypes.${event.encounter.vessel.type}`,
                                  event.encounter.vessel.type
                                )}
                              </span>
                              <div className={styles.centered}>
                                <span className={styles.rowText}>
                                  <VesselLink
                                    vesselId={event.encounter.vessel?.id}
                                    datasetId={event.encounter.vessel?.dataset}
                                    query={{
                                      vesselIdentitySource: VesselIdentitySourceEnum.SelfReported,
                                      vesselSelfReportedId: event.encounter.vessel?.id,
                                    }}
                                  >
                                    {formatInfoField(event.encounter.vessel?.name, 'shipname')}
                                  </VesselLink>
                                </span>
                                {(event.encounter?.vessel as ExtendedEventVessel).dataset && (
                                  <VesselPin
                                    vesselToResolve={{
                                      ...event.encounter.vessel,
                                      datasetId: event.encounter.vessel.dataset,
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
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
                          <Button target="_blank" size="small" className={styles.btnLarge}>
                            {t('common.seeMore')}
                          </Button>
                        </VesselLink>
                      </div>
                    </Fragment>
                  ) : error ? (
                    <p className={styles.error}>{error}</p>
                  ) : (
                    t('event.noData')
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

export default EncounterTooltipRow
