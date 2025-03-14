import { Fragment, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import type { GroupedVirtuosoHandle } from 'react-virtuoso'
import { GroupedVirtuoso } from 'react-virtuoso'
import cx from 'classnames'

import type { Bbox } from '@globalfishingwatch/data-transforms'
import { eventsToBbox } from '@globalfishingwatch/data-transforms'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'

import { DEFAULT_VIEWPORT } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectVisibleEvents } from 'features/app/selectors/app.selectors'
import { useMapFitBounds } from 'features/map/map-bounds.hooks'
import { useMapViewport, useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import { getScrollElement } from 'features/sidebar/sidebar.utils'
import { ZOOM_LEVEL_TO_FOCUS_EVENT } from 'features/timebar/Timebar'
import { setHighlightedEvents } from 'features/timebar/timebar.slice'
import useExpandedVoyages from 'features/vessel/activity/activity-by-voyage/activity-by-voyage.hook'
import VoyageGroup from 'features/vessel/activity/activity-by-voyage/VoyageGroup'
import type VesselEvent from 'features/vessel/activity/event/Event'
import Event, { EVENT_HEIGHT } from 'features/vessel/activity/event/Event'
import { useEventsScroll } from 'features/vessel/activity/event/event-scroll.hooks'
import EventDetail from 'features/vessel/activity/event/EventDetail'
import type { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { selectEventsGroupedByVoyages } from 'features/vessel/activity/vessels-activity.selectors'
import { selectVesselPrintMode } from 'features/vessel/selectors/vessel.selectors'
import { useVesselProfileLayer } from 'features/vessel/vessel.hooks'
import { selectVesselEventId } from 'features/vessel/vessel.slice'
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
  const fitMapBounds = useMapFitBounds()
  const virtuosoRef = useRef<GroupedVirtuosoHandle>(null)
  const eventsRef = useRef(new Map<string, HTMLElement>())

  const viewport = useMapViewport()
  const setMapCoordinates = useSetMapCoordinates()
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

  const { selectedEventId, setSelectedEventId, scrollToEvent, onRangeChanged } = useEventsScroll(
    events,
    eventsRef,
    virtuosoRef
  )

  const handleEventClick = useCallback(
    (event: VesselEvent) => {
      setSelectedEventId(event?.id)
      scrollToEvent(event.id)
    },
    [scrollToEvent, setSelectedEventId]
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

  // TODO: do we want to keep this?
  // const dispatchSetHighlightedEvents = useDebouncedDispatchHighlightedEvent()
  // const onVoyageMapHover = useCallback(
  //   (voyageId?: ActivityEvent['voyage']) => {
  //     const events = voyages[voyageId as number]
  //     const { start, end } = getVoyageTimeRange(events)
  //     if (start && end) {
  //       dispatch(
  //         setHighlightedTime({
  //           start: getUTCDateTime(start).toISO() as string,
  //           end: getUTCDateTime(end).toISO() as string,
  //         })
  //       )
  //       const eventIds = events.map((event) => event.id)
  //       dispatchSetHighlightedEvents(eventIds)
  //     } else {
  //       dispatch(disableHighlightedTime())
  //       dispatchSetHighlightedEvents(undefined)
  //     }
  //   },
  //   [dispatchSetHighlightedEvents, dispatch, voyages]
  // )

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

  const selectEventOnMap = useCallback(
    (event: VesselEvent) => {
      if (vesselLayer?.instance) {
        const bbox = vesselLayer.instance.getVesselTrackBounds({
          startDate: event.start,
          endDate: event.end,
        })
        if (bbox) {
          fitMapBounds(bbox as Bbox, { padding: 60, fitZoom: true })
        }
      } else {
        const zoom = viewport?.zoom ?? DEFAULT_VIEWPORT.zoom
        setMapCoordinates({
          latitude: event.coordinates?.[1],
          longitude: event.coordinates?.[0],
          zoom: zoom < ZOOM_LEVEL_TO_FOCUS_EVENT ? ZOOM_LEVEL_TO_FOCUS_EVENT : zoom,
        })
      }
      if (isSmallScreen) {
        dispatchQueryParams({ sidebarOpen: false })
      }
    },
    [
      dispatchQueryParams,
      fitMapBounds,
      isSmallScreen,
      setMapCoordinates,
      vesselLayer.instance,
      viewport?.zoom,
    ]
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
                  ></Event>
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
          rangeChanged={onRangeChanged}
          groupContent={(index) => {
            const events = voyages[groups[index] as any]
            if (!events) {
              return null
            }
            const expanded = expandedVoyage === index + 1

            return (
              <VoyageGroup
                key={index}
                expanded={expanded}
                events={events}
                onToggleClick={toggleExpandedVoyage}
                onMapClick={selectVoyageOnMap}
                // onMapHover={onVoyageMapHover}
              />
            )
          }}
          itemContent={(index) => {
            const event = events[index]
            const expanded = selectedEventId ? event?.id.includes(selectedEventId) : false
            return (
              <Event
                key={event.id}
                event={event}
                onMapHover={onEventMapHover}
                eventsRef={eventsRef.current}
                onMapClick={(event, e) => {
                  if (expanded) {
                    e.stopPropagation()
                  }
                  selectEventOnMap(event)
                }}
                onInfoClick={handleEventClick}
                className={cx(styles.event, { [styles.eventExpanded]: expanded })}
              >
                {expanded && <EventDetail event={event} />}
              </Event>
            )
          }}
        />

        {/* TODO: add this height needed to the end dynamic and add content if needed */}
        <div style={{ height: '50vh' }}></div>
      </Fragment>
    )
  }, [
    events,
    expandedVoyage,
    groupCounts,
    groups,
    handleEventClick,
    onEventMapHover,
    onRangeChanged,
    selectEventOnMap,
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
