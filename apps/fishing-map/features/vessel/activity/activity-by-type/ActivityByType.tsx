import { Fragment, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import type { GroupedVirtuosoHandle } from 'react-virtuoso'
import { GroupedVirtuoso } from 'react-virtuoso'
import cx from 'classnames'

import type { EventType } from '@globalfishingwatch/api-types'
import { EventTypes } from '@globalfishingwatch/api-types'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { getScrollElement } from 'features/sidebar/sidebar.utils'
import { setHighlightedEvents } from 'features/timebar/timebar.slice'
import { useVesselEventBounds } from 'features/vessel/activity/event/event.bounds'
import { useEventsScroll } from 'features/vessel/activity/event/event-scroll.hooks'
import { selectEventsGroupedByType } from 'features/vessel/activity/vessels-activity.selectors'
import { selectVesselPrintMode } from 'features/vessel/selectors/vessel.selectors'
import { useVesselProfileLayer } from 'features/vessel/vessel.hooks'

import type VesselEvent from '../event/Event'
import Event, { EVENT_HEIGHT } from '../event/Event'

import { useActivityByType } from './activity-by-type.hook'
import ActivityGroup from './ActivityGroup'

import styles from '../ActivityGroupedList.module.css'

export const EVENTS_ORDER = [
  EventTypes.Port,
  EventTypes.Fishing,
  EventTypes.Encounter,
  EventTypes.Loitering,
  // EventTypes.Gap,
]

function ActivityByType() {
  const { t } = useTranslation()
  const activityGroups = useSelector(selectEventsGroupedByType)
  const dispatch = useAppDispatch()
  const vesselPrintMode = useSelector(selectVesselPrintMode)
  const [expandedType, toggleExpandedType] = useActivityByType()
  const vesselLayer = useVesselProfileLayer()
  const fitEventBounds = useVesselEventBounds(vesselLayer)
  const virtuosoRef = useRef<GroupedVirtuosoHandle>(null)
  const eventsRef = useRef(new Map<string, HTMLElement>())

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

  const { selectedEventId, setSelectedEventId, scrollToEvent, handleScroll } = useEventsScroll(
    events,
    eventsRef,
    virtuosoRef
  )

  const onToggleExpandedType = useCallback(
    (event: EventType) => {
      toggleExpandedType(event)
      setSelectedEventId(undefined)
      trackEvent({
        category: TrackCategory.VesselProfile,
        action: 'View list of events by activity type',
        label: JSON.stringify({ type: event }),
      })
    },
    [setSelectedEventId, toggleExpandedType]
  )

  const onMapHover = useCallback(
    (event?: VesselEvent) => {
      if (event?.id) {
        dispatch(setHighlightedEvents([event.id]))
      } else {
        dispatch(setHighlightedEvents([]))
      }
    },
    [dispatch]
  )

  const handleEventClick = useCallback(
    (event: VesselEvent) => {
      setSelectedEventId(event.id)
      scrollToEvent(event.id)
      fitEventBounds(event)
    },
    [scrollToEvent, fitEventBounds, setSelectedEventId]
  )

  const renderedComponent = useMemo(() => {
    if (vesselPrintMode) {
      return (
        <Fragment>
          {EVENTS_ORDER.map((eventType) => {
            const events = activityGroups[eventType]
            if (!events) {
              return null
            }
            const expanded = expandedType === eventType
            return (
              <Fragment key={eventType}>
                <ActivityGroup
                  key={`${eventType}-group`}
                  eventType={eventType}
                  onToggleClick={onToggleExpandedType}
                  quantity={events.length}
                  expanded={expanded}
                />
                {events.map((event, index) => (
                  <Event
                    key={`${eventType}-${index}-${event.id}`}
                    event={event}
                    className={styles.event}
                  />
                ))}
              </Fragment>
            )
          })}
        </Fragment>
      )
    }
    return (
      <Fragment>
        <GroupedVirtuoso
          ref={virtuosoRef}
          useWindowScroll
          defaultItemHeight={EVENT_HEIGHT}
          groupCounts={groupCounts}
          increaseViewportBy={EVENT_HEIGHT * 4}
          customScrollParent={getScrollElement()}
          onWheel={handleScroll}
          rangeChanged={handleScroll}
          groupContent={(index) => {
            const eventType = groups[index]
            const events = activityGroups[eventType]
            if (!events) {
              return null
            }
            const expanded = expandedType === eventType
            return (
              <Fragment>
                <ActivityGroup
                  key={eventType}
                  eventType={eventType}
                  onToggleClick={onToggleExpandedType}
                  quantity={events.length}
                  expanded={expanded}
                />
                {!expanded && index === groups.length - 1 && <div style={{ height: '48vh' }}></div>}
              </Fragment>
            )
          }}
          itemContent={(index, groupIndex) => {
            const event = events[index]
            const expanded = selectedEventId ? event?.id.includes(selectedEventId) : false
            return (
              <Fragment>
                <Event
                  event={event}
                  expanded={expanded}
                  onMapHover={onMapHover}
                  eventsRef={eventsRef.current}
                  onMapClick={(event, e) => {
                    if (expanded) {
                      e.stopPropagation()
                    }
                    fitEventBounds(event)
                  }}
                  onInfoClick={handleEventClick}
                  className={cx(styles.event, { [styles.eventExpanded]: expanded })}
                  testId={`vv-${event.type}-event-${index}`}
                />
                {index === events.length - 1 && groupIndex === groups.length - 1 && (
                  <div style={{ height: '48vh' }}></div>
                )}
              </Fragment>
            )
          }}
        />
      </Fragment>
    )
  }, [
    vesselPrintMode,
    groupCounts,
    handleScroll,
    activityGroups,
    expandedType,
    onToggleExpandedType,
    groups,
    events,
    selectedEventId,
    onMapHover,
    handleEventClick,
    fitEventBounds,
  ])

  return (
    <ul className={styles.activityContainer}>
      {groupCounts.length > 0 ? (
        renderedComponent
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
