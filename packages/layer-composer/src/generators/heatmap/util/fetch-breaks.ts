import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import { DateTime } from 'luxon'
import { API_GATEWAY, API_GATEWAY_VERSION } from '../../../layer-composer'
import { API_ENDPOINTS } from '../config'
import { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'
import { Interval } from './time-chunks'
import { toURLArray } from '.'

export type Breaks = number[][]

export type FetchBreaksParams = Pick<
  GlobalHeatmapAnimatedGeneratorConfig,
  'breaksAPI' | 'sublayers' | 'datasetsEnd' | 'token'
> & { interval: Interval }

const getBreaksUrl = (config: FetchBreaksParams): string => {
  const url = `${config.breaksAPI || `${API_GATEWAY}/${API_GATEWAY_VERSION}`}/${
    API_ENDPOINTS.breaks
  }`
    .replace(/{{/g, '{')
    .replace(/}}/g, '}')
    .replace('{zoom}', '0')

  const datasets = config.sublayers.flatMap((s) => s.datasets.flatMap((d) => d))
  const datasetsQuery = datasets?.length ? toURLArray('datasets', datasets) : ''
  return `${url}?${datasetsQuery}`
}

const controllerCache: { [key: string]: AbortController } = {}

export default function fetchBreaks(config: FetchBreaksParams) {
  const breaksUrl = new URL(getBreaksUrl(config))
  breaksUrl.searchParams.set('temporal-aggregation', 'true')
  breaksUrl.searchParams.set('numBinds', '8')
  breaksUrl.searchParams.set('interval', 'day')
  const end = DateTime.fromISO(config.datasetsEnd).toISODate()
  const start = DateTime.fromISO(end).minus({ years: 1 }).toISODate()
  // Requesting the latest dataset year to use as baseline
  breaksUrl.searchParams.set('date-range', [start, end].join(','))

  const url = breaksUrl.toString()
  const { token, sublayers } = config
  if (controllerCache[url]) {
    controllerCache[url].abort()
  }
  // TODO review if we need to remove the controller once the request is finished to avoid memory leaks
  controllerCache[url] = new AbortController()
  return fetch(url, {
    signal: controllerCache[url].signal,
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
      const max = Math.max(...breaks.flatMap((b) => b))
      const maxBreaks = breaks.find((b, index) => b[breaks[index].length - 1] === max) || breaks[0]
      // We want to use the biggest break in every sublayer
      return sublayers.map(() => maxBreaks)
    })
    .catch((e) => {
      console.warn(e)
      throw e
    })
}
