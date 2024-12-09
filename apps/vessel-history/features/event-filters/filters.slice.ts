import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit'
import { memoize } from 'lodash'
import type { RootState } from 'store'

export type availableEventFilters =
  | 'portVisits'
  | 'fishingEvents'
  | 'encounters'
  | 'loiteringEvents'
  | 'gapEvents'

export type Filters = {
  portVisits: boolean
  fishingEvents: boolean
  encounters: boolean
  loiteringEvents: boolean
  gapEvents: boolean
  start?: string
  end?: string
}

export type FiltersSlice = {
  filters: Filters
}
export const initialState: FiltersSlice = {
  filters: {
    fishingEvents: true,
    encounters: true,
    loiteringEvents: true,
    portVisits: true,
    gapEvents: true,
  },
}

const slice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    updateFilters: (state, action: PayloadAction<Filters>) => {
      state.filters = action.payload
    },
    resetFilters: (state, action: PayloadAction) => {
      state.filters = initialState.filters
    },
  },
})
export default slice.reducer

export const { resetFilters, updateFilters } = slice.actions
export const selectFilters = (state: RootState) => state.filters.filters
export const selectStart = (state: RootState) => state.filters.filters.start
export const selectEnd = (state: RootState) => state.filters.filters.end

export const selectFilter = memoize((field: availableEventFilters) =>
  createSelector([selectFilters], (filters: Filters) => {
    return filters[field] as boolean
  })
)
