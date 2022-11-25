import { createSelector } from '@reduxjs/toolkit'
import { EventType, EventTypes } from '@globalfishingwatch/api-types'
import { Filters, initialState, selectFilters } from 'features/event-filters/filters.slice'
import { VisibleEvents } from 'types'

export const selectFiltersUpdated = createSelector(
  [selectFilters],
  (filters): (keyof Filters)[] => {
    const keys1 = Object.keys(initialState.filters) as (keyof Filters)[]
    const keys2 = (Object.keys(filters) as (keyof Filters)[]).filter(
      (key) => filters[key as keyof Filters] !== undefined
    )

    const uniqueKeys = Array.from(new Set(keys1.concat(keys2)))

    return uniqueKeys.filter((key) => initialState.filters[key] !== filters[key])
  }
)

export const selectIsFilterUpdated = createSelector(
  [selectFiltersUpdated],
  (filtersUpdated) => filtersUpdated && filtersUpdated.length > 0
)

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
