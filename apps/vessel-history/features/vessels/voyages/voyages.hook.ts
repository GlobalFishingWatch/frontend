import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import { EventTypeVoyage, RenderedVoyage, Voyage } from 'types/voyage'
import { selectMergedVesselId } from 'routes/routes.selectors'
import { RenderedEvent } from '../activity/vessels-activity.selectors'
import {
  upsertVesselVoyagesExpanded,
  setVesselVoyagesInitialized,
  VoyagesState,
} from '../vessels.slice'
import { selectCurrentVesselVoyagesState } from '../vessels.selectors'
import { selectFilteredEventsByVoyages } from './voyages.selectors'

function useVoyagesConnect() {
  const dispatch = useAppDispatch()
  const eventsLoading = useSelector(selectResourcesLoading)
  const eventsList = useSelector(selectFilteredEventsByVoyages)
  const mergedVesselId = useSelector(selectMergedVesselId)
  const { expanded: expandedVoyages, initialized }: VoyagesState = {
    ...(useSelector(selectCurrentVesselVoyagesState) ?? { expanded: {}, initialized: false }),
  }

  const toggleVoyage = useCallback(
    (voyage: RenderedVoyage) => {
      dispatch(
        upsertVesselVoyagesExpanded({
          [mergedVesselId]: {
            ...expandedVoyages,
            [voyage.timestamp]: expandedVoyages[voyage.timestamp] ? undefined : voyage,
          },
        })
      )
    },
    [dispatch, expandedVoyages, mergedVesselId]
  )
  const eventsExpanded = useMemo(() => {
    const hasVoyages = !!eventsList.find((event) => event.type === EventTypeVoyage.Voyage)
    if (!hasVoyages) return eventsList as RenderedEvent[]

    return eventsList.map((event) => {
      if (event.type === EventTypeVoyage.Voyage) {
        return {
          ...event,
          status: expandedVoyages[event.timestamp] ? 'expanded' : 'collapsed',
        } as RenderedVoyage
      } else {
        return event as RenderedEvent
      }
    })

  }, [eventsList, expandedVoyages])

  const events: (RenderedEvent | RenderedVoyage)[] = useMemo(() => {
    return eventsExpanded.filter((event) => {
      return (
        event.type === EventTypeVoyage.Voyage ||
        Object.values(expandedVoyages).find(
          (voyage) =>
            voyage !== undefined &&
            // event timestamp or start is inside the voyage
            voyage.start <= (event.timestamp ?? event.start) &&
            voyage.end >= (event.timestamp ?? event.start)
        )
      )
    })
  }, [eventsExpanded, expandedVoyages])

  useEffect(() => {
    if (initialized || events.length === 0) return

    const lastVoyage = events.find(
      (event) => event.type === EventTypeVoyage.Voyage
    ) as RenderedVoyage
    if (lastVoyage) {
      dispatch(
        upsertVesselVoyagesExpanded({
          [mergedVesselId]: {
            [lastVoyage.timestamp]: lastVoyage as RenderedVoyage,
          },
        })
      )
      dispatch(setVesselVoyagesInitialized({ [mergedVesselId]: true }))
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

  return { eventsLoading, events, eventsExpanded, getLastEventInVoyage, getVoyageByEvent, toggleVoyage }
}

export default useVoyagesConnect
