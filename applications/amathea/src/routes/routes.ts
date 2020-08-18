import { Dispatch } from 'redux'
import {
  NOT_FOUND,
  RoutesMap,
  redirect,
  connectRoutes,
  Options,
  RouteObject,
} from 'redux-first-router'
import { stringify, parse } from 'qs'
import { Dictionary, Middleware } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { QueryParams } from 'types'
import { REPLACE_URL_PARAMS } from 'data/config'
import { UpdateQueryParamsAction } from './routes.actions'

export const WORKSPACES = 'location/workspaces'
export const AREAS_OF_INTEREST = 'location/areasOfInterest'
export const DATASETS = 'location/datasets'
export const WORKSPACE_EDITOR = 'location/workspaceEditor'

export type ROUTE_TYPES =
  | typeof WORKSPACES
  | typeof WORKSPACE_EDITOR
  | typeof AREAS_OF_INTEREST
  | typeof DATASETS

export type LocationRoute = RouteObject & { sidebarComponent?: string }

const routesMap: RoutesMap<LocationRoute> = {
  [WORKSPACES]: {
    path: '/',
    sidebarComponent: 'workspaces/Workspaces.tsx',
  },
  [AREAS_OF_INTEREST]: {
    path: '/areas-of-interest',
    sidebarComponent: 'areas-of-interest/AreasOfInterest.tsx',
  },
  [DATASETS]: {
    path: '/datasets',
    sidebarComponent: 'datasets/Datasets.tsx',
  },
  [WORKSPACE_EDITOR]: {
    path: '/workspaces/:workspaceId',
    sidebarComponent: 'workspace-editor/WorkspaceEditor.tsx',
  },
  [NOT_FOUND]: {
    path: '',
    thunk: async (dispatch: Dispatch) => {
      dispatch(redirect({ type: WORKSPACES }))
    },
  },
}

const urlToObjectTransformation: Dictionary<(value: any) => any> = {
  latitude: (s) => parseFloat(s),
  longitude: (s) => parseFloat(s),
  zoom: (s) => parseFloat(s),
}

const encodeWorkspace = (object: Record<string, unknown>) => {
  return stringify(object, { encode: false })
}

const decodeWorkspace = (queryString: string) => {
  const parsed = parse(queryString, { arrayLimit: 300 })

  Object.keys(parsed).forEach((param: string) => {
    const value = parsed[param]
    const transformationFn = urlToObjectTransformation[param]
    if (value && transformationFn) {
      parsed[param] = transformationFn(value)
    }
  })
  return parsed
}

const routesOptions: Options = {
  querySerializer: {
    stringify: encodeWorkspace,
    parse: decodeWorkspace,
  },
}

export const routerQueryMiddleware: Middleware = ({ getState }: { getState: () => RootState }) => (
  next
) => (action: UpdateQueryParamsAction) => {
  const routesActions = Object.keys(routesMap)
  // check if action type matches a route type
  const isRouterAction = routesActions.includes(action.type)
  if (!isRouterAction) {
    next(action)
  } else {
    const newAction: UpdateQueryParamsAction = { ...action }

    const prevQuery = getState().location.query || {}
    if (newAction.replaceQuery !== true) {
      newAction.query = {
        ...prevQuery,
        ...newAction.query,
      }
    }
    const { query } = action
    if (query) {
      const redirect = Object.keys(prevQuery)
        .filter((k) => query[k as keyof QueryParams])
        .some((key) => REPLACE_URL_PARAMS.includes(key))
      if (redirect === true) {
        newAction.meta = {
          location: {
            kind: 'redirect',
          },
        }
      }
    }
    next(newAction)
  }
}

export default connectRoutes(routesMap, routesOptions)
