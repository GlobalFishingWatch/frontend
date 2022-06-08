import { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Spinner } from '@globalfishingwatch/ui-components'
import { useUser } from 'features/user/user.hooks'
import RiskSection from 'features/risk-section/risk-section'
import RiskIndicator from 'features/risk-indicator/risk-indicator'
import useRisk from 'features/risk/risk.hook'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import ActivityModalContent from 'features/profile/components/activity/ActivityModalContent'
import useMapEvents from 'features/map/map-events.hooks'
import { EventTypeVoyage, Voyage } from 'types/voyage'
import useViewport from 'features/map/map-viewport.hooks'
import { DEFAULT_VESSEL_MAP_ZOOM } from 'data/config'
import TerminologyEncounterEvents from 'features/terminology/terminology-encounter-events'
import TerminologyFishingEvents from 'features/terminology/terminology-fishing-events'
import TerminologyLoiteringEvents from 'features/terminology/terminology-loitering-events'
import styles from './risk-summary.module.css'

export interface RiskSummaryProps {
  onMoveToMap?: () => void
}

export function RiskSummary(props: RiskSummaryProps) {
  const { t } = useTranslation()
  const { authorizedInsurer } = useUser()
  const { encountersInForeignEEZ, encountersInMPA, eventsLoading, fishingInMPA, loiteringInMPA } =
    useRisk()
  const { highlightEvent } = useMapEvents()
  const { viewport, setMapCoordinates } = useViewport()

  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<RenderedEvent>()
  const openModal = useCallback((event: RenderedEvent) => {
    setSelectedEvent(event)
    setIsOpen(true)
  }, [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  const onEventMapClick = useCallback(
    (event: RenderedEvent | Voyage) => {
      if (event.type !== EventTypeVoyage.Voyage) {
        highlightEvent(event)

        setMapCoordinates({
          latitude: event.position.lat,
          longitude: event.position.lon,
          zoom: viewport.zoom ?? DEFAULT_VESSEL_MAP_ZOOM,
          bearing: 0,
          pitch: 0,
        })
      }

      props.onMoveToMap && props.onMoveToMap()
    },
    [highlightEvent, props, setMapCoordinates, viewport.zoom]
  )
  const hasEncountersInMPAs = encountersInMPA.length > 0
  const hasEncountersInForeignEEZs = encountersInForeignEEZ.length > 0
  const hasFishingInMPAs = fishingInMPA.length > 0
  const hasLoiteringInMPAs = loiteringInMPA.length > 0

  if (!authorizedInsurer) return <Fragment />
  if (eventsLoading) return <Spinner className={styles.spinnerFull} />
  return (
    <div className={styles['container']}>
      {hasFishingInMPAs && (
        <RiskSection
          severity="medium"
          title={t('event.fishing', 'fishing')}
          titleInfo={<TerminologyFishingEvents />}
        >
          <RiskIndicator
            title={
              t('risk.fishingEventInMPA', 'fishing event in a MPA', {
                count: fishingInMPA.length,
              }) as string
            }
            events={fishingInMPA}
            onEventInfoClick={openModal}
            onEventMapClick={onEventMapClick}
          ></RiskIndicator>
        </RiskSection>
      )}
      {(hasEncountersInMPAs || hasEncountersInForeignEEZs) && (
        <RiskSection
          severity="medium"
          title={t('event.encounter', 'encounter', { count: 2 })}
          titleInfo={<TerminologyEncounterEvents />}
        >
          {hasEncountersInMPAs && (
            <RiskIndicator
              title={
                t('risk.encounterEventInMPA', 'encounters in a MPA', {
                  count: encountersInMPA.length,
                }) as string
              }
              events={encountersInMPA}
              onEventInfoClick={openModal}
              onEventMapClick={onEventMapClick}
            ></RiskIndicator>
          )}
          {hasEncountersInForeignEEZs && (
            <RiskIndicator
              title={
                t('risk.encounterEventInForeignEEZ', 'encounters in a foreign EEZ', {
                  count: encountersInForeignEEZ.length,
                }) as string
              }
              events={encountersInForeignEEZ}
              onEventInfoClick={openModal}
              onEventMapClick={onEventMapClick}
            ></RiskIndicator>
          )}
        </RiskSection>
      )}
      {hasLoiteringInMPAs && (
        <RiskSection
          severity="medium"
          title={t('event.loitering', 'loitering')}
          titleInfo={<TerminologyLoiteringEvents />}
        >
          <RiskIndicator
            title={
              t('risk.loiteringEventInMPA', 'loitering event in a MPA', {
                count: loiteringInMPA.length,
              }) as string
            }
            events={loiteringInMPA}
            onEventInfoClick={openModal}
            onEventMapClick={onEventMapClick}
          ></RiskIndicator>
        </RiskSection>
      )}
      {(!hasFishingInMPAs || !hasEncountersInMPAs || !hasLoiteringInMPAs) && (
        <RiskSection severity="none" title={t('risk.noRiskDetected', 'No risk detected') as string}>
          {!hasFishingInMPAs && (
            <RiskSection className={styles.naSubSection} title={t('event.fishing', 'fishing')}>
              <RiskIndicator
                title={
                  t('risk.noFishingEventInMPA', 'No fishing event detected in an MPA') as string
                }
                events={fishingInMPA}
                onEventInfoClick={openModal}
                onEventMapClick={onEventMapClick}
              ></RiskIndicator>
            </RiskSection>
          )}
          {(!hasEncountersInMPAs || !hasEncountersInForeignEEZs) && (
            <RiskSection
              className={styles.naSubSection}
              title={t('event.encounter', 'encounter', { count: 2 })}
            >
              {!hasEncountersInMPAs && (
                <RiskIndicator
                  title={
                    t('risk.noEncounterEventInMPA', 'No encounters detected in an MPA') as string
                  }
                  events={encountersInMPA}
                  onEventInfoClick={openModal}
                  onEventMapClick={onEventMapClick}
                ></RiskIndicator>
              )}
              {!hasEncountersInForeignEEZs && (
                <RiskIndicator
                  title={
                    t(
                      'risk.noEncounterEventInForeignEEZ',
                      'No encounters detected in foreign EEZ'
                    ) as string
                  }
                  events={encountersInForeignEEZ}
                  onEventInfoClick={openModal}
                  onEventMapClick={onEventMapClick}
                ></RiskIndicator>
              )}
            </RiskSection>
          )}
          {!hasLoiteringInMPAs && (
            <RiskSection className={styles.naSubSection} title={t('event.loitering', 'loitering')}>
              <RiskIndicator
                title={
                  t('risk.noLoiteringEventInMPA', 'No loitering event detected in an MPA') as string
                }
                events={loiteringInMPA}
                onEventInfoClick={openModal}
                onEventMapClick={onEventMapClick}
              ></RiskIndicator>
            </RiskSection>
          )}
        </RiskSection>
      )}
      <Modal
        appSelector="__next"
        title={selectedEvent?.description ?? ''}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        {selectedEvent && <ActivityModalContent event={selectedEvent}></ActivityModalContent>}
      </Modal>
    </div>
  )
}

export default RiskSummary
