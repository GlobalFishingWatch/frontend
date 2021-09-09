import { createSelector } from '@reduxjs/toolkit'
import { DateTime, Interval } from 'luxon'
import { EventTypes } from '@globalfishingwatch/api-types'
import { selectFilters } from 'features/event-filters/filters.slice'
import { ActivityEvent } from 'types/activity'
import { selectEventsForTracks, selectFilteredEvents } from '../activity/vessels-activity.selectors'

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

export const selectVoyages = createSelector([selectEventsForTracks], (eventsForTrack) => {
  return eventsForTrack
    .map(({ data }) => {
      const voyages: Voyage[] = (data || [])
        .filter((event: ActivityEvent) => event.type === EventTypes.Port)
        .map(
          (port, index, all) =>
            ({
              ...(index > 0
                ? {
                    from: all[index - 1],
                    start: all[index - 1].end ?? all[index - 1].start,
                  }
                : {}),
              type: 'voyage',
              to: port,
              end: port.start ?? port.end,
              timestamp: (port.start ?? port.end) as number,
            } as Voyage)
        )
      if (voyages.length === 0) return []

      const last = voyages[voyages.length - 1]
      return voyages.concat([
        {
          from: last.to,
          start: last.to?.end ?? last.to?.start,
          timestamp: new Date().getTime(),
          type: 'voyage',
        } as Voyage,
      ])
    })
    .flat()
})

const eventTypePriority: Record<EventTypes | EventTypeVoyage, number> = {
  voyage: 1,
  port_visit: 7,
  fishing: 3,
  encounter: 4,
  loitering: 5,
  gap: 6,
}
export const selectFilteredEventsByVoyages = createSelector(
  [selectFilteredEvents, selectVoyages, selectFilters],
  (filteredEvents, voyages, filters) => {
    // Need to parse the timerange start and end dates in UTC
    // to not exclude events in the boundaries of the range
    // if the user setting the filter is in a timezone with offset != 0
    const startDate = DateTime.fromISO(filters.start, { zone: 'utc' })

    // Setting the time to 23:59:59.99 so the events in that same day
    //  are also displayed
    const endDateUTC = DateTime.fromISO(filters.end, { zone: 'utc' }).toISODate()
    const endDate = DateTime.fromISO(`${endDateUTC}T23:59:59.999Z`, { zone: 'utc' })
    const interval = Interval.fromDateTimes(startDate, endDate)

    const filteredVoyages: Voyage[] = voyages
      .filter((voyage) => {
        if (
          !interval.contains(DateTime.fromMillis((voyage.from?.start ?? 0) as number)) &&
          !interval.contains(DateTime.fromMillis((voyage.from?.end ?? 0) as number)) &&
          !interval.contains(DateTime.fromMillis((voyage.to?.start ?? 0) as number)) &&
          !interval.contains(DateTime.fromMillis((voyage.to?.end ?? 0) as number))
        ) {
          return false
        }

        return true
      })
      .map((voyage) => ({
        ...voyage,
        type: EventTypeVoyage.Voyage,
        start: voyage.start ?? 0,
        end: voyage.end ?? new Date().getTime(),
      }))
      .map((voyage) => ({
        ...voyage,
        visible:
          filteredEvents.filter(
            (event) =>
              (voyage.start < event.start && voyage.end > event.start) ||
              (voyage.start <= event.end && voyage.end >= event.end)
          ).length > 0,
      }))

    return [...filteredEvents, ...filteredVoyages].sort(
      (a, b) =>
        // Sort by event timestamp first
        (b.timestamp ?? (b.start as number)) - (a.timestamp ?? (a.start as number)) ||
        // if equal then sort by event type priority (voyages first)
        eventTypePriority[a.type] - eventTypePriority[b.type]
    )
  }
)
