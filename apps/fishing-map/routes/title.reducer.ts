import type { PayloadAction } from '@reduxjs/toolkit'
import lowerCase from 'lodash/lowerCase'

import { t } from 'features/i18n/i18n'
import { capitalize } from 'utils/shared'

import {
  HOME,
  REPORT,
  SEARCH,
  USER,
  VESSEL,
  WORKSPACE,
  WORKSPACE_REPORT,
  WORKSPACE_SEARCH,
  WORKSPACE_VESSEL,
  WORKSPACES_LIST,
} from './routes'

const PREFIX = 'GFW'

const titleReducer = (_: any, action: PayloadAction<{ category?: string }>) => {
  const defaultTitle = `${PREFIX} | ${t('common.map')}`
  switch (action.type) {
    case HOME:
      return defaultTitle
    case SEARCH:
    case WORKSPACE_SEARCH:
      return `${PREFIX} | ${t('search.title')}`
    case VESSEL:
    case WORKSPACE_VESSEL:
      return `${PREFIX} | ${t('vessel.title')}`
    case USER:
      return `${PREFIX} | ${t('user.profile')}`
    case REPORT:
    case WORKSPACE_REPORT:
      return `${PREFIX} | ${t('analysis.title')}`
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
