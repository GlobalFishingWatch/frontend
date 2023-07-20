import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { eventsToBbox } from '@globalfishingwatch/data-transforms'
import { RenderedVoyage } from 'features/vessel/activity/activity-by-voyage/activity-by-voyage.selectors'
import useViewport from 'features/map/map-viewport.hooks'
import EventDetail from 'features/vessel/activity/event/EventDetail'
import { DEFAULT_VIEWPORT } from 'data/config'
import VoyageGroup from 'features/vessel/activity/activity-by-voyage/VoyageGroup'
import EventItem from 'features/vessel/activity/event/Event'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
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
import { selectVoyagesByVessel } from './activity-by-voyage.selectors'

const ActivityByVoyage = () => {
  const events = useSelector(selectVoyagesByVessel)
  const dispatch = useAppDispatch()
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent>()
  const [expandedVoyages, toggleExpandedVoyage] = useExpandedVoyages()
  const fitBounds = useMapFitBounds()

  const onInfoClick = useCallback((event: ActivityEvent) => {
    setSelectedEvent((state) => (state?.id === event.id ? undefined : event))
  }, [])

  const { viewport, setMapCoordinates } = useViewport()

  const selectVoyageOnMap = useCallback(
    (voyage: RenderedVoyage) => {
      const bounds = eventsToBbox(voyage.events)
      fitBounds(bounds)
    },
    [fitBounds]
  )

  const onVoyageMapHover = useCallback(
    (voyage?: RenderedVoyage | ActivityEvent) => {
      if (voyage?.start && voyage?.end) {
        dispatch(
          setHighlightedTime({
            start: getUTCDateTime(voyage.start).toISO(),
            end: getUTCDateTime(voyage.end).toISO(),
          })
        )
      } else {
        dispatch(disableHighlightedTime())
      }
    },
    [dispatch]
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

  return (
    <ul className={styles.activityContainer}>
      {events?.length > 0 &&
        events.map((event, index) => {
          const expanded = expandedVoyages.includes(event.timestamp)
          return (
            <VoyageGroup
              key={index}
              expanded={expanded}
              event={event}
              onToggleClick={toggleExpandedVoyage}
              onMapClick={selectVoyageOnMap}
              onMapHover={onVoyageMapHover}
            >
              {expanded &&
                event.events.length > 0 &&
                event.events.map((event) => (
                  <EventItem
                    key={event.id}
                    event={event}
                    onMapHover={onEventMapHover}
                    onMapClick={selectEventOnMap}
                    onInfoClick={onInfoClick}
                  >
                    {selectedEvent?.id === event?.id && <EventDetail event={event} />}
                  </EventItem>
                ))}
            </VoyageGroup>
          )
        })}
    </ul>
  )
}

export default ActivityByVoyage
