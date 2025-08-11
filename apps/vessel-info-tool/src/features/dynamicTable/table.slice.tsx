import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit'

interface TableState {
  columns: string[]
  selectedRowIds: string[]
}

const initialState: TableState = {
  columns: [],
  selectedRowIds: [],
}

export const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setColumns: (state, action: PayloadAction<string[]>) => {
      state.columns = action.payload
    },
    setSelectedRows: (state, action: PayloadAction<string[]>) => {
      state.selectedRowIds = action.payload
    },
    clearSelectedRows: (state) => {
      state.selectedRowIds = []
    },
  },
})

export const { setColumns, setSelectedRows, clearSelectedRows } = tableSlice.actions

export default tableSlice.reducer
