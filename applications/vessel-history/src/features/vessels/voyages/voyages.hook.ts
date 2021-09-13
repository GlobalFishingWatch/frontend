import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import { EventTypeVoyage, RenderedVoyage } from 'types/voyage'
import { RenderedEvent } from '../activity/vessels-activity.selectors'
import { selectFilteredEventsByVoyages } from './voyages.selectors'

function useVoyagesConnect() {
  const eventsLoading = useSelector(selectResourcesLoading)
  const eventsList = useSelector(selectFilteredEventsByVoyages)
  const [expandedVoyages, setExpandedVoyages] = useState<
    Record<number, RenderedVoyage | undefined>
  >([])

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
    return eventsList
      .map((event, index, allEvents) => {
        if (event.type === EventTypeVoyage.Voyage) {
          return {
            ...event,
            status: expandedVoyages[event.timestamp] ? 'expanded' : 'collapsed',
            // Mark voyages when they have events to display (no events by default)
            hasEventsToDisplay:
              (allEvents[index + 1]?.type ?? EventTypeVoyage.Voyage) !== EventTypeVoyage.Voyage,
          } as RenderedVoyage
        } else {
          return event as RenderedEvent
        }
      })
      .filter((event) => {
        return (
          (event.type === EventTypeVoyage.Voyage && event.visible) ||
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
    const [lastVoyage] = events.filter((event) => event.type === EventTypeVoyage.Voyage)
    if (lastVoyage)
      setExpandedVoyages({
        [(lastVoyage as RenderedVoyage).timestamp]: lastVoyage as RenderedVoyage,
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return { eventsLoading, events, toggleVoyage }
}

export default useVoyagesConnect
