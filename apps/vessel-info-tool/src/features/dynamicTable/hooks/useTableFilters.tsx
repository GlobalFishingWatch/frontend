import { useMemo,useState } from 'react'

import type { FilterState } from '../DynamicTable'

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

    return Object.fromEntries(
      Object.entries(valuesMap).map(([key, valueSet]) => [key, Array.from(valueSet).sort()])
    )
  }, [data])

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      return Object.entries(filterState).every(([columnKey, filterValues]) => {
        if (!filterValues.length) return true
        return filterValues.includes(String(row[columnKey]))
      })
    })
  }, [data, filterState])

  const updateFilter = (columnKey: string, values: string[]) => {
    setFilterState((prev) => ({
      ...prev,
      [columnKey]: values,
    }))
  }

  return {
    filterState,
    filteredData,
    uniqueValues,
    updateFilter,
  }
}
