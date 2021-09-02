import { createSelector } from '@reduxjs/toolkit'
import { DateTime, Interval } from 'luxon'
import {
  resolveDataviewDatasetResource,
  // resolveDataviewEventsResources,
  selectResources,
} from '@globalfishingwatch/dataviews-client'
import { DatasetTypes, EventTypes, ResourceStatus } from '@globalfishingwatch/api-types'
import { EVENTS_COLORS } from 'data/config'
import { Filters, initialState, selectFilters } from 'features/event-filters/filters.slice'
import { t } from 'features/i18n/i18n'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.selectors'
import { ActivityEvent, Regions } from 'types/activity'
import { selectEEZs, selectRFMOs } from 'features/regions/regions.selectors'
import { getEEZName } from 'utils/region-name-transform'
import { Region } from 'features/regions/regions.slice'
import { selectEventsForTracks, selectFilteredEvents } from '../activity/vessels-activity.selectors'

export interface Voyage {
  from?: ActivityEvent
  to?: ActivityEvent
  type: 'voyage'
  start?: number
  end?: number
}

export const selectVoyages = createSelector([selectEventsForTracks], (eventsForTrack) => {
  return eventsForTrack.map(({ data }) => {
    const voyages: Voyage[] = (data || [])
      .filter((event: ActivityEvent) => event.type === EventTypes.Port)
      .map(
        (port, index, all) =>
          ({
            ...(index > 0
              ? {
                  from: all[index - 1],
                  start: all[index - 1].start ?? all[index - 1].end,
                }
              : {}),
            type: 'voyage',
            to: port,
            end: port.end ?? port.start,
          } as Voyage)
      )
    if (voyages.length === 0) return []

    const last = voyages[voyages.length - 1]
    return voyages.concat([
      {
        from: last.to,
        start: last.to?.start ?? last.to?.end,
        type: 'voyage',
      } as Voyage,
    ])
    // .reduce(
    //   (prev: Voyage[], current: ActivityEvent) => {
    //     const last = prev.slice(-1).pop() || {}
    //     const rest = prev.slice(0, prev.length - 1)

    //     return [...rest, { ...last, type: 'voyage', to: current }, { type: 'voyage', from: current }]
    //   },
    //   [{type: 'voyage'}]
    // )
  })
})

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

    const filteredVoyages = voyages
      .flat()
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
        type: 'voyage',
        start: voyage.start ?? 0,
        end: voyage.end ?? new Date().getTime(),
      }))
    // .sort((a, b) =>
    //   (a.from?.start ?? a.to?.start ?? 0) > (b.from?.start ?? b.to?.start ?? 0) ? -1 : 1
    // )
    return [...filteredEvents, ...filteredVoyages].sort((a, b) => (a.end > b.end ? -1 : 1))
  }
)
