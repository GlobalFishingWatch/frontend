import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { HINTS } from 'data/config'
import type { RootState } from 'reducers'
import { getIsBrowser } from 'utils/dom'

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
  initialState,
  reducers: {
    hydrateHintsDismissed: (state, action: PayloadAction<HintsDismissed>) => {
      state.hintsDismissed = action.payload
    },
    resetHints: (state) => {
      state.hintsDismissed = undefined
      if (getIsBrowser()) {
        localStorage.setItem(HINTS, '{}')
      }
    },
    setHintDismissed: (state, action: PayloadAction<HintId>) => {
      const currentHintsDismissed = !getIsBrowser()
        ? state.hintsDismissed || {}
        : JSON.parse(localStorage.getItem(HINTS) || '{}')
      const allHintsDismissed = { ...currentHintsDismissed, ...{ [action.payload]: true } }
      state.hintsDismissed = allHintsDismissed
      if (getIsBrowser()) {
        localStorage.setItem(HINTS, JSON.stringify(allHintsDismissed))
      }
    },
  },
})

export const { hydrateHintsDismissed, resetHints, setHintDismissed } = hintsSlice.actions

export const selectHintsDismissed = (state: RootState) => state.hints.hintsDismissed

export default hintsSlice.reducer
