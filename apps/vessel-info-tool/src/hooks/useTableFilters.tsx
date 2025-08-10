import { useCallback,useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import type { Table } from '@tanstack/react-table'

import type { FilterState, FilterType } from '@/features/filter/DynamicFilters'
import type { SelectOption } from '@globalfishingwatch/ui-components'

export interface TableSearchParams {
  search?: string
  filters?: Record<string, string | string[]>
}

export function useTableFilters<T extends Record<string, any>>(
  data: T[],
  table?: Table<T>,
  options?: {
    syncWithUrl?: boolean
    debounceMs?: number
  }
) {
  const { syncWithUrl = true, debounceMs = 300 } = options || {}

  const search = useSearch({
    strict: false,
  }) as TableSearchParams
  const navigate = useNavigate()

  const [filterStates, setFilterStates] = useState<FilterState[]>([])
  const [globalSearch, setGlobalSearch] = useState<string>('')
  const [updateTimeout, setUpdateTimeout] = useState<NodeJS.Timeout | null>(null)

  const filterConfigs = useMemo(() => {
    const valuesMap: Record<string, Set<string>> = {}

    data.forEach((row) => {
      Object.entries(row).forEach(([key, value]) => {
        if (!valuesMap[key]) {
          valuesMap[key] = new Set()
        }
        valuesMap[key].add(String(value))
      })
    })

    return Object.entries(valuesMap).map(([key, valueSet]) => {
      const valuesArray = Array.from(valueSet)
      let isDateValues = true
      let isNumberValues = true
      let isLink = true
      const linkPattern = /^(https?:\/\/|www\.)/i

      for (const value of valuesArray) {
        const date = new Date(value)
        if (isNaN(date.getTime())) {
          isDateValues = false
        }

        if (isNaN(Number(value)) || value.trim() === '') {
          isNumberValues = false
        }

        if (!linkPattern.test(value.trim())) {
          isLink = false
        }

        if (!isDateValues && !isNumberValues && !isLink) {
          break
        }
      }

      let type: FilterType
      switch (true) {
        case valueSet.size <= 1:
          type = ''
          break
        case isDateValues:
          type = 'date'
          break
        case isNumberValues:
          type = 'number'
          break
        case isLink:
          type = ''
          break
        case valueSet.size > 15:
          type = 'text'
          break
        default:
          type = 'select'
      }

      const filterState: FilterState = {
        id: key,
        label: key,
        type,
        ...(type === 'select' && {
          options: Array.from(valueSet)
            .sort()
            .map((value) => ({
              id: value,
              label: value,
            })),
        }),
      }

      return filterState
    })
  }, [data])

  useEffect(() => {
    if (!syncWithUrl) return

    if (search.search !== undefined) {
      setGlobalSearch(search.search)
    }

    setFilterStates((prevStates) => {
      const existingValues = prevStates.reduce(
        (acc, state) => {
          acc[state.id] = state.filteredValue
          return acc
        },
        {} as Record<string, any>
      )

      return filterConfigs.map((config) => {
        const urlValue = search.filters?.[config.id]
        let filteredValue = existingValues[config.id]

        if (urlValue !== undefined) {
          switch (config.type) {
            case 'select':
              filteredValue = Array.isArray(urlValue) ? urlValue : [urlValue]
              break
            case 'text':
            case 'number':
            case 'date':
              filteredValue = Array.isArray(urlValue) ? urlValue[0] : urlValue
              break
          }
        } else {
          filteredValue = config.type === 'select' ? [] : undefined
        }

        return {
          ...config,
          filteredValue,
        }
      })
    })
  }, [filterConfigs, search, syncWithUrl])

  const updateUrl = useCallback(
    (newGlobalSearch: string, newFilterStates: FilterState[]) => {
      if (!syncWithUrl) return

      if (updateTimeout) {
        clearTimeout(updateTimeout)
      }

      const timeout = setTimeout(() => {
        const newSearch: TableSearchParams = {}

        if (newGlobalSearch.trim()) {
          newSearch.search = newGlobalSearch
        }

        const activeFilters: Record<string, string | string[]> = {}
        newFilterStates.forEach((filter) => {
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

        navigate({
          search: ((prev: any) => ({ ...(prev ?? {}), ...newSearch })) as any,
          replace: true,
        })
      }, debounceMs)

      setUpdateTimeout(timeout)
    },
    [navigate, syncWithUrl, debounceMs, updateTimeout]
  )

  useEffect(() => {
    return () => {
      if (updateTimeout) {
        clearTimeout(updateTimeout)
      }
    }
  }, [updateTimeout])

  const filteredData = useMemo(() => {
    let result = data

    if (globalSearch.trim()) {
      const searchTerm = globalSearch.toLowerCase().trim()
      result = result.filter((row) => {
        return Object.values(row).some((value) => String(value).toLowerCase().includes(searchTerm))
      })
    }

    result = result.filter((row) => {
      return filterStates.every((filterState) => {
        const { id, type, filteredValue } = filterState

        if (!filteredValue) return true

        const cellValue = String(row[id])
        const numValue = Number(cellValue)
        const filterNum = Number(filteredValue)
        const dateValue = new Date(cellValue).toDateString()
        const filterDate = new Date(filteredValue).toDateString()

        switch (type) {
          case 'select':
            if (Array.isArray(filteredValue) && filteredValue.length === 0) return true
            return Array.isArray(filteredValue)
              ? filteredValue.includes(cellValue)
              : filteredValue === cellValue

          case 'text':
            return cellValue.toLowerCase().includes(String(filteredValue).toLowerCase())

          case 'number':
            return !isNaN(numValue) && !isNaN(filterNum) && numValue === filterNum

          case 'date':
            return dateValue === filterDate

          default:
            return true
        }
      })
    })

    return result
  }, [data, filterStates, globalSearch])

  const updateGlobalSearch = (searchTerm: string) => {
    setGlobalSearch(searchTerm)
    updateUrl(searchTerm, filterStates)

    if (table) {
      table.setGlobalFilter(searchTerm || undefined)
    }
  }

  const clearGlobalSearch = () => {
    setGlobalSearch('')
    updateUrl('', filterStates)

    if (table) {
      table.setGlobalFilter(undefined)
    }
  }

  const handleSelectChange = (filterId: string) => (option: SelectOption) => {
    setFilterStates((prev) => {
      const newStates = prev.map((filterState) => {
        if (filterState.id === filterId) {
          const currentValues = Array.isArray(filterState.filteredValue)
            ? filterState.filteredValue
            : []

          const optionValue = String(option.id)
          const isAlreadySelected = currentValues.includes(optionValue)

          let updatedValues: string[]
          if (isAlreadySelected) {
            updatedValues = currentValues.filter((val) => val !== optionValue)
          } else {
            updatedValues = [...currentValues, optionValue]
          }

          const updatedFilter = {
            ...filterState,
            filteredValue: updatedValues,
          }

          if (table) {
            const column = table.getColumn(filterId)
            if (column) {
              column.setFilterValue(updatedValues.length > 0 ? updatedValues : undefined)
            }
          }

          return updatedFilter
        }
        return filterState
      })

      updateUrl(globalSearch, newStates)
      return newStates
    })
  }

  const updateFilterValue = (filterId: string, value: any) => {
    setFilterStates((prev) => {
      const newStates = prev.map((filterState) => {
        if (filterState.id === filterId) {
          const updatedFilter = {
            ...filterState,
            filteredValue: value,
          }

          if (table) {
            const column = table.getColumn(filterId)
            if (column) {
              column.setFilterValue(value)
            }
          }

          return updatedFilter
        }
        return filterState
      })

      updateUrl(globalSearch, newStates)
      return newStates
    })
  }

  const clearColumnFilter = (filterId: string) => {
    setFilterStates((prev) => {
      const newStates = prev.map((filterState) => {
        if (filterState.id === filterId) {
          const clearedValue = filterState.type === 'select' ? [] : ''
          const updatedFilter = {
            ...filterState,
            filteredValue: clearedValue,
          }

          if (table) {
            const column = table.getColumn(filterId)
            if (column) {
              column.setFilterValue(undefined)
            }
          }

          return updatedFilter
        }
        return filterState
      })

      updateUrl(globalSearch, newStates)
      return newStates
    })
  }

  // Function to check if a value is selected for a column
  const isValueSelected = (filterId: string, value: string) => {
    const filterState = filterStates.find((f) => f.id === filterId)
    if (!filterState || !Array.isArray(filterState.filteredValue)) return false
    return filterState.filteredValue.includes(value)
  }

  // Function to get selected values for a column
  const getSelectedValues = (filterId: string): string[] => {
    const filterState = filterStates.find((f) => f.id === filterId)
    if (!filterState) return []
    return Array.isArray(filterState.filteredValue) ? filterState.filteredValue : []
  }

  // Function to get a specific filter state
  const getFilterState = (filterId: string): FilterState | undefined => {
    return filterStates.find((f) => f.id === filterId)
  }

  // Helper to check if any filters are active
  const hasActiveFilters = () => {
    const hasColumnFilters = filterStates.some((filter) => {
      if (Array.isArray(filter.filteredValue)) {
        return filter.filteredValue.length > 0
      }
      return filter.filteredValue !== undefined && filter.filteredValue !== ''
    })

    return hasColumnFilters || globalSearch.trim() !== ''
  }

  return {
    filterStates,
    handleSelectChange,
    updateFilterValue,
    clearColumnFilter,
    isValueSelected,
    getSelectedValues,
    getFilterState,

    globalSearch,
    updateGlobalSearch,
    clearGlobalSearch,

    filteredData,
    hasActiveFilters,
  }
}
