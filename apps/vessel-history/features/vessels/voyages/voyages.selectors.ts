import { createSelector } from '@reduxjs/toolkit'
import { Interval } from 'luxon'

import { EventTypes } from '@globalfishingwatch/api-types'

import { DEFAULT_WORKSPACE } from 'data/config'
import type { Filters} from 'features/event-filters/filters.slice';
import { selectFilters } from 'features/event-filters/filters.slice'
import type { ActivityEvent } from 'types/activity'
import type { Voyage} from 'types/voyage';
import { EventTypeVoyage } from 'types/voyage'
import { getUTCDateTime } from 'utils/dates'

import type {
  RenderedEvent} from '../activity/vessels-activity.selectors';
import {
  selectEvents,
  selectEventsForTracks,
  selectFilteredEvents,
} from '../activity/vessels-activity.selectors'

export const selectVoyages = createSelector([selectEventsForTracks], (eventsForTrack) => {
  return eventsForTrack
    .map(({ data }) => {
      const voyages: Voyage[] = (data || [])
        .filter(
          (event: ActivityEvent) => event.type === EventTypes.Port && event.id.endsWith('-exit')
        )
        .map(
          (port, index, all) =>
            ({
              ...(index > 0
                ? {
                    from: all[index - 1],
                    start: all[index - 1].end ?? all[index - 1].start,
                  }
                : {
                    start: 0,
                  }),
              type: EventTypeVoyage.Voyage,
              to: port,
              // Important: Substracting 1ms to not overlap with range of the previous voyage
              end: ((port.start ?? port.end) as number) - 1,
              // Important: Substracting 1ms to not overlap with timestamp port visit events on sorting
              timestamp: ((port.start ?? port.end) as number) - 1,
            } as Voyage)
        )
      if (voyages.length === 0) return []

      const last = voyages[voyages.length - 1]
      return voyages.concat([
        {
          from: last.to,
          start: last.to?.end ?? last.to?.start,
          timestamp: new Date().getTime(),
          type: EventTypeVoyage.Voyage,
          end: new Date().getTime(),
        } as Voyage,
      ])
    })
    .flat()
    .filter((voyage) => voyage.type === EventTypeVoyage.Voyage)
})

const eventTypePriority: Record<EventTypes | EventTypeVoyage, number> = {
  voyage: 1,
  fishing: 2,
  encounter: 3,
  loitering: 4,
  gap: 5,
  port_visit: 6,
}

const getEventsByVoyages = (
  events: RenderedEvent[],
  voyages: Voyage[],
  filters?: Filters
): (RenderedEvent | Voyage)[] => {
  // Need to parse the timerange start and end dates in UTC
  // to not exclude events in the boundaries of the range
  // if the user setting the filter is in a timezone with offset != 0
  const startDate = getUTCDateTime(filters?.start ?? DEFAULT_WORKSPACE.availableStart)

  // Setting the time to 23:59:59.99 so the events in that same day
  //  are also displayed
  const endDateUTC = getUTCDateTime(filters?.end ?? DEFAULT_WORKSPACE.availableEnd).toISODate()
  const endDate = getUTCDateTime(`${endDateUTC}T23:59:59.999Z`)
  const interval = Interval.fromDateTimes(startDate, endDate)

  const filteredVoyages: Voyage[] = voyages
    .filter((voyage) => {
      if (
        !interval.contains(getUTCDateTime((voyage.start ?? 0) as number)) &&
        !interval.contains(getUTCDateTime((voyage.end ?? new Date().getTime()) as number))
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
      eventsQuantity: events.filter(
        (event) =>
          (voyage.start < (event.timestamp ?? (event.start as number)) &&
            voyage.end > (event.timestamp ?? (event.start as number))) ||
          (voyage.start <= (event.timestamp ?? (event.end as number)) &&
            voyage.end >= (event.timestamp ?? (event.end as number)))
      ).length,
    }))

  return [...events, ...filteredVoyages].sort(
    (a, b) =>
      // Sort by event timestamp first
      (b.timestamp ?? (b.start as number)) - (a.timestamp ?? (a.start as number)) ||
      // if equal then sort by event type priority (voyages first)
      eventTypePriority[a.type] - eventTypePriority[b.type]
  )
}

export const selectFilteredEventsByVoyages = createSelector(
  [selectFilteredEvents, selectVoyages, selectFilters],
  getEventsByVoyages
)

export const selectAllEventsByVoyages = createSelector(
  [selectEvents, selectVoyages],
  getEventsByVoyages
)
