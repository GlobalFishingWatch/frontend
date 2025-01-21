import type { PayloadAction } from '@reduxjs/toolkit'

import { HOME } from './routes'

const PREFIX = 'GFW'
const HOME_TITLE = 'Map'
const DEFAULT = `${PREFIX} | ${HOME_TITLE}`

const titleReducer = (state = DEFAULT, action: PayloadAction<{ category?: string }>) => {
  switch (action.type) {
    case HOME:
      return DEFAULT
    default:
      return state
  }
}

export default titleReducer
