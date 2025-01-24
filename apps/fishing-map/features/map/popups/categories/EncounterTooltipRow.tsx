import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { stringify } from 'qs'

import { Button, Icon } from '@globalfishingwatch/ui-components'

import { CARRIER_PORTAL_URL } from 'data/config'
import { useCarrierLatestConnect } from 'features/datasets/datasets.hook'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import I18nDate from 'features/i18n/i18nDate'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import VesselLink from 'features/vessel/VesselLink'
import VesselPin from 'features/vessel/VesselPin'
import { AsyncReducerStatus } from 'utils/async-slice'
import { formatInfoField } from 'utils/info'

import type {
  ExtendedEventVessel,
  ExtendedFeatureSingleEvent,
  SliceExtendedClusterPickingObject,
} from '../../map.slice'
import { useMapViewState } from '../../map-viewport.hooks'

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
}

function EncounterTooltipRow({ feature, showFeaturesDetails, error }: EncounterTooltipRowProps) {
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const viewState = useMapViewState()
  const { carrierLatest, carrierLatestStatus, dispatchFetchLatestCarrier } =
    useCarrierLatestConnect()

  useEffect(() => {
    if (!carrierLatest) {
      dispatchFetchLatestCarrier()
    }
  }, [carrierLatest, dispatchFetchLatestCarrier])

  const event = parseEncounterEvent(feature.event)
  const linkParams = {
    ...viewState,
    dataset: carrierLatest?.id,
    ...(event && {
      vessel: event.vessel.id,
      timestamp: new Date(event.start).getTime(),
    }),
    start,
    end,
  }
  const isEventInDatasetRange =
    event !== undefined &&
    carrierLatest?.endDate !== undefined &&
    carrierLatest?.startDate !== undefined &&
    event.start >= carrierLatest.startDate &&
    event.end <= carrierLatest.endDate

  const urlLink = `${CARRIER_PORTAL_URL}/?${stringify(linkParams)}`
  let linkTooltip = ''
  if (carrierLatestStatus === AsyncReducerStatus.Error) {
    linkTooltip = t('errors.latestCarrierNotFound', 'Latest carrier dataset not found')
  }
  if (carrierLatestStatus === AsyncReducerStatus.Finished && !isEventInDatasetRange) {
    linkTooltip = t(
      'event.notInCVP',
      'This event happened outside the timerange of the Carrier Vessel Portal data'
    )
  }
  const title = getDatasetLabel({ id: feature.datasetId! })

  return (
    <div className={styles.popupSection}>
      <Icon icon="encounters" className={styles.layerIcon} style={{ color: feature.color }} />
      <div className={styles.popupSectionContent}>
        {<h3 className={styles.popupSectionTitle}>{title}</h3>}
        {error && <p className={styles.error}>{error}</p>}
        {showFeaturesDetails && (
          <div className={styles.row}>
            {event ? (
              <div className={styles.rowContainer}>
                <span className={styles.rowText}>
                  <I18nDate date={event.start as string} />
                </span>
                <div className={styles.flex}>
                  {event.vessel && (
                    <div className={styles.rowColum}>
                      <p className={styles.rowTitle}>
                        {t(`vessel.vesselTypes.${event.vessel.type}`, event.vessel.type)}
                      </p>
                      <div className={styles.centered}>
                        <span className={styles.rowText}>
                          <VesselLink vesselId={event.vessel.id} datasetId={event.vessel.dataset}>
                            {formatInfoField(event.vessel?.name, 'shipname')}
                          </VesselLink>
                        </span>
                        {(event.vessel as ExtendedEventVessel).dataset && (
                          <VesselPin
                            vesselToResolve={{ ...event.vessel, datasetId: event.vessel.dataset }}
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
                  <Button
                    href={urlLink}
                    target="_blank"
                    size="small"
                    className={styles.btnLarge}
                    disabled={
                      carrierLatestStatus === AsyncReducerStatus.Loading || !isEventInDatasetRange
                    }
                    tooltip={linkTooltip}
                    loading={carrierLatestStatus === AsyncReducerStatus.Loading}
                  >
                    {t('event.seeInCVP', 'See in Carrier Vessel Portal')}
                  </Button>
                </div>
              </div>
            ) : (
              t('event.noData', 'No data available')
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default EncounterTooltipRow
