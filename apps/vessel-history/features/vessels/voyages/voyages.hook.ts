import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import { selectMergedVesselId } from 'routes/routes.selectors'
import type { RenderedVoyage, Voyage } from 'types/voyage';
import { EventTypeVoyage } from 'types/voyage'

import type { RenderedEvent } from '../activity/vessels-activity.selectors'
import { selectCurrentVesselVoyagesState } from '../vessels.selectors'
import type {
  VoyagesState} from '../vessels.slice';
import {
  setVesselVoyagesInitialized,
  upsertVesselVoyagesExpanded} from '../vessels.slice'

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
            voyage.start <= (event.timestamp ?? (event.start as number)) &&
            voyage.end >= (event.timestamp ?? (event.start as number))
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
      dispatch(
        upsertVesselVoyagesExpanded({
          [mergedVesselId]: {
            [lastVoyage.timestamp]: lastVoyage as RenderedVoyage,
          },
        })
      )
      dispatch(setVesselVoyagesInitialized({ [mergedVesselId]: true }))
    }
     
  }, [events, expandedVoyages])

  const getVoyageByEvent = useCallback(
    (event: RenderedEvent) => {
      return events.find(
        (voyage) =>
          voyage.type === EventTypeVoyage.Voyage &&
          (event?.timestamp ?? (event?.start as number)) >= voyage.start &&
          (event?.timestamp ?? (event?.start as number)) <= voyage.end
      ) as RenderedVoyage
    },
    [events]
  )

  const getLastEventInVoyage = useCallback(
    (voyage: Voyage) => {
      return eventsList.find(
        (event) =>
          event?.type !== EventTypeVoyage.Voyage &&
          (event?.timestamp ?? (event?.start as number)) >= voyage.start &&
          (event?.timestamp ?? (event?.start as number)) <= voyage.end
      ) as RenderedEvent
    },
    [eventsList]
  )

  return {
    eventsLoading,
    events,
    getLastEventInVoyage,
    getVoyageByEvent,
    toggleVoyage,
  }
}

export default useVoyagesConnect
