import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit'

import type { FilterState } from '@/types/vessel.types'
import { generateFilterConfigs } from '@/utils/vessels'

export interface TableFiltersState {
  // Core filter data
  filterConfigs: FilterState[]
  activeFilters: Record<string, any> // columnId -> filterValue
  globalSearch: string

  // UI state
  isLoading: boolean

  // Data source info
  sourceData: any[]
  dataSourceKey: string // To track different datasets (vessels, users, etc.)
}

const initialState: TableFiltersState = {
  filterConfigs: [],
  activeFilters: {},
  globalSearch: '',
  isLoading: false,
  sourceData: [],
  dataSourceKey: '',
}
export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // Initialize filters from data
    initializeFilters: (state, action: PayloadAction<{ data: any[]; dataSourceKey: string }>) => {
      const { data, dataSourceKey } = action.payload

      // Only reinitialize if data source changed or configs don't exist
      if (state.dataSourceKey !== dataSourceKey || state.filterConfigs.length === 0) {
        state.sourceData = data
        state.dataSourceKey = dataSourceKey
        state.filterConfigs = generateFilterConfigs(data)

        // Reset filters when data source changes
        if (state.dataSourceKey !== dataSourceKey) {
          state.activeFilters = {}
          state.globalSearch = ''
        }
      } else {
        // Just update source data if same source
        state.sourceData = data
      }
    },

    // Initialize from URL params
    initializeFromUrl: (
      state,
      action: PayloadAction<{
        globalSearch?: string
        filters?: Record<string, string | string[]>
      }>
    ) => {
      const { globalSearch, filters } = action.payload

      if (globalSearch !== undefined) {
        state.globalSearch = globalSearch
      }

      if (filters) {
        // Convert URL filters to active filters format
        const newActiveFilters: Record<string, any> = {}

        Object.entries(filters).forEach(([columnId, value]) => {
          const filterConfig = state.filterConfigs.find((f) => f.id === columnId)
          if (filterConfig) {
            switch (filterConfig.type) {
              case 'select':
                newActiveFilters[columnId] = Array.isArray(value) ? value : [value]
                break
              case 'text':
              case 'number':
              case 'date':
                newActiveFilters[columnId] = Array.isArray(value) ? value[0] : value
                break
            }
          }
        })

        state.activeFilters = { ...state.activeFilters, ...newActiveFilters }
      }
    },

    // Global search actions
    setGlobalSearch: (state, action: PayloadAction<string>) => {
      state.globalSearch = action.payload
    },

    clearGlobalSearch: (state) => {
      state.globalSearch = ''
    },

    // Column filter actions
    setColumnFilter: (state, action: PayloadAction<{ columnId: string; value: any }>) => {
      const { columnId, value } = action.payload

      if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
        delete state.activeFilters[columnId]
      } else {
        state.activeFilters[columnId] = value
      }
    },

    // Multi-select toggle for select filters
    toggleSelectValue: (state, action: PayloadAction<{ columnId: string; value: string }>) => {
      const { columnId, value } = action.payload
      const currentValues = state.activeFilters[columnId] || []

      if (Array.isArray(currentValues)) {
        if (currentValues.includes(value)) {
          // Remove value
          const newValues = currentValues.filter((v) => v !== value)
          if (newValues.length === 0) {
            delete state.activeFilters[columnId]
          } else {
            state.activeFilters[columnId] = newValues
          }
        } else {
          // Add value
          state.activeFilters[columnId] = [...currentValues, value]
        }
      } else {
        // Initialize as array with single value
        state.activeFilters[columnId] = [value]
      }
    },

    // Clear single column filter
    clearColumnFilter: (state, action: PayloadAction<string>) => {
      const columnId = action.payload
      delete state.activeFilters[columnId]
    },

    // Clear all column filters (keep global search)
    clearColumnFilters: (state) => {
      state.activeFilters = {}
    },

    // Clear all filters including global search
    clearAllFilters: (state) => {
      state.activeFilters = {}
      state.globalSearch = ''
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

// Action creators
export const {
  initializeFilters,
  initializeFromUrl,
  setGlobalSearch,
  clearGlobalSearch,
  setColumnFilter,
  toggleSelectValue,
  clearColumnFilter,
  clearColumnFilters,
  clearAllFilters,
  setLoading,
} = filtersSlice.actions

export default filtersSlice.reducer
