import React, { Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { stringify } from 'qs'
import Spinner from '@globalfishingwatch/ui-components/src/spinner'
import Button from '@globalfishingwatch/ui-components/src/button'
import IconButton from '@globalfishingwatch/ui-components/src/icon-button'
import { DatasetTypes, EventVessel } from '@globalfishingwatch/api-types/dist'
import { TooltipEventFeature, useClickedEventConnect } from 'features/map/map.hooks'
import { AsyncReducerStatus } from 'utils/async-slice'
import I18nDate from 'features/i18n/i18nDate'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { formatInfoField } from 'utils/info'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import {
  getRelatedDatasetByType,
  getRelatedDatasetsByType,
} from 'features/datasets/datasets.selectors'
import { CARRIER_PORTAL_URL } from 'data/config'
import { useCarrierLatestConnect } from 'features/datasets/datasets.hook'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import useViewport from '../map-viewport.hooks'
import { ExtendedEventVessel, ExtendedFeatureEvent } from '../map.slice'
import styles from './Popup.module.css'

type UserContextLayersProps = {
  features: TooltipEventFeature[]
  showFeaturesDetails: boolean
}

const parseEvent = (event: ExtendedFeatureEvent | undefined): ExtendedFeatureEvent | undefined => {
  if (!event) return event
  const carrierVessel: EventVessel =
    event.vessel.type === 'carrier' ? event.vessel : (event.encounter?.vessel as EventVessel)
  const encounterVessel: EventVessel | undefined =
    event.vessel.type === 'fishing' ? event.vessel : (event.encounter?.vessel as EventVessel)
  return {
    ...event,
    vessel: carrierVessel,
    ...(event.encounter && {
      encounter: {
        ...event.encounter,
        vessel: encounterVessel,
      },
    }),
  }
}

function TileClusterTooltipRow({ features, showFeaturesDetails }: UserContextLayersProps) {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const datasets = useSelector(selectAllDatasets)
  const { apiEventStatus } = useClickedEventConnect()
  const { start, end } = useTimerangeConnect()
  const { viewport } = useViewport()
  const { carrierLatest, carrierLatestStatus, dispatchFetchLatestCarrier } =
    useCarrierLatestConnect()

  useEffect(() => {
    if (!carrierLatest) {
      dispatchFetchLatestCarrier()
    }
  }, [carrierLatest, dispatchFetchLatestCarrier])

  const onPinClick = (vessel: ExtendedEventVessel) => {
    const infoDataset = datasets.find((dataset) => dataset.id === vessel.dataset)
    const trackDataset = getRelatedDatasetByType(infoDataset, DatasetTypes.Tracks)
    const eventsRelatedDatasets = getRelatedDatasetsByType(infoDataset, DatasetTypes.Events)

    const eventsDatasetsId =
      eventsRelatedDatasets && eventsRelatedDatasets?.length
        ? eventsRelatedDatasets.map((d) => d.id)
        : []

    if (infoDataset && trackDataset) {
      const vesselDataviewInstance = getVesselDataviewInstance(
        { id: vessel.id },
        {
          trackDatasetId: trackDataset.id,
          infoDatasetId: infoDataset.id,
          ...(eventsDatasetsId.length > 0 && { eventsDatasetsId }),
        }
      )
      upsertDataviewInstance(vesselDataviewInstance)
    }
  }

  return (
    <Fragment>
      {features.map((feature, index) => {
        const event = parseEvent(feature.event)
        const linkParams = {
          ...viewport,
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

        return (
          <div key={`${feature.title}-${index}`} className={styles.popupSection}>
            <span className={styles.popupSectionColor} style={{ backgroundColor: feature.color }} />
            <div className={styles.popupSectionContent}>
              {<h3 className={styles.popupSectionTitle}>{feature.title}</h3>}
              {showFeaturesDetails && (
                <div className={styles.row}>
                  {apiEventStatus === AsyncReducerStatus.Loading ? (
                    <div className={styles.loading}>
                      <Spinner size="small" />
                    </div>
                  ) : event ? (
                    <div className={styles.rowContainer}>
                      <span className={styles.rowText}>
                        <I18nDate date={event.start as string} />
                      </span>
                      <div className={styles.flex}>
                        {event.vessel && (
                          <div className={styles.rowColum}>
                            <p className={styles.rowTitle}>{t('vessel.carrier', 'Carrier')}</p>
                            <div className={styles.centered}>
                              <span className={styles.rowText}>
                                {formatInfoField(event.vessel?.name, 'name')}
                              </span>
                              <IconButton
                                icon="pin"
                                size="small"
                                tooltip={t('vessel.addToWorkspace', 'Add vessel to view')}
                                onClick={() => onPinClick(event.vessel as ExtendedEventVessel)}
                              />
                            </div>
                          </div>
                        )}
                        {event.encounter?.vessel && (
                          <div className={styles.row}>
                            <div className={styles.rowColum}>
                              <span className={styles.rowTitle}>
                                {t('vessel.donor', 'Donor vessel')}
                              </span>
                              <div className={styles.centered}>
                                <span className={styles.rowText}>
                                  {formatInfoField(event.encounter?.vessel?.name, 'name')}
                                </span>
                                <IconButton
                                  icon="pin"
                                  size="small"
                                  tooltip={t('vessel.addToWorkspace', 'Add vessel to view')}
                                  onClick={() =>
                                    onPinClick(event.encounter?.vessel as ExtendedEventVessel)
                                  }
                                />
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
                            carrierLatestStatus === AsyncReducerStatus.Loading ||
                            !isEventInDatasetRange
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
      })}
    </Fragment>
  )
}

export default TileClusterTooltipRow
