import { DateTime } from 'luxon'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { InteractionEvent } from '@globalfishingwatch/react-hooks'
import { Generators } from '@globalfishingwatch/layer-composer'
import { ApiEvent } from '@globalfishingwatch/api-types/dist'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import useVoyagesConnect from 'features/vessels/voyages/voyages.hook'
import { Range } from 'types'
import { Voyage } from 'types/voyage'
import { DEFAULT_VESSEL_MAP_ZOOM } from 'data/config'
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
  const { getVoyageByEvent, getLastEventInVoyage } = useVoyagesConnect()
  const { viewport, setMapCoordinates } = useViewport()

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
    },
    [currentVoyageTime?.end, currentVoyageTime?.start, dispatch, getVoyageByEvent]
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

  return {
    highlightEvent,
    highlightVoyage,
    selectVesselEventOnClick,
  }
}
