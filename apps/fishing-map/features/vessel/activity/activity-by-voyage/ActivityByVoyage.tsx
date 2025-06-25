import { Fragment, useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { GroupedVirtuoso } from 'react-virtuoso'
import cx from 'classnames'

import { eventsToBbox } from '@globalfishingwatch/data-transforms'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'

import { selectVisibleEvents } from 'features/app/selectors/app.selectors'
import { useMapFitBounds } from 'features/map/map-bounds.hooks'
import { getScrollElement } from 'features/sidebar/sidebar.utils'
import { useHighlightedEventsConnect } from 'features/timebar/timebar.hooks'
import VoyageGroup from 'features/vessel/activity/activity-by-voyage/VoyageGroup'
import type { VesselEvent } from 'features/vessel/activity/event/Event'
import Event, { EVENT_HEIGHT } from 'features/vessel/activity/event/Event'
import { useVesselEventBounds } from 'features/vessel/activity/event/event.bounds'
import { useEventActivityToggle } from 'features/vessel/activity/event/event-activity.hooks'
import {
  useEventsScroll,
  useVirtuosoScroll,
} from 'features/vessel/activity/event/event-scroll.hooks'
import type { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import {
  selectEventsGroupedByVoyages,
  selectVirtuosoVesselProfileEventsEvents,
} from 'features/vessel/activity/vessels-activity.selectors'
import { selectVesselPrintMode } from 'features/vessel/selectors/vessel.selectors'
import { useVesselProfileLayer } from 'features/vessel/vessel.hooks'
import { selectVesselEventId } from 'features/vessel/vessel.slice'
import { useLocationConnect } from 'routes/routes.hook'

import styles from '../ActivityGroupedList.module.css'

const ActivityByVoyage = () => {
  const { t } = useTranslation()
  const voyages = useSelector(selectEventsGroupedByVoyages)

  const isSmallScreen = useSmallScreen()
  const { dispatchQueryParams } = useLocationConnect()
  const { dispatchHighlightedEvents } = useHighlightedEventsConnect()
  const visibleEvents = useSelector(selectVisibleEvents)
  const selectedVesselEventId = useSelector(selectVesselEventId)
  const vesselPrintMode = useSelector(selectVesselPrintMode)
  const [selectedEventGroup, setSelectedEventGroup] = useEventActivityToggle()
  const fitBounds = useMapFitBounds()
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

  const handleToggleClick = useCallback(
    (voyage: number) => {
      setSelectedEventGroup(voyage !== selectedEventGroup ? ({ voyage } as ActivityEvent) : null)
    },
    [setSelectedEventGroup, selectedEventGroup]
  )

  const handleEventClick = useCallback(
    (event: VesselEvent) => {
      setSelectedEventId(event?.id)
      scrollToEvent({ eventId: event.id })
      fitEventBounds(event)
    },
    [scrollToEvent, setSelectedEventId, fitEventBounds]
  )

  const selectVoyageOnMap = useCallback(
    (voyageId: ActivityEvent['voyage']) => {
      const events = voyages[voyageId]
      const bounds = eventsToBbox(events)
      fitBounds(bounds, { fitZoom: true })
      if (isSmallScreen) dispatchQueryParams({ sidebarOpen: false })
    },
    [dispatchQueryParams, fitBounds, isSmallScreen, voyages]
  )

  const onEventMapHover = useCallback(
    (event?: VesselEvent) => {
      if (event?.id) {
        dispatchHighlightedEvents([event.id])
      } else {
        dispatchHighlightedEvents([])
      }
    },
    [dispatchHighlightedEvents]
  )

  const renderedComponent = useMemo(() => {
    if (!groupCounts.length) {
      return <span className={styles.enptyState}>{t('vessel.noVoyagesinTimeRange')}</span>
    }
    if (vesselPrintMode) {
      return (
        <Fragment>
          {Object.entries(voyages).map(([voyage, events]) => {
            return (
              <Fragment key={voyage}>
                <VoyageGroup key={`${voyage}-group`} expanded events={events} />
                {events.map((event, index) => (
                  <Event
                    key={`${voyage}-${index}-${event.id}`}
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
            const events = voyages[groups[index] as any]
            if (!events) {
              return null
            }
            const expanded = selectedEventGroup === index + 1

            return (
              <Fragment>
                <VoyageGroup
                  key={index}
                  expanded={expanded}
                  events={events}
                  onToggleClick={handleToggleClick}
                  onMapClick={selectVoyageOnMap}
                  // onMapHover={onVoyageMapHover}
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
                  key={event.id}
                  event={event}
                  expanded={expanded}
                  onMapHover={onEventMapHover}
                  eventsRef={eventsRef.current}
                  onMapClick={(event, e) => {
                    if (expanded) {
                      e.stopPropagation()
                    }
                    fitEventBounds(event)
                  }}
                  onInfoClick={handleEventClick}
                  className={cx(styles.event, { [styles.eventExpanded]: expanded })}
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
    groupCounts,
    vesselPrintMode,
    virtuosoRef,
    handleScroll,
    t,
    voyages,
    groups,
    selectedEventGroup,
    handleToggleClick,
    selectVoyageOnMap,
    events,
    selectedEventId,
    onEventMapHover,
    handleEventClick,
    fitEventBounds,
  ])

  if (visibleEvents !== 'all' && !visibleEvents.includes('port_visit')) {
    return <span className={styles.enptyState}>{t('vessel.noVoyagesWithoutPorts')}</span>
  }

  return <ul className={styles.activityContainer}>{renderedComponent}</ul>
}

export default ActivityByVoyage
