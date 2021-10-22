import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { HintId } from './hints.content'
import { DISMISSED } from './Hint'

export type HintsDismissed = Record<HintId, typeof DISMISSED>

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
    setHints: (state) => {
      const currentHintsDismissed = JSON.parse(localStorage.getItem('hints') || '{}')
      state.hintsDismissed = currentHintsDismissed
    },
    setHintDismissed: (state, action: PayloadAction<HintsDismissed>) => {
      const currentHintsDismissed = JSON.parse(localStorage.getItem('hints') || '{}')
      const allHintsDismissed = { ...currentHintsDismissed, ...action.payload }
      state.hintsDismissed = allHintsDismissed
      localStorage.setItem('hints', JSON.stringify(allHintsDismissed))
    },
  },
})

export const { resetHints, setHints, setHintDismissed } = hintsSlice.actions

export const selectHintsDismissed = (state: RootState) => state.hints.hintsDismissed

export default hintsSlice.reducer
