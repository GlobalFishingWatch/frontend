import { Dispatch } from 'redux'
import { NOT_FOUND, RoutesMap, redirect, connectRoutes, Options } from 'redux-first-router'
import { stringify, parse } from 'qs'
import { Dictionary, Middleware } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { QueryParams, UrlDataviewInstance } from 'types'
import { REPLACE_URL_PARAMS } from 'data/config'
import { UpdateQueryParamsAction } from './routes.actions'

export const HOME = 'HOME'
export type ROUTE_TYPES = typeof HOME

const routesMap: RoutesMap = {
  [HOME]: {
    path: '/:workspaceId?/:version?',
  },
  [NOT_FOUND]: {
    path: '',
    thunk: async (dispatch: Dispatch) => {
      dispatch(redirect({ type: HOME }))
    },
  },
}

const parseDataviewInstance = (dataview: UrlDataviewInstance) => {
  const dataviewId = parseInt((dataview.dataviewId as number)?.toString())
  return {
    ...dataview,
    ...(dataviewId && { dataviewId }),
  }
}

const urlToObjectTransformation: Dictionary<(value: any) => any> = {
  latitude: (latitude) => parseFloat(latitude),
  longitude: (longitude) => parseFloat(longitude),
  zoom: (zoom) => parseFloat(zoom),
  dataviewInstances: (dataviewInstances: UrlDataviewInstance[]) => {
    return dataviewInstances.map(parseDataviewInstance)
  },
}

const encodeWorkspace = (object: Record<string, unknown>) => {
  return stringify(object, { encodeValuesOnly: true, strictNullHandling: true })
}

// Extended logic from qs utils decoder to have some keywords parsed
const decoder = (str: string, decoder?: any, charset?: string) => {
  const strWithoutPlus = str.replace(/\+/g, ' ')
  if (charset === 'iso-8859-1') {
    // unescape never throws, no try...catch needed:
    return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape)
  }
  const keywords: any = {
    true: true,
    false: false,
    null: null,
    undefined,
  }
  if (str in keywords) {
    return keywords[str]
  }

  // utf-8
  try {
    return decodeURIComponent(strWithoutPlus)
  } catch (e) {
    return strWithoutPlus
  }
}

const decodeWorkspace = (queryString: string) => {
  const parsed = parse(queryString, {
    arrayLimit: 1000,
    depth: 20,
    decoder,
    strictNullHandling: true,
  })
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
