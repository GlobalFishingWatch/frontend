import {
  NOT_FOUND,
  RoutesMap,
  redirect,
  connectRoutes,
  Options,
  StateGetter,
  Bag,
} from 'redux-first-router'
import { Dispatch } from '@reduxjs/toolkit'
import { parseWorkspace, stringifyWorkspace } from '@globalfishingwatch/dataviews-client'
import { IS_PRODUCTION } from 'data/config'
import { t } from 'features/i18n/i18n'
export const PATH_BASENAME = process.env.NEXT_PUBLIC_URL || (IS_PRODUCTION ? '/map' : '')
export const HOME = 'HOME'
export const WORKSPACE = 'WORKSPACE'
export const WORKSPACES_LIST = 'WORKSPACES_LIST'
export const USER = 'USER'
export const WORKSPACE_REPORT = 'WORKSPACE_REPORT'
export const REPORT = 'REPORT'
export const WORKSPACE_ROUTES = [HOME, WORKSPACE]
export const REPORT_ROUTES = [REPORT, WORKSPACE_REPORT]
export type ROUTE_TYPES =
  | typeof HOME
  | typeof USER
  | typeof WORKSPACES_LIST
  | typeof WORKSPACE
  | typeof WORKSPACE_REPORT
  | typeof REPORT

const MAX_URL_LENGTH_SUPPORTED = 4000
const confirmLeave = (state, action) => {
  if (
    state.location.type !== action.type &&
    state.location.search.length >= MAX_URL_LENGTH_SUPPORTED
  ) {
    return t('common.confirmLeave', 'Are you sure you want to leave without saving your workspace?')
  }
}

export const routesMap: RoutesMap = {
  [HOME]: {
    path: '/',
    confirmLeave,
  },
  [USER]: {
    path: '/user',
  },
  [REPORT]: {
    path: '/report/:reportId',
  },
  [WORKSPACES_LIST]: {
    path: '/:category',
  },
  [WORKSPACE]: {
    path: '/:category/:workspaceId?',
    confirmLeave,
  },
  [WORKSPACE_REPORT]: {
    path: '/:category/:workspaceId/report/:datasetId?/:areaId?',
  },
  [NOT_FOUND]: {
    path: '',
    thunk: async (dispatch: Dispatch) => {
      dispatch(redirect({ type: HOME }))
    },
  },
}

const parseAppWorkspace = (queryString: string) => {
  return parseWorkspace(queryString, {
    reportAreaBounds: (reportAreaBounds: string[]) =>
      reportAreaBounds?.map((bound: string) => parseFloat(bound)),
  })
}

const routesOptions: Options = {
  basename: PATH_BASENAME,
  querySerializer: {
    stringify: stringifyWorkspace,
    parse: parseAppWorkspace,
  },
  onAfterChange: (dispatch: Dispatch<any>, getState: StateGetter, bag: Bag) => {
    // prevent error before the the document is initialized
    if (typeof window !== 'undefined' && document! == null) {
      ;(document as any)
        .querySelector('meta[name="description"]')
        .setAttribute(
          'content',
          getState().description
        )(document as any)
        .querySelector('meta[property="og:description"]')
        .setAttribute(
          'content',
          getState().description
        )(document as any)
        .querySelector('meta[name="twitter:description"]')
        .setAttribute('content', getState().description)
    }
  },
}

export default connectRoutes(routesMap, routesOptions)
