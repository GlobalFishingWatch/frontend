import { PayloadAction } from '@reduxjs/toolkit'
import { lowerCase } from 'lodash'
import { capitalize } from 'utils/shared'
import { t } from 'features/i18n/i18n'
import { HOME, USER, WORKSPACE, WORKSPACES_LIST } from './routes'

const PREFIX = 'GFW'
const HOME_TITLE = 'Map'
const DEFAULT = `${PREFIX} | ${HOME_TITLE}`

const titleReducer = (state = DEFAULT, action: PayloadAction<{ category?: string }>) => {
  switch (action.type) {
    case HOME:
      return DEFAULT
    case USER:
      return `${PREFIX} | ${t('user.profile', 'User profile')}`
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
