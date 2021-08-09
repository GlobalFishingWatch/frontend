import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { InteractionEvent } from '@globalfishingwatch/react-hooks'
import { Generators } from '@globalfishingwatch/layer-composer'
import { selectHighlightedEvent, setHighlightedEvent } from './map.slice'

export default function useMapEvents() {
  const dispatch = useDispatch()
  const highlightedEvent = useSelector(selectHighlightedEvent)

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

  return {
    selectVesselEventOnClick,
  }
}
