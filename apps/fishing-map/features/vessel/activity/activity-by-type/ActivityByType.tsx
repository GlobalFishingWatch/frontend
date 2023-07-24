import { useCallback, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Virtuoso } from 'react-virtuoso'
import { useTranslation } from 'react-i18next'
import { EventTypes } from '@globalfishingwatch/api-types'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import useViewport from 'features/map/map-viewport.hooks'
import EventDetail from 'features/vessel/activity/event/EventDetail'
import { DEFAULT_VIEWPORT } from 'data/config'
import {
  ActivityEvent,
  selectEventsGroupedByType,
} from 'features/vessel/activity/vessels-activity.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import { setHighlightedEvents } from 'features/timebar/timebar.slice'
import Event from '../event/Event'
import { useActivityByType } from './activity-by-type.hook'
import styles from './activity-by-type.module.css'
import ActivityGroup from './ActivityGroup'

const EVENTS_ORDER = [
  EventTypes.Encounter,
  EventTypes.Fishing,
  EventTypes.Loitering,
  EventTypes.Port,
  EventTypes.Gap,
]
const HEADER_HEIGHT = 60
const EVENT_HEIGHT = 56

export function ActivityByType() {
  const { t } = useTranslation()
  const activityGroups = useSelector(selectEventsGroupedByType)
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
    (event: ActivityEvent) => {
      if (event?.id) {
        dispatch(setHighlightedEvents([event.id]))
      } else {
        dispatch(setHighlightedEvents([]))
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

  const groupsWithDataLength = EVENTS_ORDER.filter((eventType) => activityGroups[eventType]).length
  const containerStyle = useMemo(() => {
    const maxHeight = window.innerHeight - groupsWithDataLength * HEADER_HEIGHT
    const styleByEvent = Object.fromEntries(
      EVENTS_ORDER.map((eventType) => {
        const events = activityGroups[eventType]
        if (!events) return [eventType, {}]
        let eventsHeight = events.length * EVENT_HEIGHT
        const height = Math.min(eventsHeight, maxHeight)
        return [eventType, { height }]
      })
    )
    return styleByEvent
  }, [activityGroups, groupsWithDataLength])

  return (
    <div className={styles.activityContainer} ref={containerRef}>
      {Object.keys(activityGroups).length > 0 ? (
        <ul>
          {EVENTS_ORDER.map((eventType) => {
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
                      <Event
                        event={activityEvents[index]}
                        onMapHover={onMapHover}
                        onMapClick={selectEventOnMap}
                        onInfoClick={onInfoClick}
                        className={styles.typeEvent}
                      >
                        {selectedEvent?.id === activityEvents[index]?.id && (
                          <EventDetail event={selectedEvent} />
                        )}
                      </Event>
                    )}
                  />
                )}
              </ActivityGroup>
            )
          })}
        </ul>
      ) : (
        <span className={styles.enptyState}>
          {t(
            'vessel.noEventsinTimeRange',
            'There are no events fully contained in your timerange.'
          )}
        </span>
      )}
    </div>
  )
}

export default ActivityByType
