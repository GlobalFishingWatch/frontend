import { createSelector } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { EventTypes } from '@globalfishingwatch/api-types'
import {
  ActivityEvent,
  PortVisitSubEvent,
} from 'features/vessel/activity/vessels-activity.selectors'
import { selectTimeRange } from 'features/app/app.selectors'
import { selectFilteredEvents } from '../vessels-activity.selectors'

export enum EventTypeVoyage {
  Voyage = 'voyage',
}

export interface Voyage {
  from?: ActivityEvent
  to?: ActivityEvent
  type: EventTypeVoyage
  start: number
  end: number
  timestamp: number
}

export interface RenderedVoyage extends Voyage {
  eventsQuantity: number
  events: ActivityEvent[]
}

export const selectFilteredEventsWithSplitPorts = createSelector(
  [selectFilteredEvents],
  (events) => {
    const splitEvents: ActivityEvent[] = []
    events.forEach((event) => {
      if (event.type !== EventTypes.Port) {
        splitEvents.push(event)
      } else {
        splitEvents.push({
          ...event,
          id: `${event.id}-${PortVisitSubEvent.Entry}`,
          subEvent: PortVisitSubEvent.Entry,
        })
        splitEvents.push({
          ...event,
          timestamp: event.end as number,
          // Important: To display port exits in map it's necessary
          // to override start timestamp because that's used to
          //  filter events when highlightTime is set
          start: event.end as number,
          id: `${event.id}-${PortVisitSubEvent.Exit}`,
          subEvent: PortVisitSubEvent.Exit,
        })
      }
    })
    return splitEvents
  }
)

export const selectVoyages = createSelector(
  [selectFilteredEventsWithSplitPorts, selectTimeRange],
  (events, timeRange) => {
    const voyages: Voyage[] = events
      .reverse()
      .filter(
        (event: ActivityEvent) => event.type === EventTypes.Port && event.id.endsWith('-exit')
      )
      .map((port, index, all) => {
        return {
          ...(index > 0
            ? {
                from: all[index - 1],
                start: all[index - 1].end ?? all[index - 1].start,
              }
            : {
                start: DateTime.fromISO(timeRange.start as string, { zone: 'utc' }).toMillis(),
              }),
          type: EventTypeVoyage.Voyage,
          to: port,
          // Important: Substracting 1ms to not overlap with range of the previous voyage
          end: ((port.end ?? port.start) as number) - 1,
          // Important: Substracting 1ms to not overlap with timestamp port visit events on sorting
          timestamp: ((port.end ?? port.start) as number) - 1,
        } as Voyage
      })
    if (voyages.length === 0) return []

    const last = voyages[voyages.length - 1]

    voyages.push({
      from: last.to,
      start: last.end ?? last.start,
      timestamp: DateTime.fromISO(timeRange.end as string, { zone: 'utc' }).toMillis(),
      type: EventTypeVoyage.Voyage,
      end: DateTime.fromISO(timeRange.end as string, { zone: 'utc' }).toMillis(),
    } as Voyage)

    return voyages.sort((a, b) => (b.start as number) - (a.start as number))
  }
)

const getVoyagesWithEventsInside = (
  events: ActivityEvent[],
  voyages: Voyage[]
): RenderedVoyage[] => {
  if (!voyages?.length) {
    return []
  }
  const filteredVoyages: RenderedVoyage[] = voyages.map((voyage) => {
    return {
      ...voyage,
      status: 'collapsed',
      type: EventTypeVoyage.Voyage,
      start: voyage.start ?? 0,
      end: voyage.end ?? new Date().getTime(),
      events: [],
      eventsQuantity: 0,
    }
  })

  events
    .sort((a, b) => (b.timestamp ?? (b.start as number)) - (a.timestamp ?? (a.start as number)))
    .forEach((event, i) => {
      const index = filteredVoyages.findIndex((voyage) => {
        return (
          voyage.start <= (event.timestamp ?? event.end) &&
          voyage.end >= (event.timestamp ?? event.end)
        )
      })
      if (index !== -1) {
        filteredVoyages[index].events.push(event)
        filteredVoyages[index].eventsQuantity++
      }
    })

  return filteredVoyages.sort(
    (a, b) =>
      // Sort by event timestamp first
      (b.timestamp ?? (b.start as number)) - (a.timestamp ?? (a.start as number))
  )
}

export const selectVoyagesByVessel = createSelector(
  [selectFilteredEventsWithSplitPorts, selectVoyages],
  (eventsList, voyages) => {
    return getVoyagesWithEventsInside(eventsList, voyages)
  }
)
