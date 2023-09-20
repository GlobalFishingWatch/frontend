import { PayloadAction } from '@reduxjs/toolkit'
import { lowerCase } from 'lodash'
import { capitalize } from 'utils/shared'
import { t } from 'features/i18n/i18n'
import { HOME, REPORT, USER, WORKSPACE, WORKSPACES_LIST, WORKSPACE_REPORT } from './routes'

const PREFIX = 'GFW'

const titleReducer = (_, action: PayloadAction<{ category?: string }>) => {
  const defaultTitle = `${PREFIX} | ${t('common.map', 'Map')}`
  switch (action.type) {
    case HOME:
      return defaultTitle
    case USER:
      return `${PREFIX} | ${t('user.profile', 'User profile')}`
    case REPORT:
    case WORKSPACE_REPORT:
      return `${PREFIX} | ${t('analysis.title', 'Analysis')}`
    case WORKSPACE:
    case WORKSPACES_LIST: {
      const parsedCategory = capitalize(lowerCase(action.payload.category))
      return `${PREFIX} | ${parsedCategory}`
    }
    default:
      return defaultTitle
  }
}

export default titleReducer
