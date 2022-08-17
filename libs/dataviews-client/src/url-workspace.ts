import { Dictionary } from '@reduxjs/toolkit'
import { invert, isObject, isString, transform } from 'lodash'
import { stringify, parse } from 'qs'
import { UrlDataviewInstance } from '.'

/**
 * A generic workspace to be extended by apps
 */
export type BaseUrlWorkspace = {
  activityCategory?: string // legacy
  dataviewInstances?: Partial<UrlDataviewInstance[]>
  dataviewInstancesOrder?: UrlDataviewInstance['id'][]
  latitude?: number
  longitude?: number
  zoom?: number
  start?: string
  end?: string
}

const PARAMS_TO_ABBREVIATED = {
  dataviewInstances: 'dvIn',
  dataviewInstancesOrder: 'dvInOr',
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
  'vessel-groups': 'vGs',
}
const ABBREVIATED_TO_PARAMS = invert(PARAMS_TO_ABBREVIATED)

const TOKEN_PREFIX = '~'
const TOKEN_REGEX = /~(\d+)/

const BASE_URL_TO_OBJECT_TRANSFORMATION: Dictionary<(value: any) => any> = {
  latitude: (latitude) => parseFloat(latitude),
  longitude: (longitude) => parseFloat(longitude),
  zoom: (zoom) => parseFloat(zoom),
  dataviewInstances: (dataviewInstances: UrlDataviewInstance[]) => {
    return dataviewInstances.map(parseDataviewInstance)
  },
}

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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    tokensCount[token]!++
  })
  const repeatedTokens = Object.entries(tokensCount)
    .filter(([key, count]) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
        const matchesToken = value.match(TOKEN_REGEX)
        if (!matchesToken) {
          result[key] = value
          return
        }
        const tokenIndex = parseInt(matchesToken[1])
        const token = tokens[tokenIndex]
        if (!token) {
          result[key] = value
          return
        }
        const detokenizedValue = value.replace(TOKEN_REGEX, token)
        result[key] = detokenizedValue
      } else {
        result[key] = value
      }
    })
  }
  const detokenized = detokenizeValues(obj)
  return detokenized
}

const PUBLIC_VMS_TRACK_DATASETS = [
  'public-belize-fishing-tracks',
  'public-bra-onyxsat-fishing-tracks',
  'public-chile-fishing-tracks',
  'public-chile-non-fishing-tracks',
  'public-costa-rica-fishing-tracks',
  'public-ecuador-fishing-tracks',
  'public-ecuador-non-fishing-tracks',
  'public-indonesia-fishing-tracks',
  'public-mexico-fishing-tracks',
  'public-panama-fishing-tracks',
  'public-panama-non-fishing-tracks',
  'public-peru-fishing-tracks',
]
export const migrateLegacyVMSPublicDatasets = (datasetId: string) => {
  return PUBLIC_VMS_TRACK_DATASETS.includes(datasetId)
    ? datasetId.replace('public-', 'full-')
    : datasetId
}

export const removeLegacyEndpointPrefix = (endpointId: string) => {
  return endpointId.replace('carriers-', '')
}

export const parseLegacyDataviewInstanceEndpoint = (
  dataviewInstance: UrlDataviewInstance
): UrlDataviewInstance => {
  return {
    ...dataviewInstance,
    ...(dataviewInstance.datasetsConfig && {
      datasetsConfig: dataviewInstance.datasetsConfig.map((dc) => ({
        ...dc,
        datasetId: migrateLegacyVMSPublicDatasets(dc.datasetId),
        endpoint: removeLegacyEndpointPrefix(dc.endpoint),
      })),
    }),
  }
}

const parseDataviewInstance = (dataview: UrlDataviewInstance) => {
  const dataviewId = parseInt((dataview.dataviewId as number)?.toString())
  const breaks = dataview.config?.breaks?.map((b: string) => parseFloat(b))
  const vesselGroups = dataview.config?.['vessel-groups']?.map((vg: any) => parseInt(vg as any))

  const config = { ...dataview.config }
  if (breaks) {
    config.breaks = breaks
  }
  if (vesselGroups) {
    config['vessel-groups'] = vesselGroups
  }
  return {
    ...parseLegacyDataviewInstanceEndpoint(dataview),
    ...(dataviewId && { dataviewId }),
    config,
  }
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

export const parseWorkspace = (
  queryString: string,
  customUrlTransformations: Dictionary<(value: any) => any> = {}
): BaseUrlWorkspace => {
  const parsed = parse(queryString, {
    arrayLimit: 1000,
    depth: 20,
    decoder,
    strictNullHandling: true,
    ignoreQueryPrefix: true,
  })
  const parsedWithAbbr = deepReplaceKeys(parsed, ABBREVIATED_TO_PARAMS)
  const parsedDetokenized = deepDetokenizeValues(parsedWithAbbr)
  const urlToObjectTransformation = {
    ...BASE_URL_TO_OBJECT_TRANSFORMATION,
    ...customUrlTransformations,
  }

  Object.keys(parsedDetokenized).forEach((param: string) => {
    const value = parsedDetokenized[param]
    const transformationFn = urlToObjectTransformation[param]
    if (value && transformationFn) {
      parsedDetokenized[param] = transformationFn(value)
    }
  })

  return parsedDetokenized
}

export const stringifyWorkspace = (object: BaseUrlWorkspace) => {
  const objectWithAbbr = deepReplaceKeys(object, PARAMS_TO_ABBREVIATED)
  const tokenized = deepTokenizeValues(objectWithAbbr)
  const stringified = stringify(tokenized, {
    encodeValuesOnly: true,
    strictNullHandling: true,
  })
  return stringified
}
