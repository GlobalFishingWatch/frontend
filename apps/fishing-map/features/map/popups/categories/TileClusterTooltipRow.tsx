import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { stringify } from 'qs'
import { Button, Icon } from '@globalfishingwatch/ui-components'
import { EventVessel } from '@globalfishingwatch/api-types'
import { AsyncReducerStatus } from 'utils/async-slice'
import I18nDate from 'features/i18n/i18nDate'
import { ENCOUNTER_EVENTS_SOURCES } from 'features/dataviews/dataviews.utils'
import { formatInfoField } from 'utils/info'
import { CARRIER_PORTAL_URL } from 'data/config'
import { useCarrierLatestConnect } from 'features/datasets/datasets.hook'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import VesselLink from 'features/vessel/VesselLink'
import VesselPin from 'features/vessel/VesselPin'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { useViewStateAtom } from '../../map-viewport.hooks'
import {
  ExtendedEventVessel,
  ExtendedFeatureEvent,
  SliceExtendedClusterPickingObject,
} from '../../map.slice'
import styles from '../Popup.module.css'

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
  feature: SliceExtendedClusterPickingObject
  showFeaturesDetails: boolean
}

function EncounterTooltipRow({ feature, showFeaturesDetails }: EncountersLayerProps) {
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const { viewState } = useViewStateAtom()
  const { carrierLatest, carrierLatestStatus, dispatchFetchLatestCarrier } =
    useCarrierLatestConnect()

  useEffect(() => {
    if (!carrierLatest) {
      dispatchFetchLatestCarrier()
    }
  }, [carrierLatest, dispatchFetchLatestCarrier])

  const event = parseEvent(feature.event)
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
  const title = getDatasetLabel({ id: feature.datasetId })
  return (
    <div className={styles.popupSection}>
      <Icon icon="encounters" className={styles.layerIcon} style={{ color: feature.color }} />
      <div className={styles.popupSectionContent}>
        {<h3 className={styles.popupSectionTitle}>{title}</h3>}
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
                          <VesselLink vesselId={event.vessel.id} datasetId={event.vessel.dataset}>
                            {formatInfoField(event.vessel?.name, 'name')}
                          </VesselLink>
                        </span>
                        {(event.vessel as ExtendedEventVessel).dataset && (
                          <VesselPin vesselToResolve={event.vessel} />
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
                            <VesselLink
                              vesselId={event.encounter.vessel?.id}
                              datasetId={event.encounter.vessel?.dataset}
                            >
                              {formatInfoField(event.encounter.vessel?.name, 'name')}
                            </VesselLink>
                          </span>
                          {(event.encounter?.vessel as ExtendedEventVessel).dataset && (
                            <VesselPin vesselToResolve={event.encounter.vessel} />
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

type TileContextLayersProps = {
  features: SliceExtendedClusterPickingObject[]
  showFeaturesDetails: boolean
}

function TileClusterTooltipRow({ features, showFeaturesDetails }: TileContextLayersProps) {
  return (
    <Fragment>
      {features.map((feature, index) => {
        const key = `${feature.title}-${index}`
        if (ENCOUNTER_EVENTS_SOURCES.some((source) => feature.layerId === source)) {
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
