import { Fragment, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal, Spinner } from '@globalfishingwatch/ui-components'
import { selectEventsLoading } from 'features/vessel/activity/vessels-activity.selectors'
import { EventTypeVoyage, Voyage } from 'types/voyage'
import useVoyagesConnect from 'features/vessel/activity/activity-by-voyage/activity-by-voyage.hook'
import useViewport from 'features/map/map-viewport.hooks'
import ActivityModalContent from 'features/vessel/activity/event-details/ActivityContent'
import { DEFAULT_VIEWPORT } from 'data/config'
import { ActivityEvent } from 'types/activity'
import useActivityEventConnect from '../event/event.hook'
import styles from '../activity-by-type/activity-by-type.module.css'
import ActivityItem from './ActivityItem'
import { selectVoyagesByVessel } from './activity-by-voyage.selectors'

interface ActivityProps {
  onMoveToMap: () => void
}

const ActivityByVoyage: React.FC<ActivityProps> = (props): React.ReactElement => {
  const { toggleVoyage } = useVoyagesConnect()
  const events = useSelector(selectVoyagesByVessel)
  const eventsLoading = useSelector(selectEventsLoading)
  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent>()
  const { getEventDescription } = useActivityEventConnect()
  const openModal = useCallback((event: ActivityEvent) => {
    setSelectedEvent(event)
    setIsOpen(true)
  }, [])
  const closeModal = useCallback(() => setIsOpen(false), [])
  const { viewport, setMapCoordinates } = useViewport()

  const selectEventOnMap = useCallback(
    (event: ActivityEvent | Voyage) => {
      if (event.type === EventTypeVoyage.Voyage) {
      } else {
        setMapCoordinates({
          latitude: event.position.lat,
          longitude: event.position.lon,
          zoom: viewport.zoom ?? DEFAULT_VIEWPORT.zoom,
        })
      }

      props.onMoveToMap()
    },
    [props, setMapCoordinates, viewport.zoom]
  )

  return (
    <div className={styles.activityContainer}>
      {eventsLoading && <Spinner className={styles.spinnerFull} />}
      {!eventsLoading && (
        <Fragment>
          <Modal
            appSelector="__next"
            title={getEventDescription(selectedEvent)}
            isOpen={isModalOpen}
            onClose={closeModal}
          >
            {selectedEvent && <ActivityModalContent event={selectedEvent}></ActivityModalContent>}
          </Modal>
          <div className={styles.activityContainer}>
            {events &&
              events.length &&
              events.map((event, index) => (
                <ActivityItem
                  key={index}
                  event={event}
                  onToggleClick={toggleVoyage}
                  onMapClick={selectEventOnMap}
                  onInfoClick={openModal}
                />
              ))}
          </div>
        </Fragment>
      )}
    </div>
  )
}

export default ActivityByVoyage
