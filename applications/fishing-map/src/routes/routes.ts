import { Dispatch } from 'redux'
import { NOT_FOUND, RoutesMap, redirect, connectRoutes, Options } from 'redux-first-router'
import { stringify, parse } from 'qs'
import { Dictionary } from '@reduxjs/toolkit'
import { invert, isObject, transform } from 'lodash'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

export const HOME = 'HOME'
export const WORKSPACE = 'WORKSPACE'
export const WORKSPACES_LIST = 'WORKSPACES_LIST'
export const USER = 'USER'
export const WORKSPACE_ROUTES = [HOME, WORKSPACE]
export type ROUTE_TYPES = typeof HOME | typeof USER | typeof WORKSPACES_LIST | typeof WORKSPACE

export const routesMap: RoutesMap = {
  [HOME]: {
    path: '/',
  },
  [USER]: {
    path: '/user',
  },
  [WORKSPACES_LIST]: {
    path: '/:category',
  },
  [WORKSPACE]: {
    path: '/:category/:workspaceId?',
  },
  [NOT_FOUND]: {
    path: '',
    thunk: async (dispatch: Dispatch) => {
      dispatch(redirect({ type: HOME }))
    },
  },
}

const PARAMS_TO_ABBREVIATED = {
  dataviewInstances: 'dvIn',
  datasetsConfig: 'dsC',
  datasets: 'dss',
  endpoint: 'ept',
  datasetId: 'dsId',
  dataviewId: 'dvId',
  params: 'pms',
  config: 'cfg',
}
const ABBREVIATED_TO_PARAMS = invert(PARAMS_TO_ABBREVIATED)

const deepReplaceKeys = (obj: Dictionary<any>, keysMap: Dictionary<string>) => {
  return transform(obj, (result: any, value, key) => {
    const newKey = keysMap[key] || key
    result[newKey] = isObject(value) ? deepReplaceKeys(value, keysMap) : value
  })
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
  analysis: (analysis) => ({
    ...analysis,
    bounds: analysis.bounds?.map((bound: string) => parseFloat(bound)),
  }),
  dataviewInstances: (dataviewInstances: UrlDataviewInstance[]) => {
    return dataviewInstances.map(parseDataviewInstance)
  },
}

const stringifyWorkspace = (object: Record<string, unknown>) => {
  const objectWithAbbr = deepReplaceKeys(object, PARAMS_TO_ABBREVIATED)
  const stringified = stringify(objectWithAbbr, {
    encodeValuesOnly: true,
    strictNullHandling: true,
  })
  return stringified
}

// Extended logic from qs utils decoder to have some keywords parsed
const decoder = (str: string, decoder?: any, charset?: string, type?: string) => {
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

const parseWorkspace = (queryString: string) => {
  const parsed = parse(queryString, {
    arrayLimit: 1000,
    depth: 20,
    decoder,
    strictNullHandling: true,
  })
  const parsedWithAbbr = deepReplaceKeys(parsed, ABBREVIATED_TO_PARAMS)
  Object.keys(parsedWithAbbr).forEach((param: string) => {
    const value = parsedWithAbbr[param]
    const transformationFn = urlToObjectTransformation[param]
    if (value && transformationFn) {
      parsedWithAbbr[param] = transformationFn(value)
    }
  })

  return parsedWithAbbr
}

const routesOptions: Options = {
  querySerializer: {
    stringify: stringifyWorkspace,
    parse: parseWorkspace,
  },
}

export default connectRoutes(routesMap, routesOptions)
