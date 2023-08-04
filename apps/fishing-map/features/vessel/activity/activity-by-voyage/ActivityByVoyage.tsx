import { Fragment, useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { GroupedVirtuoso } from 'react-virtuoso'
import { eventsToBbox } from '@globalfishingwatch/data-transforms'
import useViewport from 'features/map/map-viewport.hooks'
import EventDetail from 'features/vessel/activity/event/EventDetail'
import { DEFAULT_VIEWPORT } from 'data/config'
import VoyageGroup from 'features/vessel/activity/activity-by-voyage/VoyageGroup'
import Event, { EVENT_HEIGHT } from 'features/vessel/activity/event/Event'
import { getVoyageTimeRange } from 'features/vessel/vessel.utils'
import {
  ActivityEvent,
  selectEventsGroupedByVoyages,
} from 'features/vessel/activity/vessels-activity.selectors'
import useExpandedVoyages from 'features/vessel/activity/activity-by-voyage/activity-by-voyage.hook'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import {
  disableHighlightedTime,
  setHighlightedEvents,
  setHighlightedTime,
} from 'features/timebar/timebar.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { getUTCDateTime } from 'utils/dates'
import { getScrollElement } from 'features/sidebar/Sidebar'
import { selectVisibleEvents } from 'features/app/app.selectors'
import { selectVesselPrintMode } from 'features/vessel/vessel.slice'
import styles from '../ActivityGroupedList.module.css'

const ActivityByVoyage = () => {
  const { t } = useTranslation()
  const voyages = useSelector(selectEventsGroupedByVoyages)
  const dispatch = useAppDispatch()
  const visibleEvents = useSelector(selectVisibleEvents)
  const vesselPrintMode = useSelector(selectVesselPrintMode)
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent>()
  const [expandedVoyages, toggleExpandedVoyage] = useExpandedVoyages()
  const fitBounds = useMapFitBounds()

  const onInfoClick = useCallback((event: ActivityEvent) => {
    setSelectedEvent((state) => (state?.id === event.id ? undefined : event))
  }, [])

  const { viewport, setMapCoordinates } = useViewport()

  const selectVoyageOnMap = useCallback(
    (voyageId: ActivityEvent['voyage']) => {
      const events = voyages[voyageId]
      const bounds = eventsToBbox(events)
      fitBounds(bounds)
    },
    [fitBounds, voyages]
  )

  const onVoyageMapHover = useCallback(
    (voyageId: ActivityEvent['voyage']) => {
      const events = voyages[voyageId]
      const { start, end } = getVoyageTimeRange(events)
      if (start && end) {
        dispatch(
          setHighlightedTime({
            start: getUTCDateTime(start).toISO(),
            end: getUTCDateTime(end).toISO(),
          })
        )
        const eventIds = events.map((event) => event.id)
        dispatch(setHighlightedEvents(eventIds))
      } else {
        dispatch(disableHighlightedTime())
        dispatch(setHighlightedEvents(undefined))
      }
    },
    [dispatch, voyages]
  )

  const onEventMapHover = useCallback(
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

  console.log('🚀 ~ const{events,groupCounts,groups}=useMemo ~ voyages:', voyages)
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
              <Fragment>
                <VoyageGroup
                  key={voyage}
                  expanded
                  events={events}
                  onToggleClick={toggleExpandedVoyage}
                  onMapClick={selectVoyageOnMap}
                  onMapHover={onVoyageMapHover}
                />
                {events.map((event) => (
                  <Event
                    key={event.id}
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
          const events = voyages[groups[index]]
          if (!events) {
            return null
          }
          const expanded = expandedVoyages.includes(index)
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
