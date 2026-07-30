import type { PayloadAction, WithSlice } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { rootReducer } from 'reducers'

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

const injectedPrintSlice = rootReducer.inject(printSlice)

declare module 'reducers' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface LazyLoadedSlices extends WithSlice<typeof printSlice> {}
}

export const selectPrintMode = injectedPrintSlice.selector(
  (state): boolean => state.print.printMode
)

export default printSlice.reducer
