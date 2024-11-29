import type {
  RoutesMap,
  Options,
  StateGetter,
  Bag} from 'redux-first-router';
import {
  NOT_FOUND,
  redirect,
  connectRoutes
} from 'redux-first-router'
import type { Dispatch } from '@reduxjs/toolkit'
import { parseWorkspace, stringifyWorkspace } from '@globalfishingwatch/dataviews-client'
import { PATH_BASENAME } from 'data/config'
import { t } from 'features/i18n/i18n'

export const HOME = 'HOME'
export const WORKSPACE = 'WORKSPACE'
export const WORKSPACES_LIST = 'WORKSPACES_LIST'
export const USER = 'USER'
export const SEARCH = 'SEARCH'
export const WORKSPACE_SEARCH = 'WORKSPACE_SEARCH'
export const VESSEL = 'VESSEL'
export const WORKSPACE_VESSEL = 'WORKSPACE_VESSEL'
export const REPORT = 'REPORT'
export const VESSEL_GROUP_REPORT = 'VESSEL_GROUP_REPORT'
export const PORT_REPORT = 'PORT_REPORT'
export const WORKSPACE_REPORT = 'WORKSPACE_REPORT'
export const WORKSPACE_ROUTES = [HOME, WORKSPACE]
export const REPORT_ROUTES = [REPORT, WORKSPACE_REPORT]

export type ROUTE_TYPES =
  | typeof HOME
  | typeof USER
  | typeof WORKSPACES_LIST
  | typeof WORKSPACE
  | typeof VESSEL
  | typeof VESSEL_GROUP_REPORT
  | typeof WORKSPACE_VESSEL
  | typeof REPORT
  | typeof WORKSPACE_REPORT
  | typeof SEARCH
  | typeof WORKSPACE_SEARCH
  | typeof REPORT
  | typeof PORT_REPORT

export const SAVE_WORKSPACE_BEFORE_LEAVE_KEY = 'SAVE_WORKSPACE_BEFORE_LEAVE'

const confirmLeave = (state: any, action: any) => {
  const suggestWorkspaceSave = state.workspace?.suggestSave === true
  if (state.location?.type !== action.type && suggestWorkspaceSave) {
    return t('common.confirmLeave', 'Are you sure you want to leave without saving your workspace?')
  }
}

export const routesMap: RoutesMap = {
  [HOME]: {
    path: '/index',
    confirmLeave,
  },
  [USER]: {
    path: '/user',
  },
  [SEARCH]: {
    path: '/vessel-search',
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
    confirmLeave,
  },
  [WORKSPACE_SEARCH]: {
    path: '/:category/:workspaceId/vessel-search',
  },
  [WORKSPACE_VESSEL]: {
    path: '/:category/:workspaceId/vessel/:vesselId',
  },
  [WORKSPACE_REPORT]: {
    path: '/:category/:workspaceId/report/:datasetId?/:areaId?',
  },
  [VESSEL_GROUP_REPORT]: {
    path: '/:category/:workspaceId/vessel-group-report/:vesselGroupId',
  },
  [PORT_REPORT]: {
    path: '/:category/:workspaceId/ports-report/:portId',
  },
  [NOT_FOUND]: {
    path: '',
    thunk: async (dispatch: Dispatch) => {
      dispatch(redirect({ type: HOME }) as any)
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
  displayConfirmLeave: (message, callback) => {
    if (message) {
      const openSaveWorkspace = !window.confirm(message)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(SAVE_WORKSPACE_BEFORE_LEAVE_KEY, openSaveWorkspace.toString())
        window.dispatchEvent(
          new StorageEvent('session-storage', { key: SAVE_WORKSPACE_BEFORE_LEAVE_KEY })
        )
      }
      callback(!openSaveWorkspace)
    }
  },
}

export default connectRoutes(routesMap, routesOptions)
