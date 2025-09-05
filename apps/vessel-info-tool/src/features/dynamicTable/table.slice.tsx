import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RowSelectionState } from '@tanstack/react-table'

interface TableState {
  columns: string[]
  selectedRows: RowSelectionState
}

const initialState: TableState = {
  columns: [],
  selectedRows: {},
}

export const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setColumns: (state, action: PayloadAction<string[]>) => {
      state.columns = action.payload
    },
    setSelectedRows: (state, action: PayloadAction<RowSelectionState>) => {
      state.selectedRows = action.payload
    },
    clearSelectedRows: (state) => {
      state.selectedRows = {}
    },
  },
})

export const { setColumns, setSelectedRows, clearSelectedRows } = tableSlice.actions

export default tableSlice.reducer
