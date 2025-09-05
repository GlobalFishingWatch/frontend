import { configureStore } from '@reduxjs/toolkit'

import tableReducer from '@/features/dynamicTable/table.slice'
import filtersReducer from '@/features/filter/filters.slice'

export const store = configureStore({
  reducer: {
    filter: filtersReducer,
    table: tableReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
