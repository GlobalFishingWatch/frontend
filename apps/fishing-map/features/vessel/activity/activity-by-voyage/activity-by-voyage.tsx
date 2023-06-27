import { Fragment, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import { Modal, Spinner } from '@globalfishingwatch/ui-components'
import { selectEventsLoading } from 'features/vessel/activity/vessels-activity.selectors'
import { EventTypeVoyage, Voyage } from 'types/voyage'
import { t } from 'features/i18n/i18n'
import useVoyagesConnect from 'features/vessel/activity/activity-by-voyage/activity-by-voyage.hook'
import { selectVesselId } from 'routes/routes.selectors'
//import useMapEvents from 'features/map/map-events.hooks'
import useViewport from 'features/map/map-viewport.hooks'
import ActivityModalContent from 'features/vessel/activity/modals/ActivityModalContent'
import { DEFAULT_VIEWPORT } from 'data/config'
import { ActivityEvent } from 'types/activity'
import styles from '../activity-by-type/activity-by-type.module.css'
import useActivityEventConnect from '../event/event.hook'
import ActivityItem from './activity-item'
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
