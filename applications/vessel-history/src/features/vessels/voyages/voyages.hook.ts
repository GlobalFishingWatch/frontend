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
    const hasVoyages =
      eventsList.filter((event) => event.type === EventTypeVoyage.Voyage).length > 0
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
    return hasVoyages
      ? eventsListParsed.filter((event) => {
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
      : eventsListParsed
  }, [eventsList, expandedVoyages])

  useEffect(() => {
    if (!expandedByDefaultInitialized || events.length === 0) return

    const [lastVoyage] = events.filter((event) => event.type === EventTypeVoyage.Voyage)
    if (lastVoyage) {
      setExpandedVoyages({
        [(lastVoyage as RenderedVoyage).timestamp]: lastVoyage as RenderedVoyage,
      })
      setExpandedByDefaultInitialized(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, expandedVoyages])

  return { eventsLoading, events, toggleVoyage }
}

export default useVoyagesConnect
