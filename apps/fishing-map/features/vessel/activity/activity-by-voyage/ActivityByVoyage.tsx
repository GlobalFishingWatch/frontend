import { Fragment, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import type { GroupedVirtuosoHandle } from 'react-virtuoso'
import { GroupedVirtuoso } from 'react-virtuoso'
import cx from 'classnames'

import { eventsToBbox } from '@globalfishingwatch/data-transforms'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectVisibleEvents } from 'features/app/selectors/app.selectors'
import { useMapFitBounds } from 'features/map/map-bounds.hooks'
import { getScrollElement } from 'features/sidebar/sidebar.utils'
import { setHighlightedEvents } from 'features/timebar/timebar.slice'
import useExpandedVoyages from 'features/vessel/activity/activity-by-voyage/activity-by-voyage.hook'
import VoyageGroup from 'features/vessel/activity/activity-by-voyage/VoyageGroup'
import type VesselEvent from 'features/vessel/activity/event/Event'
import Event, { EVENT_HEIGHT } from 'features/vessel/activity/event/Event'
import { useVesselEventBounds } from 'features/vessel/activity/event/event.bounds'
import { useEventsScroll } from 'features/vessel/activity/event/event-scroll.hooks'
import type { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { selectEventsGroupedByVoyages } from 'features/vessel/activity/vessels-activity.selectors'
import { selectVesselPrintMode } from 'features/vessel/selectors/vessel.selectors'
import { useVesselProfileLayer } from 'features/vessel/vessel.hooks'
import { useLocationConnect } from 'routes/routes.hook'

import styles from '../ActivityGroupedList.module.css'

const ActivityByVoyage = () => {
  const { t } = useTranslation()
  const voyages = useSelector(selectEventsGroupedByVoyages)
  const dispatch = useAppDispatch()

  const isSmallScreen = useSmallScreen()
  const { dispatchQueryParams } = useLocationConnect()
  const visibleEvents = useSelector(selectVisibleEvents)
  const vesselPrintMode = useSelector(selectVesselPrintMode)
  const [expandedVoyage, toggleExpandedVoyage] = useExpandedVoyages()
  const fitBounds = useMapFitBounds()
  const vesselLayer = useVesselProfileLayer()
  const fitEventBounds = useVesselEventBounds(vesselLayer)
  const virtuosoRef = useRef<GroupedVirtuosoHandle>(null)
  const eventsRef = useRef(new Map<string, HTMLElement>())

  const { events, groupCounts, groups } = useMemo(() => {
    const eventsExpanded = Object.entries(voyages).map(([voyage, events]) => {
      return expandedVoyage === parseInt(voyage) ? events : ([] as ActivityEvent[])
    })
    return {
      events: eventsExpanded.flat(),
      groupCounts: eventsExpanded.map((events) => events.length),
      groups: Object.keys(voyages),
    }
  }, [expandedVoyage, voyages])

  const { selectedEventId, setSelectedEventId, scrollToEvent, handleScroll } = useEventsScroll(
    events,
    eventsRef,
    virtuosoRef
  )

  const handleEventClick = useCallback(
    (event: VesselEvent) => {
      setSelectedEventId(event?.id)
      scrollToEvent(event.id)
      fitEventBounds(event)
    },
    [scrollToEvent, setSelectedEventId, fitEventBounds]
  )

  const selectVoyageOnMap = useCallback(
    (voyageId: ActivityEvent['voyage']) => {
      const events = voyages[voyageId]
      const bounds = eventsToBbox(events)
      fitBounds(bounds)
      if (isSmallScreen) dispatchQueryParams({ sidebarOpen: false })
    },
    [dispatchQueryParams, fitBounds, isSmallScreen, voyages]
  )

  const onEventMapHover = useCallback(
    (event?: VesselEvent) => {
      if (event?.id) {
        dispatch(setHighlightedEvents([event.id]))
      } else {
        dispatch(setHighlightedEvents([]))
      }
    },
    [dispatch]
  )

  const renderedComponent = useMemo(() => {
    if (!groupCounts.length) {
      return (
        <span className={styles.enptyState}>
          {t(
            'vessel.noVoyagesinTimeRange',
            'There are no voyages fully contained in your timerange.'
          )}
        </span>
      )
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
            const expanded = expandedVoyage === index + 1

            return (
              <Fragment>
                <VoyageGroup
                  key={index}
                  expanded={expanded}
                  events={events}
                  onToggleClick={toggleExpandedVoyage}
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
    events,
    expandedVoyage,
    groupCounts,
    groups,
    handleEventClick,
    onEventMapHover,
    handleScroll,
    fitEventBounds,
    selectVoyageOnMap,
    selectedEventId,
    t,
    toggleExpandedVoyage,
    vesselPrintMode,
    voyages,
  ])

  if (visibleEvents !== 'all' && !visibleEvents.includes('port_visit')) {
    return (
      <span className={styles.enptyState}>
        {t('vessel.noVoyagesWithoutPorts', 'Please turn on port visits visibility.')}
      </span>
    )
  }

  return <ul className={styles.activityContainer}>{renderedComponent}</ul>
}

export default ActivityByVoyage
