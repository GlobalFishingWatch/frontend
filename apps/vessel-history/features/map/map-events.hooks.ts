import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { Range } from 'types'

import type { ApiEvent } from '@globalfishingwatch/api-types'
import type { ExtendedFeature, InteractionEvent } from '@globalfishingwatch/layer-composer';
import { GeneratorType } from '@globalfishingwatch/layer-composer'

import { DEFAULT_VESSEL_MAP_ZOOM } from 'data/config'
import { resetFilters } from 'features/event-filters/filters.slice'
import type {
  RenderedEvent} from 'features/vessels/activity/vessels-activity.selectors';
import {
  selectFilteredEvents,
} from 'features/vessels/activity/vessels-activity.selectors'
import useVoyagesConnect from 'features/vessels/voyages/voyages.hook'
import { useLocationConnect } from 'routes/routes.hook'
import type { Voyage } from 'types/voyage'
import { getUTCDateTime } from 'utils/dates'

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
  const { dispatchQueryParams } = useLocationConnect()
  const [clickedLayers, setClickedLayers] = useState<ExtendedFeature[] | null>()

  const selectVesselEventOnClick = useCallback(
    (event: InteractionEvent | null) => {
      const features = event?.features ?? []
      const vesselFeature = features.find(
        (feature) => feature.generatorType === GeneratorType.VesselEvents
      )
      setClickedLayers(!vesselFeature ? features : null)
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
        start: getUTCDateTime(voyage.start).toISO(),
        end: getUTCDateTime(voyage.end).toISO(),
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
      dispatchQueryParams({ start: voyageTimes.start, end: voyageTimes.end })
    },
    [
      currentVoyageTime?.end,
      currentVoyageTime?.start,
      dispatch,
      dispatchQueryParams,
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
      start: getUTCDateTime(voyage.start).toISO(),
      end: getUTCDateTime(voyage.end).toISO(),
    } as Range
    if (
      voyageTimes.start === currentVoyageTime?.start &&
      voyageTimes.end === currentVoyageTime?.end
    )
      return

    dispatch(setVoyageTime(voyageTimes))
    dispatchQueryParams({ start: voyageTimes.start, end: voyageTimes.end })
    setFindEventVoyage(undefined)
  }, [
    currentVoyageTime?.end,
    currentVoyageTime?.start,
    dispatch,
    dispatchQueryParams,
    findEventVoyage,
    getVoyageByEvent,
  ])

  const onFiltersChanged = useCallback(() => {
    if (!highlightedEvent || findEventVoyage) return
    const highlightedRenderedEvent = events.find((event) => event.id === highlightedEvent?.id)

    if (!highlightedRenderedEvent) {
      const [lastEvent] = events
      if (lastEvent) {
        highlightEvent(lastEvent)

        setMapCoordinates({
          latitude: lastEvent.position.lat,
          longitude: lastEvent.position.lon,
          zoom: viewport.zoom ?? DEFAULT_VESSEL_MAP_ZOOM,
          bearing: 0,
          pitch: 0,
        })
      }
    }
  }, [events, findEventVoyage, highlightEvent, highlightedEvent, setMapCoordinates, viewport.zoom])

  return {
    clickedLayers,
    highlightEvent,
    highlightVoyage,
    selectVesselEventOnClick,
    onFiltersChanged,
  }
}
