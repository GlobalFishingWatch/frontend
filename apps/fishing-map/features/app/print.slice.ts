import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from 'reducers'

const printSlice = createSlice({
  name: 'print',
  initialState: { printMode: false },
  reducers: {
    setPrintMode: (state, action: PayloadAction<boolean>) => {
      state.printMode = action.payload
    },
  },
})

export const { setPrintMode } = printSlice.actions
export const selectPrintMode = (state: RootState): boolean => state.print.printMode

export default printSlice.reducer
