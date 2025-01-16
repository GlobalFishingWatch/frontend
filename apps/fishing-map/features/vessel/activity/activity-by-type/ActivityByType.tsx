import { Fragment, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { GroupedVirtuoso } from 'react-virtuoso'

import type { EventType } from '@globalfishingwatch/api-types'
import { EventTypes } from '@globalfishingwatch/api-types'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'

import { DEFAULT_VIEWPORT } from 'data/config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { useMapViewport, useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import { getScrollElement } from 'features/sidebar/sidebar.utils'
import { ZOOM_LEVEL_TO_FOCUS_EVENT } from 'features/timebar/Timebar'
import { setHighlightedEvents } from 'features/timebar/timebar.slice'
import EventDetail from 'features/vessel/activity/event/EventDetail'
import {
  ActivityEvent,
  selectEventsGroupedByType,
} from 'features/vessel/activity/vessels-activity.selectors'
import { selectVesselPrintMode } from 'features/vessel/selectors/vessel.selectors'
import { useLocationConnect } from 'routes/routes.hook'

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
  const setMapCoordinates = useSetMapCoordinates()
  const [selectedEvent, setSelectedEvent] = useState<VesselEvent>()

  const onInfoClick = useCallback((event: VesselEvent) => {
    setSelectedEvent((state) => (state?.id === event.id ? undefined : event))
  }, [])

  const onToggleExpandedType = useCallback(
    (event: EventType) => {
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
        // TODO
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
                    onMapHover={onMapHover}
                    onMapClick={selectEventOnMap}
                    onInfoClick={onInfoClick}
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
              className={styles.event}
              testId={`vv-${event.type}-event-${index}`}
            >
              {selectedEvent?.id === event?.id && <EventDetail event={selectedEvent} />}
            </Event>
          )
        }}
      />
    )
  }, [
    activityGroups,
    events,
    expandedType,
    groupCounts,
    groups,
    onInfoClick,
    onMapHover,
    onToggleExpandedType,
    selectEventOnMap,
    selectedEvent,
    vesselPrintMode,
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
