import { Dispatch } from 'redux'
import { NOT_FOUND, RoutesMap, redirect, connectRoutes, Options } from 'redux-first-router'
import { stringify, parse } from 'qs'
import { Dictionary, Middleware } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { UpdateQueryParamsAction } from './routes.actions'

export const HOME = 'HOME'

const routesMap: RoutesMap = {
  [HOME]: {
    path: '/',
  },
  [NOT_FOUND]: {
    path: '',
    thunk: async (dispatch: Dispatch) => {
      dispatch(redirect({ type: HOME }))
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
    next(newAction)
  }
}

export default connectRoutes(routesMap, routesOptions)
