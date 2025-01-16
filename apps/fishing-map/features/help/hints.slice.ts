import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from 'reducers'

import { HINTS } from 'data/config'

import type { HintId } from './hints.content'

type HintsDismissed = Record<HintId, boolean>

interface HintsState {
  hintsDismissed?: HintsDismissed
}

const initialState: HintsState = {
  hintsDismissed: undefined,
}

const hintsSlice = createSlice({
  name: 'hints',
  initialState: () => {
    if (typeof window === 'undefined') return initialState
    const hintsDismissed = JSON.parse(localStorage.getItem(HINTS) || '{}')
    return { ...initialState, hintsDismissed }
  },
  reducers: {
    resetHints: (state) => {
      state.hintsDismissed = undefined
      localStorage.setItem(HINTS, '{}')
    },
    setHintDismissed: (state, action: PayloadAction<HintId>) => {
      const currentHintsDismissed = JSON.parse(localStorage.getItem(HINTS) || '{}')
      const allHintsDismissed = { ...currentHintsDismissed, ...{ [action.payload]: true } }
      state.hintsDismissed = allHintsDismissed
      localStorage.setItem(HINTS, JSON.stringify(allHintsDismissed))
    },
  },
})

export const { resetHints, setHintDismissed } = hintsSlice.actions

export const selectHintsDismissed = (state: RootState) => state.hints.hintsDismissed

export default hintsSlice.reducer
