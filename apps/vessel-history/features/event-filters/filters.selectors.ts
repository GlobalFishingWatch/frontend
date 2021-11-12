import { createSelector } from '@reduxjs/toolkit'
import { EventType, EventTypes } from '@globalfishingwatch/api-types'
import { Filters, initialState, selectFilters } from 'features/event-filters/filters.slice'
import { VisibleEvents } from 'types'

export const selectFilterUpdated = createSelector([selectFilters], (filters) => {
  const keys1 = Object.keys(initialState.filters)
  const keys2 = Object.keys(filters).filter((key) => filters[key as keyof Filters] !== undefined)
  if (keys1.length !== keys2.length) {
    return true
  }

  for (const key of keys1) {
    const filterKey = key as keyof Filters
    if (initialState.filters[filterKey] !== filters[filterKey]) {
      return true
    }
  }

  return false
})

export const selectVisibleEvents = createSelector([selectFilters], (filters) => {
  const filtersToEventTypes: Partial<Record<keyof Filters, EventType>> = {
    encounters: EventTypes.Encounter,
    fishingEvents: EventTypes.Fishing,
    loiteringEvents: EventTypes.Loitering,
    portVisits: EventTypes.Port,
  }
  const filterKeys = Object.keys(filtersToEventTypes).map((key) => key as keyof Filters)
  const visibleEvents = filterKeys
    .filter((key) => filters[key])
    .map((key) => filtersToEventTypes[key])

  return visibleEvents.length === filterKeys.length
    ? 'all'
    : ((visibleEvents.length === 0 ? 'none' : visibleEvents) as VisibleEvents)
})
