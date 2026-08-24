import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { HINTS } from 'data/map/config'
import type { RootState } from 'reducers'
import { getLocalStorageItem, setLocalStorageItem } from 'utils/dom'

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
      setLocalStorageItem(HINTS, '{}')
    },
    setHintDismissed: (state, action: PayloadAction<HintId>) => {
      let currentHintsDismissed: HintsDismissed = state.hintsDismissed ?? ({} as HintsDismissed)
      const storedHints = getLocalStorageItem(HINTS)
      if (storedHints) {
        try {
          currentHintsDismissed = JSON.parse(storedHints) as HintsDismissed
        } catch {
          // keep in-memory hints if storage is corrupt
        }
      }
      const allHintsDismissed = { ...currentHintsDismissed, [action.payload]: true }
      state.hintsDismissed = allHintsDismissed
      setLocalStorageItem(HINTS, JSON.stringify(allHintsDismissed))
    },
  },
})

export const { hydrateHintsDismissed, resetHints, setHintDismissed } = hintsSlice.actions

export const selectHintsDismissed = (state: RootState) => state.hints.hintsDismissed

export default hintsSlice.reducer
