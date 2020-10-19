import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'

interface UserState {
  active: boolean
  options: Record<string, boolean>
}

const initialState: UserState = {
  active: false,
  options: {
    blob: false,
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
    toggleOption: (state, action: PayloadAction<string>) => {
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

export const selectActive = (state: RootState) => state.debug.active
export const selectDebugOptions = (state: RootState) => state.debug.options

export default debugSlice.reducer
