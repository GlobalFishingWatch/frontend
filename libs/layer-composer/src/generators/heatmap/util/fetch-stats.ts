import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'

import { API_GATEWAY } from '../../../config'
import { isUrlAbsolute } from '../../../utils'
import { toURLArray } from '../../utils'
import type { GlobalHeatmapGeneratorConfig } from '../heatmap'
import type { Stats, StatsByZoom } from '../types'

let controllerCache: AbortController
export default function fetchStats(config: GlobalHeatmapGeneratorConfig) {
  const { token, datasets, filters, statsFilter, start, end } = config
  const statsFilters = [filters, statsFilter].filter((f) => f).join(' AND ')
  const dateRange = [start, end].join(',')
  const baseUrl =
    config.statsUrl && isUrlAbsolute(config.statsUrl as string)
      ? config.statsUrl
      : API_GATEWAY + config.statsUrl
  const url = `${baseUrl}?${toURLArray('datasets', datasets)}`

  const statsUrl = new URL(url)
  statsUrl.searchParams.set('temporal-aggregation', 'true')

  if (dateRange) {
    statsUrl.searchParams.set('date-range', dateRange)
  }
  if (controllerCache) {
    controllerCache.abort()
  }
  const statsUrlString = statsUrl.toString()
  const finalurl = statsFilters ? statsUrlString + `&${statsFilters}` : statsUrl.toString()
  controllerCache = new AbortController()
  return fetch(finalurl, {
    signal: controllerCache?.signal,
    ...(config.token && {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  })
    .then((r) => {
      if (r.ok) return r.json()
      throw r
    })
    .then((statsResponse) => {
      const stats = statsResponse.reduce((acc: StatsByZoom, next: Stats) => {
        acc[next.zoom] = next
        return acc
      }, {})
      return stats
    })
    .catch((e) => {
      console.warn(e)
      throw e
    })
}
