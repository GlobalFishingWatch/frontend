import type { PayloadAction } from '@reduxjs/toolkit'

import { t } from 'features/i18n/i18n'

import { HOME, SEARCH, WORKSPACE, WORKSPACE_SEARCH,WORKSPACES_LIST } from './routes'

const DEFAULT = `Through our free and open data transparency platform, Global Fishing Watch enables research and innovation in support of ocean sustainability.`

const descriptionReducer = (state = DEFAULT, action: PayloadAction<{ category?: string }>) => {
  switch (action.type) {
    case HOME:
      return t(`workspace.siteDescription.default`, DEFAULT)
    case WORKSPACE:
    case WORKSPACES_LIST: {
      return t(`workspace.siteDescription.${action.payload.category}`, 'default description')
    }
    case SEARCH:
    case WORKSPACE_SEARCH: {
      return t(`workspace.siteDescription.search`, 'search description')
    }
    default:
      return state
  }
}

export default descriptionReducer
