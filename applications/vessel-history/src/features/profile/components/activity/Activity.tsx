import React, { Fragment, useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Spinner } from '@globalfishingwatch/ui-components'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import { VesselWithHistory } from 'types'
import {
  RenderedEvent,
  selectEventsWithRenderingInfo,
} from 'features/vessels/activity/vessels-activity.slice'
import { fetchRegionsThunk } from 'features/regions/regions.slice'
import ActivityItem from './ActivityItem'
import ActivityModalContent from './ActivityModalContent'
import styles from './Activity.module.css'
interface ActivityProps {
  vessel: VesselWithHistory | null
  lastPosition: any
  lastPortVisit: any
}

const Activity: React.FC<ActivityProps> = (props): React.ReactElement => {
  const dispatch = useDispatch()

  const eventsLoading = useSelector(selectResourcesLoading)
  const eventsForTracks = useSelector(selectEventsWithRenderingInfo)
  const events = useMemo(
    () => eventsForTracks.flat().sort((a, b) => (a.start > b.start ? -1 : 1)),
    [eventsForTracks]
  )

  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<RenderedEvent>()
  const openModal = useCallback((event: RenderedEvent) => {
    setSelectedEvent(event)
    setIsOpen(true)
  }, [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    dispatch(fetchRegionsThunk())
  }, [dispatch])

  return (
    <Fragment>
      {eventsLoading && <Spinner className={styles.spinnerFull} />}
      {!eventsLoading && (
        <Fragment>
          <Modal title={selectedEvent?.description ?? ''} isOpen={isModalOpen} onClose={closeModal}>
            {selectedEvent && <ActivityModalContent event={selectedEvent}></ActivityModalContent>}
          </Modal>
          <div className={styles.activityContainer}>
            {/* TODO: Implement virtual rendering|filtering to boost performance and usability  */}
            {events &&
              events.map((event, eventIndex) => (
                <ActivityItem
                  key={eventIndex}
                  event={event}
                  onInfoClick={(event) => openModal(event)}
                />
              ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

export default Activity
