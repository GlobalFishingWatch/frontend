import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { FiltersState, FilterState } from '@/types/vessel.types'
import type { SelectOption } from '@globalfishingwatch/ui-components'

const generateFilterConfigs = (data: any[]): FilterState[] => {
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
}

const applyFilters = (data: any[], filterConfigs: FilterState[], globalFilter: string) => {
  let result = data

  if (globalFilter.trim()) {
    const searchTerm = globalFilter.toLowerCase().trim()
    result = result.filter((row) => {
      return Object.values(row).some((value) => String(value).toLowerCase().includes(searchTerm))
    })
  }

  result = result.filter((row) => {
    return filterConfigs.every((filterState) => {
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
}

const initialState: FiltersState = {
  filterConfigs: generateFilterConfigs([]),
  globalFilter: '',
  filteredData: [],
  originalData: [],
  isLoading: false,
  urlSyncEnabled: true,
  debounceMs: 200,
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    initializeData: (state, action: PayloadAction<{ data: any[] }>) => {
      const { data } = action.payload
      state.originalData = data
      state.filterConfigs = generateFilterConfigs(data)
      state.filteredData = applyFilters(data, state.filterConfigs, state.globalFilter)
    },

    setGlobalFilter: (state, action: PayloadAction<string>) => {
      state.globalFilter = action.payload
      state.filteredData = applyFilters(state.originalData, state.filterConfigs, state.globalFilter)
    },

    updateColumnFilter: (state, action: PayloadAction<{ id: string; value: any }>) => {
      const { id, value } = action.payload

      state.filterConfigs = state.filterConfigs.map((config) => {
        if (config.id === id) {
          return { ...config, filteredValue: value }
        }
        return config
      })

      state.filteredData = applyFilters(state.originalData, state.filterConfigs, state.globalFilter)
    },

    toggleSelectOption: (state, action: PayloadAction<{ id: string; option: SelectOption }>) => {
      const { id, option } = action.payload

      state.filterConfigs = state.filterConfigs.map((config) => {
        if (config.id === id && config.type === 'select') {
          const currentValues = Array.isArray(config.filteredValue) ? config.filteredValue : []
          const optionValue = String(option.id)
          const isAlreadySelected = currentValues.includes(optionValue)

          const updatedValues = isAlreadySelected
            ? currentValues.filter((val) => val !== optionValue)
            : [...currentValues, optionValue]

          return { ...config, filteredValue: updatedValues }
        }
        return config
      })

      state.filteredData = applyFilters(state.originalData, state.filterConfigs, state.globalFilter)
    },

    clearColumnFilter: (state, action: PayloadAction<string>) => {
      const id = action.payload

      state.filterConfigs = state.filterConfigs.map((config) => {
        if (config.id === id) {
          const clearedValue = config.type === 'select' ? [] : undefined
          return { ...config, filteredValue: clearedValue }
        }
        return config
      })

      state.filteredData = applyFilters(state.originalData, state.filterConfigs, state.globalFilter)
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  initializeData,
  setGlobalFilter,
  updateColumnFilter,
  toggleSelectOption,
  clearColumnFilter,
  setLoading,
} = filtersSlice.actions

export default filtersSlice.reducer
