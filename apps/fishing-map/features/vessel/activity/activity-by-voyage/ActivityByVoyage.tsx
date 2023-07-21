import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { eventsToBbox } from '@globalfishingwatch/data-transforms'
import { RenderedVoyage } from 'features/vessel/activity/activity-by-voyage/activity-by-voyage.selectors'
import useViewport from 'features/map/map-viewport.hooks'
import EventDetail from 'features/vessel/activity/event/EventDetail'
import { DEFAULT_VIEWPORT } from 'data/config'
import VoyageGroup from 'features/vessel/activity/activity-by-voyage/VoyageGroup'
import Event from 'features/vessel/activity/event/Event'
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
  const { t } = useTranslation()
  const voyages = useSelector(selectVoyagesByVessel)
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
      {voyages?.length > 0 ? (
        voyages.map((voyage, index) => {
          const expanded = expandedVoyages.includes(voyage.timestamp)
          return (
            <VoyageGroup
              key={index}
              expanded={expanded}
              voyage={voyage}
              onToggleClick={toggleExpandedVoyage}
              onMapClick={selectVoyageOnMap}
              onMapHover={onVoyageMapHover}
            >
              {expanded &&
                voyage.events.length > 0 &&
                voyage.events.map((event) => (
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
