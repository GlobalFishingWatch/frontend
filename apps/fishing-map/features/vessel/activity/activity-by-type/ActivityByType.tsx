import { useCallback, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import { VariableSizeList as List } from 'react-window'
import { Modal } from '@globalfishingwatch/ui-components'
import { EventTypes } from '@globalfishingwatch/api-types'
import useViewport from 'features/map/map-viewport.hooks'
import ActivityModalContent from 'features/vessel/activity/event-details/ActivityContent'
import { DEFAULT_VIEWPORT } from 'data/config'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import useActivityEventConnect from '../event/event.hook'
import EventItem from '../event/Event'
import { useActivityByType } from './activity-by-type.hook'
import styles from './activity-by-type.module.css'
import { selectEventsByType } from './activity-by-type.selectors'
import ActivityGroup from './ActivityGroup'

export interface ActivityByTypeProps {
  onMoveToMap?: () => void
}

const EVENTS_ODER = [
  EventTypes.Encounter,
  EventTypes.Fishing,
  EventTypes.Loitering,
  EventTypes.Port,
  EventTypes.Gap,
]
const HEADER_HEIGHT = 60
const EVENT_HEIGHT = 50
const EVENT_EXPANDED_HEIGHT = 150

export function ActivityByType({ onMoveToMap = () => {} }: ActivityByTypeProps) {
  const activityGroups = useSelector(selectEventsByType)
  const containerRef = useRef<any>()
  const [expandedType, toggleExpandedType] = useActivityByType()
  const { getEventDescription } = useActivityEventConnect()
  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent>()

  const openModal = useCallback((event: ActivityEvent) => {
    setSelectedEvent(event)
    setIsOpen(true)
  }, [])

  const scrollBottom = useCallback(() => {
    if (containerRef.current) {
      requestAnimationFrame(() => {
        containerRef.current.scrollIntoView(false)
      })
    }
  }, [])

  const onToggleExpandedType = useCallback(
    (event) => {
      toggleExpandedType(event)
      scrollBottom()
      uaEvent({
        category: 'Vessel Detail ACTIVITY BY TYPE Tab',
        action: 'View list of events by activity type',
        label: JSON.stringify({ type: event }),
      })
    },
    [scrollBottom, toggleExpandedType]
  )

  const closeModal = useCallback(() => setIsOpen(false), [])
  const { viewport, setMapCoordinates } = useViewport()

  const selectEventOnMap = useCallback(
    (event: ActivityEvent) => {
      setMapCoordinates({
        latitude: event.position.lat,
        longitude: event.position.lon,
        zoom: viewport.zoom ?? DEFAULT_VIEWPORT.zoom,
      })

      onMoveToMap()
    },
    [onMoveToMap, setMapCoordinates, viewport.zoom]
  )

  const groupsWithDataLength = EVENTS_ODER.filter((eventType) => activityGroups[eventType]).length
  const getContainerHeight = useCallback(
    (events: ActivityEvent[]) => {
      const maxHeight = window.innerHeight - groupsWithDataLength * HEADER_HEIGHT
      const eventsHeight = events.length * EVENT_HEIGHT
      const height = Math.min(eventsHeight, maxHeight)
      return height
    },
    [groupsWithDataLength]
  )

  const getRowHeight = useCallback((index: number) => {
    return EVENT_HEIGHT
  }, [])

  return (
    <div className={styles.activityContainer} ref={containerRef}>
      <Modal
        appSelector="__next"
        title={getEventDescription(selectedEvent)}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        {selectedEvent && <ActivityModalContent event={selectedEvent}></ActivityModalContent>}
      </Modal>
      <ul>
        {EVENTS_ODER.map((eventType) => {
          const activityEvents = activityGroups[eventType]
          if (!activityEvents) return null

          const expanded = expandedType === eventType
          return (
            <ActivityGroup
              key={eventType}
              eventType={eventType}
              onToggleClick={onToggleExpandedType}
              quantity={activityEvents.length}
              expanded={expanded}
            >
              {expanded && activityEvents.length > 0 && (
                <List
                  innerElementType="ul"
                  width="100%"
                  height={getContainerHeight(activityEvents)}
                  itemCount={activityEvents.length}
                  itemData={activityEvents}
                  itemSize={getRowHeight}
                >
                  {({ index, style }) => {
                    return (
                      <EventItem
                        event={activityEvents[index]}
                        onMapClick={selectEventOnMap}
                        onInfoClick={openModal}
                        style={style}
                      ></EventItem>
                    )
                  }}
                </List>
              )}
            </ActivityGroup>
          )
        })}
      </ul>
    </div>
  )
}

export default ActivityByType
