import { Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { stringify } from 'qs'
import { Button, Icon, IconButton } from '@globalfishingwatch/ui-components'
import { DatasetTypes, EventVessel } from '@globalfishingwatch/api-types'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { AsyncReducerStatus } from 'utils/async-slice'
import I18nDate from 'features/i18n/i18nDate'
import {
  ENCOUNTER_EVENTS_SOURCE_ID,
  getVesselDataviewInstance,
  getVesselInWorkspace,
} from 'features/dataviews/dataviews.utils'
import { formatInfoField } from 'utils/info'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { CARRIER_PORTAL_URL } from 'data/config'
import { useCarrierLatestConnect } from 'features/datasets/datasets.hook'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import { getRelatedDatasetByType, getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import useViewport from '../map-viewport.hooks'
import { ExtendedEventVessel, ExtendedFeatureEvent } from '../map.slice'
import styles from './Popup.module.css'

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

type EncountersLayerProps = {
  feature: TooltipEventFeature
  showFeaturesDetails: boolean
}

function EncounterTooltipRow({ feature, showFeaturesDetails }: EncountersLayerProps) {
  const { t } = useTranslation()
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const datasets = useSelector(selectAllDatasets)
  const { start, end } = useTimerangeConnect()
  const { viewport } = useViewport()
  const { carrierLatest, carrierLatestStatus, dispatchFetchLatestCarrier } =
    useCarrierLatestConnect()
  const vessels = useSelector(selectActiveTrackDataviews)

  useEffect(() => {
    if (!carrierLatest) {
      dispatchFetchLatestCarrier()
    }
  }, [carrierLatest, dispatchFetchLatestCarrier])

  const onPinClick = (ev: React.MouseEvent<Element, MouseEvent>, vessel: ExtendedEventVessel) => {
    const vesselInWorkspace = getVesselInWorkspace(vessels, vessel.id)
    if (vesselInWorkspace) {
      deleteDataviewInstance(vesselInWorkspace.id)
      return
    }

    const infoDataset = datasets.find((dataset) => dataset.id === vessel.dataset)
    const trackDataset = getRelatedDatasetByType(infoDataset, DatasetTypes.Tracks)
    const eventsRelatedDatasets = getRelatedDatasetsByType(infoDataset, DatasetTypes.Events)

    const eventsDatasetsId =
      eventsRelatedDatasets && eventsRelatedDatasets?.length
        ? eventsRelatedDatasets.map((d) => d.id)
        : []

    if (infoDataset || trackDataset) {
      const vesselDataviewInstance = getVesselDataviewInstance(
        { id: vessel.id },
        {
          trackDatasetId: trackDataset?.id,
          infoDatasetId: infoDataset?.id,
          ...(eventsDatasetsId.length > 0 && { eventsDatasetsId }),
        }
      )
      upsertDataviewInstance(vesselDataviewInstance)
    }
  }

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

  const carrierInWorkspace = getVesselInWorkspace(vessels, event!?.vessel!?.id)
  const donorInWorkspace = getVesselInWorkspace(vessels, event!?.encounter!?.vessel!?.id)

  return (
    <div className={styles.popupSection}>
      <Icon icon="encounters" className={styles.layerIcon} style={{ color: feature.color }} />
      <div className={styles.popupSectionContent}>
        {<h3 className={styles.popupSectionTitle}>{feature.title}</h3>}
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
                      <p className={styles.rowTitle}>{t('vessel.carrier', 'Carrier')}</p>
                      <div className={styles.centered}>
                        <span className={styles.rowText}>
                          {formatInfoField(event.vessel?.name, 'name')}
                        </span>
                        {(event.vessel as ExtendedEventVessel).dataset && (
                          <IconButton
                            icon={carrierInWorkspace ? 'pin-filled' : 'pin'}
                            style={{
                              color: carrierInWorkspace ? carrierInWorkspace.config?.color : '',
                            }}
                            size="small"
                            tooltip={
                              carrierInWorkspace
                                ? t(
                                    'search.vesselAlreadyInWorkspace',
                                    'This vessel is already in your workspace'
                                  )
                                : t('vessel.addToWorkspace', 'Add vessel to view')
                            }
                            onClick={(e) => onPinClick(e, event.vessel as ExtendedEventVessel)}
                          />
                        )}
                      </div>
                    </div>
                  )}
                  {event.encounter?.vessel && (
                    <div className={styles.row}>
                      <div className={styles.rowColum}>
                        <span className={styles.rowTitle}>{t('vessel.donor', 'Donor vessel')}</span>
                        <div className={styles.centered}>
                          <span className={styles.rowText}>
                            {formatInfoField(event.encounter?.vessel?.name, 'name')}
                          </span>
                          {(event.encounter?.vessel as ExtendedEventVessel).dataset && (
                            <IconButton
                              icon={donorInWorkspace ? 'pin-filled' : 'pin'}
                              style={{
                                color: donorInWorkspace ? donorInWorkspace.config?.color : '',
                              }}
                              size="small"
                              tooltip={
                                donorInWorkspace
                                  ? t(
                                      'search.vesselAlreadyInWorkspace',
                                      'This vessel is already in your workspace'
                                    )
                                  : t('vessel.addToWorkspace', 'Add vessel to view')
                              }
                              onClick={(e) =>
                                onPinClick(e, event.encounter?.vessel as ExtendedEventVessel)
                              }
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

function GenericClusterTooltipRow({ feature, showFeaturesDetails }: EncountersLayerProps) {
  return (
    <div className={styles.popupSection}>
      <Icon icon="clusters" style={{ color: feature.color }} />
      <div className={styles.popupSectionContent}>
        {<h3 className={styles.popupSectionTitle}>{feature.title}</h3>}
        {showFeaturesDetails && feature.properties && (
          <div className={styles.row}>
            <ul className={styles.list}>
              {Object.entries(feature.properties).map(([key, value]) => {
                if (key === 'count' || key === 'expansionZoom') {
                  return null
                }
                return (
                  <li key={key}>
                    <span className={styles.strong}>{key}</span>: {JSON.stringify(value)}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

type UserContextLayersProps = {
  features: TooltipEventFeature[]
  showFeaturesDetails: boolean
}

function TileClusterTooltipRow({ features, showFeaturesDetails }: UserContextLayersProps) {
  return (
    <Fragment>
      {features.map((feature, index) => {
        const key = `${feature.title}-${index}`
        if (feature.source === ENCOUNTER_EVENTS_SOURCE_ID) {
          return (
            <EncounterTooltipRow
              key={key}
              feature={feature}
              showFeaturesDetails={showFeaturesDetails}
            />
          )
        }
        return (
          <GenericClusterTooltipRow
            key={key}
            feature={feature}
            showFeaturesDetails={showFeaturesDetails}
          />
        )
      })}
    </Fragment>
  )
}

export default TileClusterTooltipRow
