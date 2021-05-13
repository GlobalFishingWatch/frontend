import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import { API_GATEWAY, API_GATEWAY_VERSION } from '../../../layer-composer'
import { API_ENDPOINTS } from '../config'
import { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'
import { HeatmapAnimatedMode } from '../../types'
import { isUrlAbsolute } from '../../../utils'
import { Interval } from './time-chunks'
import { toURLArray } from '.'

export type Breaks = number[][]

export type FetchBreaksParams = Pick<
  GlobalHeatmapAnimatedGeneratorConfig,
  'breaksAPI' | 'sublayers' | 'datasetsEnd' | 'token' | 'end' | 'mode' | 'zoomLoadLevel'
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
  const filters = config.sublayers.map((sublayer) => sublayer.filter || '')
  return filters?.length ? toURLArray('filters', filters) : ''
}

const getDatasetsWithoutCache = (config: FetchBreaksParams): string[] => {
  const datasets = getDatasets(config)
  const filters = getFiltersQuery(config)
  return datasets.filter((dataset) => datasetsCache[filters]?.[dataset] === undefined)
}

const getBreaksUrl = (config: FetchBreaksParams): string => {
  const url = getBreaksBaseUrl(config)
    .replace(/{{/g, '{')
    .replace(/}}/g, '}')
    .replace('{zoom}', '0')

  const datasets = getDatasets(config)
  const datasetsQuery = datasets?.length ? toURLArray('datasets', datasets) : ''
  const filtersQuery = getFiltersQuery(config)

  return `${url}?${datasetsQuery}&${filtersQuery}`
}

const parseBreaksResponse = (config: FetchBreaksParams, breaks: Breaks) => {
  const max = Math.max(...breaks.flatMap((b) => b))
  const maxBreaks = breaks.find((b, index) => b[breaks[index].length - 1] === max) || breaks[0]
  // We want to use the biggest break in every sublayer
  return config.sublayers.map(() => maxBreaks)
}

let controllerCache: AbortController | undefined

export default function fetchBreaks(config: FetchBreaksParams): Promise<Breaks> {
  const isBivariate = config.mode === HeatmapAnimatedMode.Bivariate
  const filters = getFiltersQuery(config)
  const allDatasets = getDatasets(config)
  const datasetsWithoutCache = getDatasetsWithoutCache(config)

  if (!datasetsWithoutCache?.length) {
    return new Promise((resolve) => {
      const breaks = allDatasets.map((dataset) => datasetsCache[filters]?.[dataset]) as Breaks
      resolve(parseBreaksResponse(config, breaks))
    })
  }

  const breaksUrl = new URL(getBreaksUrl(config))
  breaksUrl.searchParams.set('temporal-aggregation', 'false')
  breaksUrl.searchParams.set('numBins', isBivariate ? '4' : '9')
  breaksUrl.searchParams.set('interval', '10days')

  const url = breaksUrl.toString()
  const { token } = config
  if (controllerCache) {
    controllerCache.abort()
  }

  controllerCache = new AbortController()
  return fetch(url, {
    signal: controllerCache.signal,
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
    .then((breaks: Breaks) => {
      // datasetsCache[filters]
      const breaksByDataset = Object.fromEntries(
        allDatasets.map((dataset, index) => [dataset, breaks[index]])
      )
      datasetsCache[filters] = breaksByDataset
      return parseBreaksResponse(config, breaks)
    })
    .catch((e) => {
      if (e.name !== 'AbortError') {
        console.warn(e)
      }
      throw e
    })
}
