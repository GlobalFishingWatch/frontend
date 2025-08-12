import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  clearColumnFilter,
  initializeData,
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
  const { filterConfigs, globalFilter, filteredData, isLoading } = useSelector(
    (state: RootState) => state.filter
  )

  useEffect(() => {
    if (data.length > 0) {
      dispatch(initializeData({ data }))
    }
  }, [data, dispatch])

  const updateGlobalFilter = (searchTerm: string) => {
    dispatch(setGlobalFilter(searchTerm))
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
    handleSelectChange,
    updateFilterValue,
    clearColumnFilter: clearColumnFilterAction,
    getSelectedValues,
    getFilterState,
    hasActiveFilters,
  }
}
