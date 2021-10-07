import { useCallback, useEffect, useMemo, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import { EventTypeVoyage, RenderedVoyage, Voyage } from 'types/voyage'
import { RenderedEvent } from '../activity/vessels-activity.selectors'
import { selectFilteredEventsByVoyages } from './voyages.selectors'

function useVoyagesConnect() {
  const eventsLoading = useSelector(selectResourcesLoading, shallowEqual)
  const eventsList = useSelector(selectFilteredEventsByVoyages, shallowEqual)
  const [expandedVoyages, setExpandedVoyages] = useState<
    Record<number, RenderedVoyage | undefined>
  >([])
  const [expandedByDefaultInitialized, setExpandedByDefaultInitialized] = useState(false)

  const toggleVoyage = useCallback(
    (voyage: RenderedVoyage) => {
      setExpandedVoyages({
        ...expandedVoyages,
        [voyage.timestamp]: expandedVoyages[voyage.timestamp] ? undefined : voyage,
      })
    },
    [expandedVoyages]
  )

  const events: (RenderedEvent | RenderedVoyage)[] = useMemo(() => {
    const hasVoyages = !!eventsList.find((event) => event.type === EventTypeVoyage.Voyage)
    if (!hasVoyages) return eventsList as RenderedEvent[]

    const eventsListParsed = eventsList.map((event) => {
      if (event.type === EventTypeVoyage.Voyage) {
        return {
          ...event,
          status: expandedVoyages[event.timestamp] ? 'expanded' : 'collapsed',
        } as RenderedVoyage
      } else {
        return event as RenderedEvent
      }
    })

    return eventsListParsed.filter((event) => {
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
  }, [eventsList, expandedVoyages])

  useEffect(() => {
    if (expandedByDefaultInitialized || events.length === 0) return

    const lastVoyage = events.find(
      (event) => event.type === EventTypeVoyage.Voyage
    ) as RenderedVoyage
    if (lastVoyage) {
      setExpandedVoyages({
        [lastVoyage.timestamp]: lastVoyage as RenderedVoyage,
      })
      setExpandedByDefaultInitialized(true)
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

  return { eventsLoading, events, getLastEventInVoyage, getVoyageByEvent, toggleVoyage }
}

export default useVoyagesConnect
