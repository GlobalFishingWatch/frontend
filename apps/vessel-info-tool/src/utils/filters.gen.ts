import type { FilterState } from '@/types/vessel.types'

import { normalizeKey } from './source'

export const generateFilterConfigs = (data: any[]): FilterState[] => {
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

    let type: FilterState['type']
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
      id: normalizeKey(key),
      label: key,
      type,
      value: type === 'select' ? [] : '',
      ...(type === 'select'
        ? {
            options: Array.from(valueSet)
              .sort()
              .map((value) => ({
                id: value,
                label: value,
              })),
          }
        : type === 'number' &&
          key !== 'imo' &&
          key !== 'id' && {
            numberConfig: {
              min: Math.min(...valuesArray.map(Number)),
              max: Math.max(...valuesArray.map(Number)),
              steps: Array.from(valueSet)
                .map(Number)
                .sort((a, b) => a - b),
            },
          }),
    }

    return filterState
  })
}

export const applyFilters = (data: any[], filterConfigs: FilterState[], globalFilter: string) => {
  let result = data

  if (globalFilter.trim()) {
    const searchTerm = globalFilter.toLowerCase().trim()
    result = result.filter((row) => {
      return Object.values(row).some((value) => String(value).toLowerCase().includes(searchTerm))
    })
  }

  result = result.filter((row) => {
    return filterConfigs.every((filterState) => {
      const { id, type, value } = filterState

      if (!value) return true

      const cellValue = String(row[id])
      const numValue = Number(cellValue)
      const filterNum = Number(value)
      const dateValue = new Date(cellValue).toDateString()
      const filterDate = new Date(value).toDateString()

      switch (type) {
        case 'select':
          if (Array.isArray(value) && value.length === 0) return true
          return Array.isArray(value) ? value.includes(cellValue) : value === cellValue

        case 'text':
          return cellValue.toLowerCase().includes(String(value).toLowerCase())

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
}
