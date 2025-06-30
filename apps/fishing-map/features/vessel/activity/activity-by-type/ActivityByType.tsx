import { Fragment, useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { GroupedVirtuoso } from 'react-virtuoso'
import cx from 'classnames'

import type { EventType } from '@globalfishingwatch/api-types'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { getScrollElement } from 'features/sidebar/sidebar.utils'
import { useHighlightedEventsConnect } from 'features/timebar/timebar.hooks'
import { useVesselEventBounds } from 'features/vessel/activity/event/event.bounds'
import { useEventActivityToggle } from 'features/vessel/activity/event/event-activity.hooks'
import {
  useEventsScroll,
  useVirtuosoScroll,
} from 'features/vessel/activity/event/event-scroll.hooks'
import type { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import {
  EVENTS_ORDER,
  selectEventsGroupedByType,
  selectVirtuosoVesselProfileEventsEvents,
} from 'features/vessel/activity/vessels-activity.selectors'
import { selectVesselPrintMode } from 'features/vessel/selectors/vessel.selectors'
import { useVesselProfileLayer } from 'features/vessel/vessel.hooks'
import { selectVesselEventId } from 'features/vessel/vessel.slice'

import type { VesselEvent } from '../event/Event'
import Event, { EVENT_HEIGHT } from '../event/Event'

import ActivityGroup from './ActivityGroup'

import styles from '../ActivityGroupedList.module.css'

function ActivityByType() {
  const { t } = useTranslation()
  const activityGroups = useSelector(selectEventsGroupedByType)
  const vesselPrintMode = useSelector(selectVesselPrintMode)
  const [selectedEventGroup, setSelectedEventGroup] = useEventActivityToggle()
  const selectedVesselEventId = useSelector(selectVesselEventId)
  const { dispatchHighlightedEvents } = useHighlightedEventsConnect()
  const vesselLayer = useVesselProfileLayer()
  const fitEventBounds = useVesselEventBounds(vesselLayer)
  const { virtuosoRef } = useVirtuosoScroll()
  const eventsRef = useRef(new Map<string, HTMLElement>())

  const { events, groupCounts, groups } = useSelector(selectVirtuosoVesselProfileEventsEvents)

  const { selectedEventId, setSelectedEventId, scrollToEvent, handleScroll } = useEventsScroll(
    eventsRef,
    virtuosoRef
  )

  useEffect(() => {
    if (selectedVesselEventId && events?.length) {
      scrollToEvent({ eventId: selectedVesselEventId })
    }
    // Only run once if selectedVesselEventId is in the url when loaded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events])

  const onToggleExpandedType = useCallback(
    (type: EventType) => {
      setSelectedEventGroup(type === selectedEventGroup ? null : ({ type } as ActivityEvent))
      setSelectedEventId(undefined)
      trackEvent({
        category: TrackCategory.VesselProfile,
        action: 'View list of events by activity type',
        label: JSON.stringify({ type }),
      })
    },
    [selectedEventGroup, setSelectedEventId, setSelectedEventGroup]
  )

  const onMapHover = useCallback(
    (event?: VesselEvent) => {
      if (event?.id) {
        dispatchHighlightedEvents([event.id])
      } else {
        dispatchHighlightedEvents([])
      }
    },
    [dispatchHighlightedEvents]
  )

  const handleEventClick = useCallback(
    (event: VesselEvent) => {
      scrollToEvent({ eventId: event.id })
      fitEventBounds(event)
    },
    [scrollToEvent, fitEventBounds]
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
            const expanded = selectedEventGroup === eventType
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
            const eventType = groups[index] as EventType
            const events = activityGroups[eventType]
            if (!events) {
              return null
            }
            const expanded = selectedEventGroup === eventType
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
    virtuosoRef,
    groupCounts,
    handleScroll,
    activityGroups,
    selectedEventGroup,
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
        <span className={styles.enptyState}>{t('vessel.noEventsinTimeRange')}</span>
      )}
    </ul>
  )
}

export default ActivityByType
