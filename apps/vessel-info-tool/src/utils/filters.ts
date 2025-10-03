import type { FilterState } from '@/types/vessel.types'

import { normalizeKey } from './validations'

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
      case key === 'IMO':
        type = 'text'
        break
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

    const numberValues = valuesArray.map(Number)

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
          key !== 'id' && {
            numberConfig: {
              min: Math.floor(Math.min(...numberValues)),
              max: Math.ceil(Math.max(...numberValues)),
              steps: numberValues.slice().sort((a, b) => a - b),
            },
          }),
    }

    return filterState
  })
}
