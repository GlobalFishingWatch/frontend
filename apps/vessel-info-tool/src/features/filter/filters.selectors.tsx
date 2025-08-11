import { createSelector,createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { TableFiltersState } from './filters.slice'

export const selectTableFilters = (state: { tableFilters: TableFiltersState }) => state.tableFilters

export const selectFilterConfigs = createSelector(
  [selectTableFilters],
  (filters) => filters.filterConfigs
)

export const selectActiveFilters = createSelector(
  [selectTableFilters],
  (filters) => filters.activeFilters
)

export const selectGlobalSearch = createSelector(
  [selectTableFilters],
  (filters) => filters.globalSearch
)

export const selectSourceData = createSelector(
  [selectTableFilters],
  (filters) => filters.sourceData
)

export const selectIsLoading = createSelector([selectTableFilters], (filters) => filters.isLoading)

// Complex selectors
export const selectFilteredData = createSelector(
  [selectSourceData, selectActiveFilters, selectGlobalSearch],
  (sourceData, activeFilters, globalSearch) => {
    let result = [...sourceData]

    // Apply global search first
    if (globalSearch.trim()) {
      const searchTerm = globalSearch.toLowerCase().trim()
      result = result.filter((row) => {
        return Object.values(row).some((value) => String(value).toLowerCase().includes(searchTerm))
      })
    }

    // Apply column filters
    result = result.filter((row) => {
      return Object.entries(activeFilters).every(([columnId, filterValue]) => {
        if (!filterValue) return true

        const cellValue = String(row[columnId])

        if (Array.isArray(filterValue)) {
          if (filterValue.length === 0) return true
          return filterValue.includes(cellValue)
        } else {
          // For text/number/date filters
          return cellValue.toLowerCase().includes(String(filterValue).toLowerCase())
        }
      })
    })

    return result
  }
)

export const selectHasActiveFilters = createSelector(
  [selectActiveFilters, selectGlobalSearch],
  (activeFilters, globalSearch) => {
    const hasColumnFilters = Object.keys(activeFilters).length > 0
    const hasGlobalSearch = globalSearch.trim() !== ''
    return hasColumnFilters || hasGlobalSearch
  }
)

export const selectFilterSummary = createSelector(
  [selectSourceData, selectFilteredData, selectHasActiveFilters],
  (sourceData, filteredData, hasActiveFilters) => ({
    totalCount: sourceData.length,
    filteredCount: filteredData.length,
    hasActiveFilters,
  })
)

// Selector for specific filter state
export const selectFilterState = (columnId: string) =>
  createSelector([selectFilterConfigs, selectActiveFilters], (filterConfigs, activeFilters) => {
    const config = filterConfigs.find((f) => f.id === columnId)
    if (!config) return undefined

    return {
      ...config,
      filteredValue: activeFilters[columnId],
    }
  })

// Selector for select filter options with selection state
export const selectSelectFilterOptions = (columnId: string) =>
  createSelector(
    [selectFilterState(columnId), selectActiveFilters],
    (filterState, activeFilters) => {
      if (!filterState || filterState.type !== 'select' || !filterState.options) {
        return []
      }

      const selectedValues = activeFilters[columnId] || []

      return filterState.options.map((option) => ({
        ...option,
        selected: Array.isArray(selectedValues)
          ? selectedValues.includes(String(option.id))
          : false,
      }))
    }
  )
