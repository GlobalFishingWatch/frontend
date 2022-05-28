import { Fragment, useCallback, useState } from 'react'
import { Modal } from '@globalfishingwatch/ui-components'
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
import styles from './risk-summary.module.css'

/* eslint-disable-next-line */
export interface RiskSummaryProps {
  onMoveToMap?: () => void
}

export function RiskSummary(props: RiskSummaryProps) {
  const { authorizedInsurer } = useUser()
  const { encountersInMPA, fishingInMPA, loiteringInMPA } = useRisk()
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
  if (!authorizedInsurer) return <Fragment />
  return (
    <div className={styles['container']}>
      {fishingInMPA.length > 0 && (
        <RiskSection severity="medium" title="Fishing">
          <RiskIndicator
            title="fishing in an MPA"
            events={fishingInMPA}
            onEventInfoClick={openModal}
            onEventMapClick={onEventMapClick}
          ></RiskIndicator>
        </RiskSection>
      )}
      {encountersInMPA.length > 0 && (
        <RiskSection severity="medium" title="Encounters">
          <RiskIndicator
            title="encounters in an MPA"
            events={encountersInMPA}
            onEventInfoClick={openModal}
            onEventMapClick={onEventMapClick}
          ></RiskIndicator>
        </RiskSection>
      )}
      {loiteringInMPA.length > 0 && (
        <RiskSection severity="medium" title="Loitering">
          <RiskIndicator
            title="loitering in an MPA"
            events={loiteringInMPA}
            onEventInfoClick={openModal}
            onEventMapClick={onEventMapClick}
          ></RiskIndicator>
        </RiskSection>
      )}
      {/* <RiskSection severity="med" title="Med">
        Med
      </RiskSection>
      <RiskSection severity="low" title="Low" titleInfo={<Fragment>some info</Fragment>}>
        Low
      </RiskSection>
      <RiskSection severity="none" title="None">
        None
      </RiskSection> */}
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
