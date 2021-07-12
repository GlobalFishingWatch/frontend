import { Dispatch } from 'redux'
import { NOT_FOUND, RoutesMap, redirect, connectRoutes, Options } from 'redux-first-router'
import { stringify, parse } from 'qs'
import { Dictionary } from '@reduxjs/toolkit'
import { invert, isObject, isString, transform } from 'lodash'
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
  visible: 'vis',
  query: 'qry',
  value: 'val',
  color: 'clr',
}
const ABBREVIATED_TO_PARAMS = invert(PARAMS_TO_ABBREVIATED)

const TOKEN_PREFIX = '~'
const TOKEN_REGEX = /~(\d+)/

const deepReplaceKeys = (obj: Dictionary<any>, keysMap: Dictionary<string>) => {
  return transform(obj, (result: any, value, key) => {
    const newKey = keysMap[key] || key
    result[newKey] = isObject(value) ? deepReplaceKeys(value, keysMap) : value
  })
}

// Replace repeated values
const deepTokenizeValues = (obj: Dictionary<any>) => {
  const tokens: string[] = []
  const collectTokens = (obj: Dictionary<any>) => {
    Object.values(obj).forEach((value) => {
      if (isObject(value)) collectTokens(value)
      else if (isString(value)) tokens.push(value as string)
    })
  }
  collectTokens(obj)

  const tokensCount: Dictionary<number> = {}
  tokens.forEach((token) => {
    if (!tokensCount[token]) {
      tokensCount[token] = 0
    }
    tokensCount[token]!++
  })
  const repeatedTokens = Object.entries(tokensCount)
    .filter(([key, count]) => {
      return count! > 1 && key.length > 5
    })
    .map(([key]) => key)

  if (!repeatedTokens.length) {
    return obj
  }

  const tokenizeValues = (obj: Dictionary<any>) => {
    return transform(obj, (result: any, value, key) => {
      if (isObject(value)) {
        result[key] = tokenizeValues(value)
      } else if (isString(value)) {
        // Special case for dataset ids that are of the form 'vessel-[same hash as other dataset ids]'
        const isVessel = value.includes('vessel-')
        const vesselValue = isVessel ? 'vessel-' : ''

        const tokenValue = isVessel ? value.replace('vessel-', '') : value
        const repeatedTokenIndex = repeatedTokens.indexOf(tokenValue)
        const replacedValue =
          repeatedTokenIndex === -1 ? value : `${vesselValue}${TOKEN_PREFIX}${repeatedTokenIndex}`
        result[key] = replacedValue
      } else {
        result[key] = value
      }
    })
  }
  const tokenized = tokenizeValues(obj)
  tokenized.tk = repeatedTokens
  return tokenized
}

const deepDetokenizeValues = (obj: Dictionary<any>) => {
  const tokens = obj.tk
  const detokenizeValues = (obj: Dictionary<any>) => {
    return transform(obj, (result: any, value, key) => {
      if (isObject(value)) {
        result[key] = detokenizeValues(value)
      } else if (isString(value)) {
        // TODO token as var
        const matchesToken = value.match(TOKEN_REGEX)
        if (!matchesToken) {
          result[key] = value
          return
        }
        const tokenIndex = parseInt(matchesToken[1])
        const detokenizedValue = value.replace(TOKEN_REGEX, tokens[tokenIndex])
        result[key] = detokenizedValue
      } else {
        result[key] = value
      }
    })
  }
  const detokenized = detokenizeValues(obj)
  return detokenized
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
  const tokenized = deepTokenizeValues(objectWithAbbr)
  const stringified = stringify(tokenized, {
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
  const parsedDetokenized = deepDetokenizeValues(parsedWithAbbr)
  Object.keys(parsedDetokenized).forEach((param: string) => {
    const value = parsedDetokenized[param]
    const transformationFn = urlToObjectTransformation[param]
    if (value && transformationFn) {
      parsedDetokenized[param] = transformationFn(value)
    }
  })

  return parsedDetokenized
}

const routesOptions: Options = {
  querySerializer: {
    stringify: stringifyWorkspace,
    parse: parseWorkspace,
  },
}

export default connectRoutes(routesMap, routesOptions)
