import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'features/app/app.hooks'
//import { selectResourcesLoading } from 'features/resources/resources.slice'
import { EventTypeVoyage, RenderedVoyage, Voyage } from 'types/voyage'
import { selectVesselDatasetId, selectVesselId, selectFullVesselId } from 'routes/routes.selectors'
import { RenderedEvent } from '../activity/vessels-activity.selectors'
import {
  upsertVesselVoyagesExpanded,
  setVesselVoyagesInitialized,
  VoyagesState,
  selectVoyagesInitialized,
  selectVesselVoyages,
} from './voyages.slice'
import { selectFilteredEventsByVoyages } from './voyages.selectors'

function useVoyagesConnect() {
  const dispatch = useAppDispatch()
  //const eventsLoading = useSelector(selectResourcesLoading)
  const eventsList = useSelector(selectFilteredEventsByVoyages)
  const vesselId = useSelector(selectVesselId)
  const datasetId = useSelector(selectVesselDatasetId)
  const fullVesselId = useSelector(selectFullVesselId)
  const expandedVoyages = useSelector(selectVesselVoyages)
  const initialized = useSelector(selectVoyagesInitialized)

  console.log(expandedVoyages)
  const toggleVoyage = useCallback(
    (voyage: RenderedVoyage) => {
      dispatch(upsertVesselVoyagesExpanded(voyage))
    },
    [dispatch]
  )

  const events: (RenderedEvent | RenderedVoyage)[] = useMemo(() => {
    console.log(eventsList)
    const hasVoyages = !!eventsList.find((event) => event.type === EventTypeVoyage.Voyage)
    console.log(hasVoyages)
    if (!hasVoyages) return eventsList as RenderedEvent[]

    const eventsListParsed = eventsList.map((event) => {
      if (event.type === EventTypeVoyage.Voyage) {
        console.log(event.timestamp)
        return {
          ...event,
          status: expandedVoyages[event.timestamp]
            ? expandedVoyages[event.timestamp].status
            : 'collapsed',
        } as RenderedVoyage
      } else {
        return event as RenderedEvent
      }
    })
    console.log(Object.values(expandedVoyages))
    return eventsListParsed.filter((event) => {
      return (
        event.type === EventTypeVoyage.Voyage ||
        Object.values(expandedVoyages).find(
          (voyage) =>
            voyage.status === 'expanded' &&
            // event timestamp or start is inside the voyage
            voyage.start <= (event.timestamp ?? event.start) &&
            voyage.end >= (event.timestamp ?? event.start)
        )
      )
    })
  }, [eventsList, expandedVoyages])

  useEffect(() => {
    if (initialized || events.length === 0) return

    const lastVoyage = events.find(
      (event) => event.type === EventTypeVoyage.Voyage
    ) as RenderedVoyage
    if (lastVoyage) {
      //dispatch(upsertVesselVoyagesExpanded(lastVoyage))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, expandedVoyages])

  const getVoyageByEvent = useCallback(
    (event: RenderedEvent) => {
      return events.find(
        (voyage) =>
          voyage.type === EventTypeVoyage.Voyage &&
          (event?.timestamp ?? event?.start) >= voyage.start &&
          (event?.timestamp ?? event?.start) <= voyage.end
      ) as RenderedVoyage
    },
    [events]
  )

  const getLastEventInVoyage = useCallback(
    (voyage: Voyage) => {
      return eventsList.find(
        (event) =>
          event?.type !== EventTypeVoyage.Voyage &&
          (event?.timestamp ?? event?.start) >= voyage.start &&
          (event?.timestamp ?? event?.start) <= voyage.end
      ) as RenderedEvent
    },
    [eventsList]
  )

  return {
    //eventsLoading,
    events,
    getLastEventInVoyage,
    getVoyageByEvent,
    toggleVoyage,
  }
}

export default useVoyagesConnect
