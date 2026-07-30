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

/**
 * Lazily registered — see features/map/map/controls/screenshot.slice.ts for the reference pattern.
 * Importing this module performs the injection, so the chunk that needs the slice is the chunk that
 * registers it.
 *
 * `.selector()` wraps root state in a Proxy that yields `initialState` for a not-yet-registered slice,
 * so a read between inject() and the next dispatched action is safe.
 */
const injectedPrintSlice = rootReducer.inject(printSlice)

declare module 'reducers' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface LazyLoadedSlices extends WithSlice<typeof printSlice> {}
}

export const selectPrintMode = injectedPrintSlice.selector(
  (state): boolean => state.print.printMode
)

export default printSlice.reducer
