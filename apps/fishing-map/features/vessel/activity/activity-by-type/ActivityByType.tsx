import { useCallback, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { GroupedVirtuoso } from 'react-virtuoso'
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
import { getScrollElement } from 'features/sidebar/Sidebar'
import Event, { EVENT_HEIGHT } from '../event/Event'
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

  const onToggleExpandedType = useCallback(
    (event) => {
      toggleExpandedType(event)
      setSelectedEvent(undefined)
      trackEvent({
        category: TrackCategory.VesselProfile,
        action: 'View list of events by activity type',
        label: JSON.stringify({ type: event }),
      })
    },
    [toggleExpandedType]
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

  const { events, groupCounts, groups } = useMemo(() => {
    const eventTypesWithData = EVENTS_ORDER.filter((eventType) => activityGroups[eventType])
    const eventsExpanded = eventTypesWithData.map((eventType) => {
      const expanded = expandedType === eventType
      return expanded ? activityGroups[eventType] : []
    })
    return {
      events: eventsExpanded.flat(),
      groupCounts: eventsExpanded.map((events) => events.length),
      groups: eventTypesWithData,
    }
  }, [activityGroups, expandedType])

  return (
    <ul className={styles.activityContainer} ref={containerRef}>
      {groupCounts.length > 0 ? (
        <GroupedVirtuoso
          useWindowScroll
          defaultItemHeight={EVENT_HEIGHT}
          groupCounts={groupCounts}
          increaseViewportBy={EVENT_HEIGHT * 4}
          customScrollParent={getScrollElement()}
          groupContent={(index) => {
            const eventType = groups[index]
            const events = activityGroups[eventType]
            if (!events) {
              return null
            }
            const expanded = expandedType === eventType
            return (
              <ActivityGroup
                key={eventType}
                eventType={eventType}
                onToggleClick={onToggleExpandedType}
                quantity={events.length}
                expanded={expanded}
              />
            )
          }}
          itemContent={(index) => {
            const event = events[index]
            return (
              <Event
                event={event}
                onMapHover={onMapHover}
                onMapClick={selectEventOnMap}
                onInfoClick={onInfoClick}
                className={styles.typeEvent}
              >
                {selectedEvent?.id === event?.id && <EventDetail event={selectedEvent} />}
              </Event>
            )
          }}
        />
      ) : (
        <span className={styles.enptyState}>
          {t(
            'vessel.noEventsinTimeRange',
            'There are no events fully contained in your timerange.'
          )}
        </span>
      )}
    </ul>
  )
}

export default ActivityByType
