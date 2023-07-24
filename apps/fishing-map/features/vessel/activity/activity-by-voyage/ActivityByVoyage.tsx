import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { eventsToBbox } from '@globalfishingwatch/data-transforms'
import useViewport from 'features/map/map-viewport.hooks'
import EventDetail from 'features/vessel/activity/event/EventDetail'
import { DEFAULT_VIEWPORT } from 'data/config'
import VoyageGroup from 'features/vessel/activity/activity-by-voyage/VoyageGroup'
import Event from 'features/vessel/activity/event/Event'
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
import styles from '../activity-by-type/activity-by-type.module.css'

const ActivityByVoyage = () => {
  const { t } = useTranslation()
  const voyages = useSelector(selectEventsGroupedByVoyages)
  const dispatch = useAppDispatch()
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
      } else {
        dispatch(disableHighlightedTime())
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
  const voyagesKeys = Object.keys(voyages)
  return (
    <ul className={styles.activityContainer}>
      {voyagesKeys?.length > 0 ? (
        voyagesKeys.map((voyage, index) => {
          const events = voyages[voyage]
          const expanded = expandedVoyages.includes(events[0]?.voyage)
          return (
            <VoyageGroup
              key={index}
              expanded={expanded}
              events={events}
              onToggleClick={toggleExpandedVoyage}
              onMapClick={selectVoyageOnMap}
              onMapHover={onVoyageMapHover}
            >
              {expanded &&
                events.length > 0 &&
                events.map((event) => (
                  <Event
                    key={event.id}
                    event={event}
                    onMapHover={onEventMapHover}
                    onMapClick={selectEventOnMap}
                    onInfoClick={onInfoClick}
                    className={styles.voyageEvent}
                  >
                    {selectedEvent?.id === event?.id && <EventDetail event={event} />}
                  </Event>
                ))}
            </VoyageGroup>
          )
        })
      ) : (
        <span className={styles.enptyState}>
          {t(
            'vessel.noVoyagesinTimeRange',
            'There are no voyages fully contained in your timerange.'
          )}
        </span>
      )}
    </ul>
  )
}

export default ActivityByVoyage
