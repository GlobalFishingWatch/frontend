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

export const PATH_BASENAME = process.env.NEXT_PUBLIC_URL || (IS_PRODUCTION ? '/map' : '')

export const HOME = 'HOME'
export const WORKSPACE = 'WORKSPACE'
export const WORKSPACES_LIST = 'WORKSPACES_LIST'
export const USER = 'USER'
export const VESSEL = 'VESSEL'
export const WORKSPACE_VESSEL = 'WORKSPACE_VESSEL'
export const REPORT = 'REPORT'
export const WORKSPACE_REPORT = 'WORKSPACE_REPORT'
export const WORKSPACE_ROUTES = [HOME, WORKSPACE]
export const REPORT_ROUTES = [REPORT, WORKSPACE_REPORT]

export type ROUTE_TYPES =
  | typeof HOME
  | typeof USER
  | typeof WORKSPACES_LIST
  | typeof WORKSPACE
  | typeof VESSEL
  | typeof WORKSPACE_VESSEL
  | typeof REPORT
  | typeof WORKSPACE_REPORT

export const routesMap: RoutesMap = {
  [HOME]: {
    path: '/',
  },
  [USER]: {
    path: '/user',
  },
  [REPORT]: {
    path: '/report/:reportId',
  },
  [VESSEL]: {
    path: '/vessel/:vesselId',
  },
  [WORKSPACES_LIST]: {
    path: '/:category',
  },
  [WORKSPACE]: {
    path: '/:category/:workspaceId?',
  },
  [WORKSPACE_VESSEL]: {
    path: '/:category/:workspaceId/vessel/:vesselId',
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
