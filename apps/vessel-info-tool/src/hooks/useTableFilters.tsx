import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearch } from '@tanstack/react-router'

import {
  clearAllFilters,
  clearColumnFilter,
  clearGlobalFilter,
  initializeData,
  initializeFromUrl,
  setGlobalFilter,
  toggleSelectOption,
  updateColumnFilter,
} from '@/features/filter/filters.slice'
import type { FilterState } from '@/types/vessel.types'
import type { SelectOption } from '@globalfishingwatch/ui-components'

import type { RootState } from 'store'

export interface TableSearchParams {
  search?: string
  filters?: Record<string, string | string[]>
}

export function useTableFilters<T extends Record<string, any>>(data: T[]) {
  const dispatch = useDispatch()
  const { filterConfigs, globalFilter, filteredData, urlSyncEnabled, debounceMs, isLoading } =
    useSelector((state: RootState) => state.filter)

  const search = useSearch({ strict: false }) as TableSearchParams
  const navigate = useNavigate()

  useEffect(() => {
    if (data.length > 0) {
      dispatch(initializeData({ data }))
    }
  }, [data, dispatch])

  // useEffect(() => {
  //   if (!urlSyncEnabled || !search) return

  //   dispatch(
  //     initializeFromUrl({
  //       globalFilter: search.search,
  //       filters: search.filters,
  //     })
  //   )
  // }, [search, dispatch, urlSyncEnabled])

  useEffect(() => {
    if (!urlSyncEnabled) return

    const timeout = setTimeout(() => {
      const newSearch: TableSearchParams = {}

      if (globalFilter.trim()) {
        newSearch.search = globalFilter
      }

      const activeFilters: Record<string, string | string[]> = {}
      filterConfigs.forEach((filter) => {
        if (filter.filteredValue) {
          if (Array.isArray(filter.filteredValue) && filter.filteredValue.length > 0) {
            activeFilters[filter.id] = filter.filteredValue
          } else if (!Array.isArray(filter.filteredValue) && filter.filteredValue !== '') {
            activeFilters[filter.id] = filter.filteredValue
          }
        }
      })

      if (Object.keys(activeFilters).length > 0) {
        newSearch.filters = activeFilters
      }

      const currentSearch = search as TableSearchParams
      const sameSearch =
        (currentSearch.search ?? '') === (newSearch.search ?? '') &&
        JSON.stringify(currentSearch.filters ?? {}) === JSON.stringify(newSearch.filters ?? {})

      if (!sameSearch) {
        navigate({
          search: () => ({
            ...(currentSearch ?? {}),
            ...newSearch,
          }),
          replace: true,
        })
      }
    }, debounceMs)

    return () => clearTimeout(timeout)
  }, [filterConfigs, globalFilter, navigate, urlSyncEnabled, debounceMs, search])

  const updateGlobalFilter = (searchTerm: string) => {
    dispatch(setGlobalFilter(searchTerm))
  }

  const clearGlobalFilter = () => {
    dispatch(clearGlobalFilter())
  }

  const handleSelectChange = (filterId: string) => (option: SelectOption) => {
    dispatch(toggleSelectOption({ id: filterId, option }))
  }

  const updateFilterValue = (filterId: string, value: any) => {
    dispatch(updateColumnFilter({ id: filterId, value }))
  }

  const clearColumnFilterAction = (filterId: string) => {
    dispatch(clearColumnFilter(filterId))
  }

  const getSelectedValues = (filterId: string): string[] => {
    const filterState = filterConfigs.find((f) => f.id === filterId)
    if (!filterState) return []
    return Array.isArray(filterState.filteredValue) ? filterState.filteredValue : []
  }

  const getFilterState = (filterId: string): FilterState | undefined => {
    return filterConfigs.find((f) => f.id === filterId)
  }

  const hasActiveFilters = (): boolean => {
    const hasColumnFilters = filterConfigs.some((filter) => {
      if (Array.isArray(filter.filteredValue)) {
        return filter.filteredValue.length > 0
      }
      return filter.filteredValue !== undefined && filter.filteredValue !== ''
    })

    return hasColumnFilters || globalFilter.trim() !== ''
  }

  return {
    filterConfigs,
    globalFilter,
    filteredData,
    isLoading,

    updateGlobalFilter,
    clearGlobalFilter,
    handleSelectChange,
    updateFilterValue,
    clearColumnFilter: clearColumnFilterAction,

    getSelectedValues,
    getFilterState,
    hasActiveFilters,
  }
}
