import { DateTime } from 'luxon'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { InteractionEvent } from '@globalfishingwatch/react-hooks'
import { Generators } from '@globalfishingwatch/layer-composer'
import { ApiEvent } from '@globalfishingwatch/api-types/dist'
import {
  RenderedEvent,
  selectFilteredEvents,
} from 'features/vessels/activity/vessels-activity.selectors'
import useVoyagesConnect from 'features/vessels/voyages/voyages.hook'
import { Range } from 'types'
import { Voyage } from 'types/voyage'
import { DEFAULT_VESSEL_MAP_ZOOM } from 'data/config'
import { resetFilters, selectFilters } from 'features/event-filters/filters.slice'
import {
  selectHighlightedEvent,
  selectMapVoyageTime,
  setHighlightedEvent,
  setVoyageTime,
} from './map.slice'
import useViewport from './map-viewport.hooks'

export default function useMapEvents() {
  const dispatch = useDispatch()
  const highlightedEvent = useSelector(selectHighlightedEvent)
  const currentVoyageTime = useSelector(selectMapVoyageTime)
  const events = useSelector(selectFilteredEvents)
  const { getVoyageByEvent, getLastEventInVoyage } = useVoyagesConnect()
  const { viewport, setMapCoordinates } = useViewport()
  const [findEventVoyage, setFindEventVoyage] = useState<RenderedEvent>()
  const filters = useSelector(selectFilters)
  const [prevFilters, setPrevFilters] = useState(filters)

  const selectVesselEventOnClick = useCallback(
    (event: InteractionEvent | null) => {
      const features = event?.features ?? []

      const vesselFeature = features.find(
        (feature) => feature.generatorType === Generators.Type.VesselEvents
      )
      const highlightEvent: { id: string } | undefined = { id: vesselFeature?.properties.id }

      if (highlightEvent && highlightedEvent?.id !== highlightEvent.id) {
        dispatch(setHighlightedEvent(highlightEvent as any))
      }
    },
    [dispatch, highlightedEvent?.id]
  )

  const highlightEvent = useCallback(
    (event: RenderedEvent) => {
      if (!event?.id) return
      dispatch(setHighlightedEvent({ id: event.id } as ApiEvent))

      const voyage = getVoyageByEvent(event)
      if (!voyage) {
        dispatch(resetFilters())
      }
      setFindEventVoyage(event)
    },
    [dispatch, getVoyageByEvent]
  )

  const highlightVoyage = useCallback(
    (voyage: Voyage) => {
      if (!voyage) return
      const voyageTimes = {
        start: DateTime.fromMillis(voyage.start).toUTC().toISO(),
        end: DateTime.fromMillis(voyage.end).toUTC().toISO(),
      } as Range
      if (
        voyageTimes.start === currentVoyageTime?.start &&
        voyageTimes.end === currentVoyageTime?.end
      )
        return

      const lastEvent = getLastEventInVoyage(voyage)
      if (lastEvent) {
        dispatch(setHighlightedEvent({ id: lastEvent.id } as ApiEvent))

        setMapCoordinates({
          latitude: lastEvent.position.lat,
          longitude: lastEvent.position.lon,
          zoom: viewport.zoom ?? DEFAULT_VESSEL_MAP_ZOOM,
          bearing: 0,
          pitch: 0,
        })
      }

      dispatch(setVoyageTime(voyageTimes))
    },
    [
      currentVoyageTime?.end,
      currentVoyageTime?.start,
      dispatch,
      getLastEventInVoyage,
      setMapCoordinates,
      viewport.zoom,
    ]
  )

  // When the highlighted event was not in the filtered events list
  // filters are reset so that the event voyage
  // is found and highlighted
  useEffect(() => {
    if (!findEventVoyage) return
    const voyage = getVoyageByEvent(findEventVoyage)
    if (!voyage) return
    const voyageTimes = {
      start: DateTime.fromMillis(voyage.start).toUTC().toISO(),
      end: DateTime.fromMillis(voyage.end).toUTC().toISO(),
    } as Range
    if (
      voyageTimes.start === currentVoyageTime?.start &&
      voyageTimes.end === currentVoyageTime?.end
    )
      return

    dispatch(setVoyageTime(voyageTimes))
    setFindEventVoyage(undefined)
  }, [
    currentVoyageTime?.end,
    currentVoyageTime?.start,
    dispatch,
    findEventVoyage,
    getVoyageByEvent,
  ])

  const onFiltersChanged = useCallback(() => {
    if (!highlightedEvent) return
    const highlightedRenderedEvent = events.find((event) => event.id === highlightedEvent?.id)

    if (!highlightedRenderedEvent) {
      const [lastEvent] = events
      lastEvent && highlightEvent(lastEvent)
    }
  }, [events, highlightEvent, highlightedEvent])

  useEffect(() => {
    if (JSON.stringify(prevFilters) !== JSON.stringify(filters)) {
      if (!findEventVoyage) onFiltersChanged()
      setPrevFilters(filters)
    }
  }, [filters, findEventVoyage, onFiltersChanged, prevFilters])

  return {
    highlightEvent,
    highlightVoyage,
    selectVesselEventOnClick,
  }
}
