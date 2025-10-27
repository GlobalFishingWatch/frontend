import { invert } from 'es-toolkit'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import transform from 'lodash/transform'
import { parse, stringify } from 'qs'

import type { AnyDataviewInstance, UrlDataviewInstance } from '../types'

import {
  migrateEventsLegacyDatasets,
  removeLegacyEndpointPrefix,
  runDatasetMigrations,
} from './migrations'

export type Dictionary<Value> = Record<string, Value>

/**
 * A generic workspace to be extended by apps
 */
export type BaseUrlWorkspace = {
  activityCategory?: string // legacy
  dataviewInstances?: Partial<AnyDataviewInstance[]>
  dataviewInstancesOrder?: AnyDataviewInstance['id'][]
  latitude?: number
  longitude?: number
  zoom?: number
  start?: string
  end?: string
}

const PARAMS_TO_ABBREVIATED = {
  activityVisualizationMode: 'aVM',
  bivariateDataviews: 'bDV',
  color: 'clr',
  config: 'cfg',
  datasetId: 'dsId',
  datasets: 'dss',
  datasetsConfig: 'dsC',
  dataviewId: 'dvId',
  dataviewInstances: 'dvIn',
  dataviewInstancesOrder: 'dvInOr',
  deleted: 'dT',
  detectionsVisualizationMode: 'dVM',
  endpoint: 'ept',
  environmentVisualizationMode: 'eVM',
  featureFlag: 'fF',
  firstTransmissionDate: 'fTD',
  lastTransmissionDate: 'lTD',
  mapAnnotations: 'mA',
  mapAnnotationsVisible: 'mAV',
  mapRulers: 'mR',
  mapRulersVisible: 'mRV',
  params: 'pms',
  query: 'qry',
  searchOption: 'sO',
  sidebarOpen: 'sbO',
  timebarGraph: 'tG',
  timebarSelectedEnvId: 'tSEI',
  timebarVisualisation: 'tV',
  value: 'val',
  visible: 'vis',
  visibleEvents: 'vE',
  //Vessel Profile
  relatedVesselIds: 'rVIs',
  vesselDatasetId: 'vDi',
  vesselRegistryId: 'vRi',
  vesselSelfReportedId: 'vSRi',
  vesselSection: 'vS',
  vesselArea: 'vA',
  vesselRelated: 'vR',
  vesselIdentitySource: 'vIs',
  vesselActivityMode: 'vAm',
  viewOnlyVessel: 'vVO',
  // Vessel Group Report
  'vessel-groups': 'vGs',
  vGRActivitySubsection: 'vGRAS',
  vGREventsResultsPerPage: 'vGRERPP',
  vGREventsSubsection: 'vGRES',
  vGREventsVesselFilter: 'vGREVF',
  vGREventsVesselPage: 'vGREVP',
  vGREventsVesselsProperty: 'vGREVProp',
  vGRSection: 'vGRS',
  vGRVesselFilter: 'vGRVF',
  vGRVesselPage: 'vGRVP',
  vGRVesselsOrderDirection: 'vGRVOD',
  vGRVesselsOrderProperty: 'vGRVOP',
  vGRVesselsResultsPerPage: 'vGRRPP',
  vGRVesselsSubsection: 'vGRSS',
  viewOnlyVesselGroup: 'vOVG',
  // Area report
  reportActivityGraph: 'rAG',
  reportAreaBounds: 'rAB',
  reportBufferOperation: 'rBO',
  reportBufferUnit: 'rBU',
  reportBufferValue: 'rBV',
  reportCategory: 'rC',
  reportResultsPerPage: 'rRPP',
  reportTimeComparison: 'rTC',
  reportVesselFilter: 'rVF',
  reportVesselGraph: 'rVG',
  reportVesselPage: 'rVP',
  reportLoadVessels: 'rLV',
}
const ABBREVIATED_TO_PARAMS = invert(PARAMS_TO_ABBREVIATED)

const hasParamToBeAbbreviatedDuplicated = () => {
  const paramsToBeAbbreviatedDuplicated = new Set(Object.values(PARAMS_TO_ABBREVIATED))
  return paramsToBeAbbreviatedDuplicated.size !== Object.keys(PARAMS_TO_ABBREVIATED).length
}
if (hasParamToBeAbbreviatedDuplicated()) {
  throw new Error('Duplicated abbreviated params')
}

const TOKEN_PREFIX = '~'
export const TOKEN_REGEX = /~(\d+)/

const parseIntNumber = (value: any) => (typeof value === 'string' ? parseInt(value) : value)

const BASE_URL_TO_OBJECT_TRANSFORMATION: Record<string, (value: any) => any> = {
  start: (start) => decodeURIComponent(start),
  end: (end) => decodeURIComponent(end),
  latitude: (latitude) => parseFloat(latitude),
  longitude: (longitude) => parseFloat(longitude),
  zoom: (zoom) => parseFloat(zoom),
  reportVesselPage: parseIntNumber,
  reportResultsPerPage: parseIntNumber,
  reportEventsPortsPage: parseIntNumber,
  vGRVesselPage: parseIntNumber,
  vGRVesselsResultsPerPage: parseIntNumber,
  vGREventsVesselPage: parseIntNumber,
  vGREventsResultsPerPage: parseIntNumber,
  vesselIdentityIndex: (index) => parseInt(index),
  reportTimeComparison: (reportTimeComparison = {}) => ({
    ...reportTimeComparison,
    duration: parseInt(reportTimeComparison.duration),
  }),
  mapRulers: (rulers: { id: string }[]) => {
    return rulers?.map((ruler) => ({ ...ruler, id: parseIntNumber(ruler.id) }))
  },
  mapDrawing: (drawing: boolean | string) => {
    if (drawing === true || drawing === 'true') {
      return 'polygons'
    }
    return drawing
  },
  dataviewInstances: (dataviewInstances: AnyDataviewInstance[]) => {
    return dataviewInstances.map(parseDataviewInstance)
  },
}

const deepReplaceKeys = (obj: Dictionary<any>, keysMap: Dictionary<string>) => {
  return transform(obj, (result: any, value, key) => {
    const newKey = keysMap[key] || key
    result[newKey] = isObject(value) ? deepReplaceKeys(value, keysMap) : value
  })
}

const getObjectTokens = (obj: Dictionary<any>) => {
  const tokens: string[] = []
  Object.entries(obj).forEach(([key, value]) => {
    if (key !== 'start' && key !== 'end') {
      if (isObject(value)) tokens.push(...getObjectTokens(value))
      else if (isString(value)) tokens.push(value as string)
    }
  })
  return tokens
}

// Replace repeated values
const deepTokenizeValues = (obj: Dictionary<any>) => {
  const tokens = getObjectTokens(obj)

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
        const matchesToken = value.match(TOKEN_REGEX)
        if (!matchesToken) {
          result[key] = value
          return
        }
        const tokenIndex = parseInt(matchesToken[1])
        const token = tokens?.[tokenIndex]
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

export const parseLegacyDataviewInstanceConfig = (
  dataviewInstance: AnyDataviewInstance
): UrlDataviewInstance => {
  return {
    ...dataviewInstance,
    config: {
      ...dataviewInstance.config,
      ...(dataviewInstance?.config?.datasets?.length && {
        datasets: dataviewInstance.config.datasets.map(runDatasetMigrations),
      }),
      ...(dataviewInstance?.config?.info && {
        info: runDatasetMigrations(dataviewInstance?.config?.info),
      }),
      ...(dataviewInstance?.config?.events?.length && {
        events: dataviewInstance?.config?.events.map((d) => migrateEventsLegacyDatasets(d)),
      }),
    },
    ...(dataviewInstance.datasetsConfig && {
      datasetsConfig: dataviewInstance.datasetsConfig.map((dc) => ({
        ...dc,
        datasetId: runDatasetMigrations(dc?.datasetId),
        endpoint: removeLegacyEndpointPrefix(dc?.endpoint),
      })),
    }),
  }
}

const parseDataviewInstance = (dataview: UrlDataviewInstance) => {
  const dataviewId = dataview.dataviewId?.toString()
  const breaks = dataview.config?.breaks?.map((b: any) => parseFloat(b))
  const vesselGroups = dataview.config?.filters?.['vessel-groups'] as string | string[] | undefined
  // Legacy workspaces supported multiple vessel groups but this is not supported anymore so we pick the first one
  const vesselGroup = Array.isArray(vesselGroups) ? vesselGroups[0] : vesselGroups
  const config = { ...dataview.config }
  if (breaks) {
    config.breaks = breaks
  }
  if (dataview.config?.color !== undefined) {
    config.color = decodeURIComponent(dataview.config?.color)
  }
  if (dataview.config?.datasets !== undefined && dataview.config?.datasets.length) {
    config.datasets = dataview.config?.datasets.map((datasetId) => decodeURIComponent(datasetId))
  }
  if (dataview.config?.maxVisibleValue !== undefined) {
    config.maxVisibleValue = parseFloat(dataview.config?.maxVisibleValue as any)
  }
  if (dataview.config?.minVisibleValue !== undefined) {
    config.minVisibleValue = parseFloat(dataview.config?.minVisibleValue as any)
  }
  if (dataview.config?.thickness !== undefined) {
    config.thickness = parseInt(dataview.config?.thickness as any)
  }
  if (vesselGroup) {
    if (!config.filters) {
      config.filters = {}
    }
    config.filters['vessel-groups'] = [vesselGroup]
  }
  return parseLegacyDataviewInstanceConfig({
    ...dataview,
    ...(dataviewId && { dataviewId }),
    config,
  })
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
  if (parsed.analysis) {
    // Removes old legacy analysis param replaced by reports
    delete parsed.analysis
  }
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

export const URL_STRINGIFY_CONFIG = {
  encodeValuesOnly: true,
  strictNullHandling: true,
}

export const stringifyWorkspace = (object: BaseUrlWorkspace) => {
  const objectWithAbbr = deepReplaceKeys(object, PARAMS_TO_ABBREVIATED)
  const tokenized = deepTokenizeValues(objectWithAbbr)
  const stringified = stringify(tokenized, URL_STRINGIFY_CONFIG)
  return stringified
}
