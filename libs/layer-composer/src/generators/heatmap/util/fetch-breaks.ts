import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'

import { API_GATEWAY, API_GATEWAY_VERSION } from '../../../config'
import { isUrlAbsolute } from '../../../utils'
import { HeatmapAnimatedMode } from '../../types'
import { toURLArray } from '../../utils'
import { API_ENDPOINTS, COLOR_RAMP_DEFAULT_NUM_STEPS } from '../config'
import type { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'
import type { Interval } from '../types'

export type Breaks = number[][]

const BREAKS_FALLBACK = {
  'global-fishing-effort': [0, 538, 2018, 4682, 10945, 30661, 59568, 106877, 118773],
  'chile-fishing-effort': [0, 21, 76, 175, 322, 796, 1362, 1633, 1750],
  'indonesia-fishing-effort': [0, 112, 414, 997, 1895, 2942, 5294, 7498, 8667],
  'panama-fishing-effort': [0, 17, 63, 138, 264, 528, 749, 1337, 2265],
  'peru-fishing-effort': [0, 13, 48, 128, 287, 529, 1022, 1732, 2108],
  'global-presence': [0, 414, 1592, 3284, 6274, 10945, 19804, 32516, 56157],
}
type DefaultDatasets = keyof typeof BREAKS_FALLBACK

export type FetchBreaksParams = Pick<
  GlobalHeatmapAnimatedGeneratorConfig,
  'breaksAPI' | 'sublayers' | 'datasetsEnd' | 'token' | 'start' | 'end' | 'mode' | 'zoomLoadLevel'
> & { interval: Interval }

// Stores datasets breaks by filters, so when we already have we avoid requesting again
// { flag:spain: { ais: string[] }}
const datasetsCache: Record<string, Record<string, number[]>> = {}

export const getBreaksZoom = (zoom: number) => {
  return zoom >= 3 ? 3 : 0
}

const getBreaksBaseUrl = (config: FetchBreaksParams): string => {
  if (config.breaksAPI) {
    return isUrlAbsolute(config.breaksAPI) ? config.breaksAPI : API_GATEWAY + config.breaksAPI
  }
  return `${API_GATEWAY}/${API_GATEWAY_VERSION}/${API_ENDPOINTS.breaks}`
}

const getDatasets = (config: FetchBreaksParams): string[] => {
  const datasets = config.sublayers
    .filter((sublayer) => sublayer.visible)
    .flatMap((s) => s.datasets.flatMap((d) => d))
  return datasets
}

const getFiltersQuery = (config: FetchBreaksParams): string => {
  const filters = config.sublayers?.map((sublayer) => sublayer.filter || '')
  return filters?.length ? toURLArray('filters', filters) : ''
}

const getVesselGroupsQuery = (config: FetchBreaksParams): string => {
  const filters = config.sublayers?.map((sublayer) => sublayer.vesselGroups || '')
  return filters?.length ? toURLArray('vessel-groups', filters) : ''
}

export const isDirectAPIBreaks = (config: FetchBreaksParams): boolean => {
  return getVesselGroupsQuery(config) !== ''
}

export const getBreaksCacheKey = (config: FetchBreaksParams): string => {
  const filters = getFiltersQuery(config)
  const groups = getVesselGroupsQuery(config)
  const baseParamsCache = [config.mode, filters]
  if (groups) {
    return [...baseParamsCache, groups, config.start, config.end].join(',')
  }
  return baseParamsCache.join(',')
}

const getDatasetsWithoutCache = (config: FetchBreaksParams): string[] => {
  const datasets = getDatasets(config)
  const cacheKey = getBreaksCacheKey(config)
  return datasets.filter((dataset) => datasetsCache[cacheKey]?.[dataset] === undefined)
}

const getBreaksUrl = (config: FetchBreaksParams): string => {
  const url = getBreaksBaseUrl(config)
    .replace(/{{/g, '{')
    .replace(/}}/g, '}')
    .replace('{zoom}', '0')

  const datasets = getDatasets(config)
  const datasetsQuery = datasets?.length ? toURLArray('datasets', datasets) : ''
  const filtersQuery = getFiltersQuery(config)
  const vesselGroupsQuery = getVesselGroupsQuery(config)
  const queries = [filtersQuery, vesselGroupsQuery].filter(Boolean)

  return `${url}?${datasetsQuery}&${queries.join('&')}`
}

const getNumBins = (config: FetchBreaksParams) => {
  if (
    config.mode === HeatmapAnimatedMode.Bivariate ||
    config.mode === HeatmapAnimatedMode.TimeCompare
  ) {
    return 4
  }
  return COLOR_RAMP_DEFAULT_NUM_STEPS - 1
}

const parseBreaksResponse = (config: FetchBreaksParams, breaks: Breaks) => {
  const bins = getNumBins(config)
  const cleanBreaks = breaks?.map((b) => {
    return b?.length === bins ? b : new Array(bins).fill(0)
  })
  const max = Math.max(...cleanBreaks.flatMap((b) => b))
  const maxBreaks =
    cleanBreaks.find((b, index) => b[cleanBreaks[index].length - 1] === max) || cleanBreaks[0]
  // We want to use the biggest break in every sublayer
  return config.sublayers?.map(() => maxBreaks)
}

let controllerCache: AbortController | undefined

export default function fetchBreaks(config: FetchBreaksParams): Promise<Breaks> {
  const cacheKey = getBreaksCacheKey(config)
  const allDatasets = getDatasets(config)
  const datasetsWithoutCache = getDatasetsWithoutCache(config)

  if (!datasetsWithoutCache?.length) {
    return new Promise((resolve) => {
      const breaks = allDatasets.map((dataset) => datasetsCache[cacheKey]?.[dataset]) as Breaks
      resolve(parseBreaksResponse(config, breaks))
    })
  }

  const breaksUrl = new URL(getBreaksUrl(config))
  breaksUrl.searchParams.set('temporal-aggregation', 'false')
  breaksUrl.searchParams.set('num-bins', getNumBins(config).toString())
  const groups = getVesselGroupsQuery(config)
  breaksUrl.searchParams.set('interval', groups ? config.interval : 'MONTH')
  if (groups && config.start && config.end) {
    // TODO debounce the request when this changes
    breaksUrl.searchParams.set('date-range', [config.start, config.end].join(','))
  }

  const url = breaksUrl.toString()
  const { token } = config
  if (controllerCache) {
    controllerCache.abort()
  }

  controllerCache = new AbortController()
  return fetch(url, {
    signal: controllerCache?.signal,
    ...(token && {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  })
    .then((r) => {
      if (r.ok) return r.json()
      throw r
    })
    .then(({ entries: breaks }: { entries: Breaks }) => {
      const breaksByDataset = Object.fromEntries(
        allDatasets.map((dataset, index) => [dataset, breaks[index]])
      )
      datasetsCache[cacheKey] = breaksByDataset
      return parseBreaksResponse(config, breaks)
    })
    .catch((e) => {
      if (e.name !== 'AbortError') {
        console.warn('Using default breaks due to the error', e)
      }
      const defaultDatasetKeys = Object.keys(BREAKS_FALLBACK) as DefaultDatasets[]
      const breaks = allDatasets.map((dataset) => {
        const defaultDataset = defaultDatasetKeys.find((defaultDataset) =>
          dataset?.includes(defaultDataset)
        )
        return defaultDataset
          ? BREAKS_FALLBACK[defaultDataset]
          : BREAKS_FALLBACK['global-fishing-effort']
      })
      return parseBreaksResponse(config, breaks)
    })
}
