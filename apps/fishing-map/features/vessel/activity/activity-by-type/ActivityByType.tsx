import { useCallback, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Virtuoso } from 'react-virtuoso'
import { EventTypes } from '@globalfishingwatch/api-types'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import useViewport from 'features/map/map-viewport.hooks'
import EventDetail from 'features/vessel/activity/event/EventDetail'
import { DEFAULT_VIEWPORT } from 'data/config'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import { disableHighlightedTime, setHighlightedTime } from 'features/timebar/timebar.slice'
import { getUTCDateTime } from 'utils/dates'
import EventItem from '../event/Event'
import { useActivityByType } from './activity-by-type.hook'
import styles from './activity-by-type.module.css'
import { selectEventsByType } from './activity-by-type.selectors'
import ActivityGroup from './ActivityGroup'

const EVENTS_ODER = [
  EventTypes.Encounter,
  EventTypes.Fishing,
  EventTypes.Loitering,
  EventTypes.Port,
  EventTypes.Gap,
]
const HEADER_HEIGHT = 60
const EVENT_HEIGHT = 50
const MIN_EVENTS_HEIGHT = 400

export function ActivityByType() {
  const activityGroups = useSelector(selectEventsByType)
  const containerRef = useRef<any>()
  const dispatch = useAppDispatch()
  const [expandedType, toggleExpandedType] = useActivityByType()
  const { viewport, setMapCoordinates } = useViewport()
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent>()

  const onInfoClick = useCallback((event: ActivityEvent) => {
    setSelectedEvent((state) => (state?.id === event.id ? undefined : event))
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
      trackEvent({
        category: TrackCategory.VesselProfile,
        action: 'View list of events by activity type',
        label: JSON.stringify({ type: event }),
      })
    },
    [scrollBottom, toggleExpandedType]
  )

  const onMapHover = useCallback(
    (event?: ActivityEvent) => {
      if (event?.start && event?.end) {
        dispatch(
          setHighlightedTime({
            start: getUTCDateTime(event.start).toISO(),
            end: getUTCDateTime(event.end).toISO(),
          })
        )
      } else {
        dispatch(disableHighlightedTime())
      }
    },
    [dispatch]
  )

  const selectEventOnMap = useCallback(
    (event: ActivityEvent) => {
      setMapCoordinates({
        latitude: event.position.lat,
        longitude: event.position.lon,
        zoom: viewport.zoom ?? DEFAULT_VIEWPORT.zoom,
      })
    },
    [setMapCoordinates, viewport.zoom]
  )

  const groupsWithDataLength = EVENTS_ODER.filter((eventType) => activityGroups[eventType]).length
  const containerStyle = useMemo(() => {
    const maxHeight = window.innerHeight - groupsWithDataLength * HEADER_HEIGHT
    const styleByEvent = Object.fromEntries(
      EVENTS_ODER.map((eventType) => {
        const events = activityGroups[eventType]
        if (!events) return [eventType, {}]
        let eventsHeight = events.length * EVENT_HEIGHT
        if (eventsHeight < MIN_EVENTS_HEIGHT) {
          eventsHeight = MIN_EVENTS_HEIGHT
        }
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
                      onMapHover={onMapHover}
                      onMapClick={selectEventOnMap}
                      onInfoClick={onInfoClick}
                    >
                      {selectedEvent?.id === activityEvents[index]?.id && (
                        <EventDetail event={selectedEvent} />
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
