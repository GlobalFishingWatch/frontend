import { useCallback, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import { Virtuoso } from 'react-virtuoso'
import { EventTypes } from '@globalfishingwatch/api-types'
import useViewport from 'features/map/map-viewport.hooks'
import ActivityModalContent from 'features/vessel/activity/event-details/ActivityContent'
import { DEFAULT_VIEWPORT } from 'data/config'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
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

export function ActivityByType({ onMoveToMap = () => {} }: ActivityByTypeProps) {
  const activityGroups = useSelector(selectEventsByType)
  const containerRef = useRef<any>()
  const [expandedType, toggleExpandedType] = useActivityByType()
  const { viewport, setMapCoordinates } = useViewport()
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent>()

  const onInfoClick = useCallback((event: ActivityEvent) => {
    setSelectedEvent(event)
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
      setSelectedEvent(undefined)
      scrollBottom()
      uaEvent({
        category: 'Vessel Detail ACTIVITY BY TYPE Tab',
        action: 'View list of events by activity type',
        label: JSON.stringify({ type: event }),
      })
    },
    [scrollBottom, toggleExpandedType]
  )

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
  const containerStyle = useMemo(() => {
    const maxHeight = window.innerHeight - groupsWithDataLength * HEADER_HEIGHT
    const styleByEvent = Object.fromEntries(
      EVENTS_ODER.map((eventType) => {
        const events = activityGroups[eventType]
        if (!events) return [eventType, {}]
        const eventsHeight = events.length * EVENT_HEIGHT
        const height = Math.min(eventsHeight, maxHeight)
        return [eventType, { height }]
      })
    )
    return styleByEvent
  }, [activityGroups, groupsWithDataLength])

  return (
    <div className={styles.activityContainer} ref={containerRef}>
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
                <Virtuoso
                  style={containerStyle[eventType]}
                  totalCount={activityEvents.length}
                  itemContent={(index) => (
                    <EventItem
                      event={activityEvents[index]}
                      onMapClick={selectEventOnMap}
                      onInfoClick={onInfoClick}
                    >
                      {selectedEvent?.id === activityEvents[index]?.id && (
                        <ActivityModalContent event={selectedEvent}></ActivityModalContent>
                      )}
                    </EventItem>
                  )}
                />
              )}
            </ActivityGroup>
          )
        })}
      </ul>
    </div>
  )
}

export default ActivityByType
