import { Fragment, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { GroupedVirtuoso } from 'react-virtuoso'

import { eventsToBbox } from '@globalfishingwatch/data-transforms'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'

import { DEFAULT_VIEWPORT } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectVisibleEvents } from 'features/app/selectors/app.selectors'
import { useMapFitBounds } from 'features/map/map-bounds.hooks'
import { useDebouncedDispatchHighlightedEvent } from 'features/map/map-interactions.hooks'
import { useMapViewport, useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import { getScrollElement } from 'features/sidebar/sidebar.utils'
import { ZOOM_LEVEL_TO_FOCUS_EVENT } from 'features/timebar/Timebar'
import {
  disableHighlightedTime,
  setHighlightedEvents,
  setHighlightedTime,
} from 'features/timebar/timebar.slice'
import useExpandedVoyages from 'features/vessel/activity/activity-by-voyage/activity-by-voyage.hook'
import VoyageGroup from 'features/vessel/activity/activity-by-voyage/VoyageGroup'
import type VesselEvent from 'features/vessel/activity/event/Event'
import Event, { EVENT_HEIGHT } from 'features/vessel/activity/event/Event'
import EventDetail from 'features/vessel/activity/event/EventDetail'
import type { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { selectEventsGroupedByVoyages } from 'features/vessel/activity/vessels-activity.selectors'
import { selectVesselPrintMode } from 'features/vessel/selectors/vessel.selectors'
import { getVoyageTimeRange } from 'features/vessel/vessel.utils'
import { useLocationConnect } from 'routes/routes.hook'
import { getUTCDateTime } from 'utils/dates'

import styles from '../ActivityGroupedList.module.css'

const ActivityByVoyage = () => {
  const { t } = useTranslation()
  const voyages = useSelector(selectEventsGroupedByVoyages)
  const dispatch = useAppDispatch()

  const isSmallScreen = useSmallScreen()
  const { dispatchQueryParams } = useLocationConnect()
  const visibleEvents = useSelector(selectVisibleEvents)
  const vesselPrintMode = useSelector(selectVesselPrintMode)
  const [selectedEvent, setSelectedEvent] = useState<VesselEvent>()
  const [expandedVoyages, toggleExpandedVoyage] = useExpandedVoyages()
  const fitBounds = useMapFitBounds()

  const onInfoClick = useCallback((event: VesselEvent) => {
    setSelectedEvent((state) => (state?.id === event.id ? undefined : event))
  }, [])

  const viewport = useMapViewport()
  const setMapCoordinates = useSetMapCoordinates()

  const selectVoyageOnMap = useCallback(
    (voyageId: ActivityEvent['voyage']) => {
      const events = voyages[voyageId]
      const bounds = eventsToBbox(events)
      fitBounds(bounds)
      if (isSmallScreen) dispatchQueryParams({ sidebarOpen: false })
    },
    [dispatchQueryParams, fitBounds, isSmallScreen, voyages]
  )

  const dispatchSetHighlightedEvents = useDebouncedDispatchHighlightedEvent()

  const onVoyageMapHover = useCallback(
    (voyageId?: ActivityEvent['voyage']) => {
      const events = voyages[voyageId as number]
      const { start, end } = getVoyageTimeRange(events)
      if (start && end) {
        dispatch(
          setHighlightedTime({
            start: getUTCDateTime(start).toISO() as string,
            end: getUTCDateTime(end).toISO() as string,
          })
        )
        const eventIds = events.map((event) => event.id)
        dispatchSetHighlightedEvents(eventIds)
      } else {
        dispatch(disableHighlightedTime())
        dispatchSetHighlightedEvents(undefined)
      }
    },
    [dispatchSetHighlightedEvents, dispatch, voyages]
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

  const selectEventOnMap = useCallback(
    (event: VesselEvent) => {
      if (viewport?.zoom) {
        const zoom = viewport.zoom ?? DEFAULT_VIEWPORT.zoom
        setMapCoordinates({
          latitude: event.coordinates?.[1],
          longitude: event.coordinates?.[0],
          zoom: zoom < ZOOM_LEVEL_TO_FOCUS_EVENT ? ZOOM_LEVEL_TO_FOCUS_EVENT : zoom,
        })
        if (isSmallScreen) dispatchQueryParams({ sidebarOpen: false })
      }
    },
    [dispatchQueryParams, isSmallScreen, setMapCoordinates, viewport?.zoom]
  )

  const { events, groupCounts, groups } = useMemo(() => {
    const eventsExpanded = Object.entries(voyages).map(([voyage, events]) => {
      return expandedVoyages.includes(parseInt(voyage)) ? events : ([] as ActivityEvent[])
    })
    return {
      events: eventsExpanded.flat(),
      groupCounts: eventsExpanded.map((events) => events.length),
      groups: Object.keys(voyages),
    }
  }, [expandedVoyages, voyages])

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
                <VoyageGroup
                  key={`${voyage}-group`}
                  expanded
                  events={events}
                  onToggleClick={toggleExpandedVoyage}
                  onMapClick={selectVoyageOnMap}
                  onMapHover={onVoyageMapHover}
                />
                {events.map((event, index) => (
                  <Event
                    key={`${voyage}-${index}-${event.id}`}
                    event={event}
                    onMapHover={onEventMapHover}
                    onMapClick={selectEventOnMap}
                    onInfoClick={onInfoClick}
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
      <GroupedVirtuoso
        useWindowScroll
        defaultItemHeight={EVENT_HEIGHT}
        groupCounts={groupCounts}
        increaseViewportBy={EVENT_HEIGHT * 4}
        customScrollParent={getScrollElement()}
        groupContent={(index) => {
          const events = voyages[groups[index] as any]
          if (!events) {
            return null
          }
          const expanded = expandedVoyages.includes(index + 1)
          return (
            <VoyageGroup
              key={index}
              expanded={expanded}
              events={events}
              onToggleClick={toggleExpandedVoyage}
              onMapClick={selectVoyageOnMap}
              onMapHover={onVoyageMapHover}
            />
          )
        }}
        itemContent={(index) => {
          const event = events[index]
          return (
            <Event
              key={event.id}
              event={event}
              onMapHover={onEventMapHover}
              onMapClick={selectEventOnMap}
              onInfoClick={onInfoClick}
              className={styles.event}
            >
              {selectedEvent?.id === event?.id && <EventDetail event={event} />}
            </Event>
          )
        }}
      />
    )
  }, [
    events,
    expandedVoyages,
    groupCounts,
    groups,
    onEventMapHover,
    onInfoClick,
    onVoyageMapHover,
    selectEventOnMap,
    selectVoyageOnMap,
    selectedEvent?.id,
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
