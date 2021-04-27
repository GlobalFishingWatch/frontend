import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import uniq from 'lodash/uniq'
import { API_GATEWAY, API_GATEWAY_VERSION } from '../../../layer-composer'
import { API_ENDPOINTS } from '../config'
import { GlobalHeatmapAnimatedGeneratorConfig } from '../heatmap-animated'
import { Interval } from './time-chunks'
import { toURLArray } from '.'

export type Breaks = number[][]

export type FetchBreaksParams = Pick<
  GlobalHeatmapAnimatedGeneratorConfig,
  'breaksAPI' | 'sublayers' | 'datasetsEnd' | 'token' | 'end'
> & { interval: Interval }

const getBreaksUrl = (config: FetchBreaksParams): string => {
  const url = `${config.breaksAPI || `${API_GATEWAY}/${API_GATEWAY_VERSION}`}/${
    API_ENDPOINTS.breaks
  }`
    .replace(/{{/g, '{')
    .replace(/}}/g, '}')
    .replace('{zoom}', '0')

  const datasets = uniq(
    config.sublayers
      .filter((sublayer) => sublayer.visible)
      .flatMap((s) => s.datasets.flatMap((d) => d))
  )
  const datasetsQuery = datasets?.length ? toURLArray('datasets', datasets) : ''

  const filters = config.sublayers.map((sublayer) => sublayer.filter || '')
  const filtersQuery = filters?.length ? toURLArray('filters', filters) : ''
  return `${url}?${datasetsQuery}&${filtersQuery}`
}

let controllerCache: AbortController | undefined

export default function fetchBreaks(config: FetchBreaksParams) {
  const breaksUrl = new URL(getBreaksUrl(config))
  breaksUrl.searchParams.set('temporal-aggregation', 'false')
  breaksUrl.searchParams.set('numBins', '10')
  breaksUrl.searchParams.set('interval', '10days')

  const url = breaksUrl.toString()
  const { token, sublayers } = config
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
