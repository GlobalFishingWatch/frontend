import React, { Fragment, useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton, Modal } from '@globalfishingwatch/ui-components'
import { VesselWithHistory } from 'types'
import { selectEventsForTracks } from 'features/vessels/activity/vessels-activity.slice'
import { ActivityEvent } from 'types/activity'
import { fetchRegionsThunk } from 'features/regions/regions.slice'
import styles from './Activity.module.css'
import ActivityDate from './ActivityDate'
import ActivityDescription from './description/ActivityDescription'
import ActivityModalContent from './ActivityModalContent'
interface InfoProps {
  vessel: VesselWithHistory | null
  lastPosition: any
  lastPortVisit: any
}

const Activity: React.FC<InfoProps> = (props): React.ReactElement => {
  const dispatch = useDispatch()

  const eventsForTracks = useSelector(selectEventsForTracks) ?? []
  const events = useMemo(() => eventsForTracks.map((e) => e.data).flat(), [eventsForTracks])

  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent>()
  const openModal = useCallback((event: ActivityEvent) => {
    setSelectedEvent(event)
    setIsOpen(true)
  }, [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    dispatch(fetchRegionsThunk())
  }, [dispatch])

  return (
    <Fragment>
      <Modal
        title={
          selectedEvent ? <ActivityDescription event={selectedEvent}></ActivityDescription> : ''
        }
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        {selectedEvent && <ActivityModalContent event={selectedEvent}></ActivityModalContent>}
      </Modal>
      <div className={styles.activityContainer}>
        {/* TODO: Implement virtual rendering|filtering to boost performance and usability  */}
        {events &&
          events.map((event, eventIndex) => (
            <Fragment key={eventIndex}>
              <div className={styles.event}>
                <div className={styles.eventIcon}>
                  <i></i>
                </div>
                <div className={styles.eventData}>
                  <ActivityDate event={event} />
                  <div className={styles.description}>
                    <ActivityDescription event={event}></ActivityDescription>
                  </div>
                </div>
                <div className={styles.actions}>
                  <IconButton
                    icon="info"
                    size="small"
                    onClick={() => openModal(event)}
                  ></IconButton>
                  <IconButton icon="view-on-map" size="small"></IconButton>
                </div>
              </div>
            </Fragment>
          ))}
      </div>
    </Fragment>
  )
}

export default Activity
