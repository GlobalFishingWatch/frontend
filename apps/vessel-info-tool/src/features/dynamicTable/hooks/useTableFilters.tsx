import { useMemo, useState } from 'react'
import { id } from 'zod/v4/locales'

import type { FilterState,FilterType } from '@/features/filter/DynamicFilters'

export function useTableFilters<T extends Record<string, any>>(data: T[]) {
  const [filterState, setFilterState] = useState<FilterState>({})

  const uniqueValues = useMemo(() => {
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

      for (const value of valuesArray) {
        const date = new Date(value)
        if (isNaN(date.getTime())) {
          isDateValues = false
        }

        if (isNaN(Number(value)) || value.trim() === '') {
          isNumberValues = false
        }

        if (!isDateValues && !isNumberValues) {
          break
        }
      }

      let type: FilterType
      switch (true) {
        case isDateValues:
          type = 'date'
          break
        case isNumberValues:
          type = 'number'
          break
        case valueSet.size > 10:
          type = 'text'
          break
        default:
          type = 'select'
      }

      return {
        id: key,
        label: key,
        type,
        options: Array.from(valueSet)
          .sort()
          .map((value) => ({
            id: value,
            label: value,
          })), // options.sort((a, b) => a.label.localeCompare(b.label));
      }
    })
  }, [data])

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      return Object.entries(filterState).every(([columnKey, filterValues]) => {
        if (!filterValues.length) return true
        return filterValues.includes(String(row[columnKey]))
      })
    })
  }, [data, filterState])

  const updateFilter = (filters: FilterState) => {
    setFilterState((prev) => ({
      ...prev,
      ...filters,
    }))
  }

  return {
    filterState,
    filteredData,
    uniqueValues,
    updateFilter,
  }
}
