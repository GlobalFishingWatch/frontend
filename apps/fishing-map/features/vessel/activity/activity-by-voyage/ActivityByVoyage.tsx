import { Fragment, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal } from '@globalfishingwatch/ui-components'
import { Voyage } from 'features/vessel/activity/activity-by-voyage/activity-by-voyage.selectors'
import useViewport from 'features/map/map-viewport.hooks'
import ActivityModalContent from 'features/vessel/activity/event-details/ActivityContent'
import { DEFAULT_VIEWPORT } from 'data/config'
import VoyageGroup from 'features/vessel/activity/activity-by-voyage/VoyageGroup'
import EventItem from 'features/vessel/activity/event/Event'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import useExpandedVoyages from 'features/vessel/activity/activity-by-voyage/activity-by-voyage.hook'
import useActivityEventConnect from '../event/event.hook'
import styles from '../activity-by-type/activity-by-type.module.css'
import { selectVoyagesByVessel } from './activity-by-voyage.selectors'

interface ActivityProps {
  onMoveToMap?: () => void
}

const ActivityByVoyage: React.FC<ActivityProps> = (props): React.ReactElement => {
  const events = useSelector(selectVoyagesByVessel)
  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent>()
  const { getEventDescription } = useActivityEventConnect()
  const [expandedVoyages, toggleExpandedVoyage] = useExpandedVoyages()

  const openModal = useCallback((event: ActivityEvent) => {
    setSelectedEvent(event)
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => setIsOpen(false), [])
  const { viewport, setMapCoordinates } = useViewport()

  const selectVoyageOnMap = useCallback(
    (voyage: Voyage) => {
      // TODO get voyage bounds
      if (props.onMoveToMap) {
        props.onMoveToMap()
      }
    },
    [props]
  )

  const selectEventOnMap = useCallback(
    (event: ActivityEvent) => {
      setMapCoordinates({
        latitude: event.position.lat,
        longitude: event.position.lon,
        zoom: viewport.zoom ?? DEFAULT_VIEWPORT.zoom,
      })
      if (props.onMoveToMap) {
        props.onMoveToMap()
      }
    },
    [props, setMapCoordinates, viewport.zoom]
  )

  return (
    <div className={styles.activityContainer}>
      <Fragment>
        <Modal
          appSelector="__next"
          title={getEventDescription(selectedEvent)}
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          {selectedEvent && <ActivityModalContent event={selectedEvent}></ActivityModalContent>}
        </Modal>
        <ul className={styles.activityContainer}>
          {events?.length > 0 &&
            events.map((event, index) => {
              const expanded = expandedVoyages.includes(event.timestamp)
              return (
                <VoyageGroup
                  key={index}
                  expanded={expanded}
                  event={event}
                  onToggleClick={toggleExpandedVoyage}
                  onMapClick={selectVoyageOnMap}
                >
                  {expanded &&
                    event.events.length > 0 &&
                    event.events.map((event) => (
                      <EventItem
                        key={event.id}
                        event={event}
                        onMapClick={selectEventOnMap}
                        onInfoClick={openModal}
                      />
                    ))}
                </VoyageGroup>
              )
            })}
        </ul>
      </Fragment>
    </div>
  )
}

export default ActivityByVoyage
