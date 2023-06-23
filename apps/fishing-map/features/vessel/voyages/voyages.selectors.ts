import { createSelector } from '@reduxjs/toolkit'
import { DateTime, Interval } from 'luxon'
import { EventTypes } from '@globalfishingwatch/api-types'
import { ActivityEvent, PortVisitSubEvent } from 'types/activity'
import { Voyage, EventTypeVoyage, RenderedVoyage } from 'types/voyage'
import { DEFAULT_WORKSPACE } from 'data/config'
import { getUTCDateTime } from 'utils/dates'
import { selectFullVesselId } from 'routes/routes.selectors'
import { selectTimeRange } from 'features/app/app.selectors'
import { RenderedEvent, selectFilteredEvents } from '../activity/vessels-activity.selectors'

export const selectFilteredEventsWithSplitPorts = createSelector(
  [selectFilteredEvents],
  (events) => {
    const voyageEvents = []
    events.forEach((event) => {
      if (event.type !== EventTypes.Port) {
        voyageEvents.push(event)
      } else {
        voyageEvents.push({
          ...event,
          id: `${event.id}-${PortVisitSubEvent.Entry}`,
          subEvent: PortVisitSubEvent.Entry,
        })
        voyageEvents.push({
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
    return voyageEvents
  }
)
/*
export const selectCurrentVesselVoyagesState = createSelector(
  [selectFilteredEvents],
  (voyages) => {
    return voyages
  }
)*/

export const selectVoyages = createSelector(
  [selectFilteredEventsWithSplitPorts, selectTimeRange],
  (events, timeRange) => {
    console.log(
      events.filter(
        (event: ActivityEvent) => event.type === EventTypes.Port && event.id.endsWith('-exit')
      )
    )
    const voyages: Voyage[] = events
      .reverse()
      .filter(
        (event: ActivityEvent) => event.type === EventTypes.Port && event.id.endsWith('-exit')
      )
      .map((port, index, all) => {
        console.log(port)
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
    console.log(voyages)
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
  timerange
): (RenderedEvent | RenderedVoyage)[] => {
  console.log(voyages)
  // Need to parse the timerange start and end dates in UTC
  // to not exclude events in the boundaries of the range
  // if the user setting the filter is in a timezone with offset != 0
  const startDate = getUTCDateTime(timerange ? timerange.start : DEFAULT_WORKSPACE.availableStart)

  // Setting the time to 23:59:59.99 so the events in that same day
  //  are also displayed
  const endDateUTC = getUTCDateTime(
    timerange ? timerange.end : DEFAULT_WORKSPACE.availableEnd
  ).toISODate()
  const endDate = getUTCDateTime(`${endDateUTC}T23:59:59.999Z`)
  const interval = Interval.fromDateTimes(startDate, endDate)
  console.log(timerange)
  console.log(interval)
  const filteredVoyages: RenderedVoyage[] = voyages
    .filter((voyage) => {
      if (
        !interval.contains(getUTCDateTime((voyage.start ?? 0) as number)) &&
        !interval.contains(getUTCDateTime((voyage.end ?? new Date().getTime()) as number))
      ) {
        return false
      }

      return true
    })
    .map((voyage) => {
      console.log(voyage)
      return {
        ...voyage,
        status: 'collapsed',
        type: EventTypeVoyage.Voyage,
        start: voyage.start ?? 0,
        end: voyage.end ?? new Date().getTime(),
        eventsQuantity: events.filter(
          (event) =>
            (voyage.start < (event.timestamp ?? event.start) &&
              voyage.end > (event.timestamp ?? event.start)) ||
            (voyage.start <= (event.timestamp ?? event.end) &&
              voyage.end >= (event.timestamp ?? event.end))
        ).length,
      }
    })

  return [...events, ...filteredVoyages].sort(
    (a, b) =>
      // Sort by event timestamp first
      (b.timestamp ?? (b.start as number)) - (a.timestamp ?? (a.start as number)) ||
      // if equal then sort by event type priority (voyages first)
      eventTypePriority[a.type] - eventTypePriority[b.type]
  )
}

export const selectFilteredEventsByVoyages = createSelector(
  [selectFilteredEventsWithSplitPorts, selectVoyages, selectTimeRange],
  (events, voyages, timerange) => {
    console.log(events, voyages)

    return getEventsByVoyages(events, voyages, timerange)
  }
)
