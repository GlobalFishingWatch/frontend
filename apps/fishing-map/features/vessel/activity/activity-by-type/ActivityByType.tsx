import { Fragment, useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import type { GroupedVirtuosoHandle } from 'react-virtuoso'
import { GroupedVirtuoso } from 'react-virtuoso'
import cx from 'classnames'
import { debounce } from 'es-toolkit'

import type { EventType } from '@globalfishingwatch/api-types'
import { EventTypes } from '@globalfishingwatch/api-types'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'

import { DEFAULT_VIEWPORT } from 'data/config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { useMapFitBounds } from 'features/map/map-bounds.hooks'
import { useMapViewport, useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import { getScrollElement } from 'features/sidebar/sidebar.utils'
import { ZOOM_LEVEL_TO_FOCUS_EVENT } from 'features/timebar/Timebar'
import { setHighlightedEvents } from 'features/timebar/timebar.slice'
import { useEventsScroll } from 'features/vessel/activity/event/event-scroll.hooks'
import EventDetail from 'features/vessel/activity/event/EventDetail'
import { selectEventsGroupedByType } from 'features/vessel/activity/vessels-activity.selectors'
import { selectVesselPrintMode } from 'features/vessel/selectors/vessel.selectors'
import { useVesselProfileLayer } from 'features/vessel/vessel.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import type { Bbox } from 'types'

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
  const isSmallScreen = useSmallScreen()
  const activityGroups = useSelector(selectEventsGroupedByType)
  const { dispatchQueryParams } = useLocationConnect()
  const dispatch = useAppDispatch()
  const vesselPrintMode = useSelector(selectVesselPrintMode)
  const [expandedType, toggleExpandedType] = useActivityByType()
  const viewport = useMapViewport()
  const vesselLayer = useVesselProfileLayer()
  const fitMapBounds = useMapFitBounds()
  const setMapCoordinates = useSetMapCoordinates()
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

  const handleEventClick = useCallback(
    (event: VesselEvent) => {
      setSelectedEventId(event.id)
      scrollToEvent(event.id)
    },
    [scrollToEvent, setSelectedEventId]
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

  const selectEventOnMap = useCallback(
    (event: VesselEvent, mode: 'fit' | 'coordinates' = 'fit') => {
      if (!event) {
        return
      }
      if (mode === 'fit' && vesselLayer?.instance) {
        const bbox = vesselLayer.instance.getVesselTrackBounds({
          startDate: event.start,
          endDate: event.end,
        })
        if (bbox) {
          fitMapBounds(bbox as Bbox, { padding: 60, fitZoom: true })
          return
        }
      }
      const zoom = viewport?.zoom ?? DEFAULT_VIEWPORT.zoom
      setMapCoordinates({
        latitude: event.coordinates?.[1],
        longitude: event.coordinates?.[0],
        zoom: zoom < ZOOM_LEVEL_TO_FOCUS_EVENT ? ZOOM_LEVEL_TO_FOCUS_EVENT : zoom,
        transitionDuration: 300,
      })
      if (isSmallScreen) {
        dispatchQueryParams({ sidebarOpen: false })
      }
    },
    [
      dispatchQueryParams,
      fitMapBounds,
      isSmallScreen,
      setMapCoordinates,
      vesselLayer?.instance,
      viewport?.zoom,
    ]
  )

  const debouncedSelectEventOnMap = useMemo(
    () => debounce((event: VesselEvent) => selectEventOnMap(event, 'coordinates'), 600),
    [selectEventOnMap]
  )

  useEffect(() => {
    if (selectedEventId) {
      const event = events.find((event) => event.id.includes(selectedEventId))
      if (event) {
        debouncedSelectEventOnMap(event)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, selectedEventId])

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
            const expanded = selectedEventId ? event?.id.includes(selectedEventId) : false
            return (
              <Event
                event={event}
                onMapHover={onMapHover}
                eventsRef={eventsRef.current}
                onMapClick={(event, e) => {
                  if (expanded) {
                    e.stopPropagation()
                  }
                  selectEventOnMap(event)
                }}
                onInfoClick={handleEventClick}
                className={cx(styles.event, { [styles.eventExpanded]: expanded })}
                testId={`vv-${event.type}-event-${index}`}
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
    selectEventOnMap,
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
