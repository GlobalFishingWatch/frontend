import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { HintId } from './hints.content'

export type HintsDismissed = Record<HintId, boolean>

export interface HintsState {
  hintsDismissed?: HintsDismissed
}

const initialState: HintsState = {
  hintsDismissed: undefined,
}

const hintsSlice = createSlice({
  name: 'hints',
  initialState,
  reducers: {
    resetHints: (state) => {
      state.hintsDismissed = undefined
      localStorage.setItem('hints', '{}')
    },
    initializeHints: (state) => {
      const currentHintsDismissed = JSON.parse(localStorage.getItem('hints') || '{}')
      state.hintsDismissed = currentHintsDismissed
    },
    setHintDismissed: (state, action: PayloadAction<HintId>) => {
      const currentHintsDismissed = JSON.parse(localStorage.getItem('hints') || '{}')
      const allHintsDismissed = { ...currentHintsDismissed, ...{ [action.payload]: true } }
      state.hintsDismissed = allHintsDismissed
      localStorage.setItem('hints', JSON.stringify(allHintsDismissed))
    },
  },
})

export const { resetHints, initializeHints, setHintDismissed } = hintsSlice.actions

export const selectHintsDismissed = (state: RootState) => state.hints.hintsDismissed

export default hintsSlice.reducer
