import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'reducers'

export enum DebugOption {
  Blob = 'blob',
  Extruded = 'extruded',
  Debug = 'debug',
  Thinning = 'thinning',
}

export type DebugOptions = Record<DebugOption, boolean>

interface DebugState {
  active: boolean
  options: DebugOptions
}

const initialState: DebugState = {
  active: false,
  options: {
    blob: false,
    debug: false,
    thinning: true,
    extruded: false,
  },
}

const debugSlice = createSlice({
  name: 'debug',
  initialState,
  reducers: {
    toggleDebugMenu: (state) => {
      state.active = !state.active
    },
    toggleOption: (state, action: PayloadAction<DebugOption>) => {
      state.options[action.payload] = !state.options[action.payload]
      if (state.options.blob) {
        state.options.extruded = false
      }
      if (state.options.extruded) {
        state.options.blob = false
      }
    },
  },
})

export const { toggleDebugMenu, toggleOption } = debugSlice.actions

export const selectDebugActive = (state: RootState) => state.debug.active
export const selectDebugOptions = (state: RootState) => state.debug.options

export default debugSlice.reducer
