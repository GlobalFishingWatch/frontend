import { PayloadAction } from '@reduxjs/toolkit'
import lowerCase from 'lodash/lowerCase'
import { capitalize } from 'utils/shared'
import { HOME, WORKSPACE, WORKSPACES_LIST } from './routes'

const PREFIX = 'GFW'
const HOME_TITLE = 'Fishing map'
const DEFAULT = `${PREFIX} | ${HOME_TITLE}`

const titleReducer = (state = DEFAULT, action: PayloadAction<{ category?: string }>) => {
  switch (action.type) {
    case HOME:
      return DEFAULT
    case WORKSPACE:
    case WORKSPACES_LIST: {
      const parsedCategory = capitalize(lowerCase(action.payload.category))
      return `${PREFIX} | ${parsedCategory}`
    }
    default:
      return state
  }
}

export default titleReducer
