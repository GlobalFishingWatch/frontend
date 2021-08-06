import { createSelector } from '@reduxjs/toolkit'
import { RenderedEvent, selectEventsWithRenderingInfo } from 'features/vessels/activity/vessels-activity.slice';
import { Filters, initialState, selectFilters } from 'features/profile/filters/filters.slice';

export const selectFilteredEvents = createSelector(
  [selectEventsWithRenderingInfo, selectFilters],
  (events, filters) => {
    const startDate = new Date(filters.start)
    startDate.setHours(0, 0, 0, 0)
    const startTimestamp = startDate.getTime()
    const endDate = new Date(filters.end)
    endDate.setHours(0, 0, 0, 0)
    const endTimestamp = endDate.getTime()

    return events.flat().filter((event: RenderedEvent) => {
      if (startTimestamp >= event.start || endTimestamp <= event.end) {
        return false
      }
      if (event.type === 'fishing') {
        return filters.fishingEvents
      }
      if (event.type === 'loitering') {
        return filters.loiteringEvents
      }
      if (event.type === 'encounter') {
        return filters.encounters
      }
      if (event.type === 'port') {
        return filters.portVisits
      }

      return true
    }).sort((a, b) => (a.start > b.start ? -1 : 1))
  }
)

export const selectFilterUpdated = createSelector(
  [selectFilters], (filters) => {
    const keys1 = Object.keys(initialState.filters);
    const keys2 = Object.keys(filters);
    if (keys1.length !== keys2.length) {
      return true;
    }

    for (const key of keys1) {
      const filterKey = key as keyof Filters
      if (initialState.filters[filterKey] !== filters[filterKey]) {
        return true;
      }
    }

    return false;
  }
)