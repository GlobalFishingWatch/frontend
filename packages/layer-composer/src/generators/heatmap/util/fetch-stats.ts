import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import { API_GATEWAY } from '../../../layer-composer'
import { isUrlAbsolute } from '../../../utils'
import { GlobalHeatmapGeneratorConfig } from '../heatmap'
import { Stats, StatsByZoom } from '../types'
import { toURLArray } from '.'

const controllerCache: { [key: string]: AbortController } = {}
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
  if (controllerCache[url]) {
    controllerCache[url].abort()
  }
  const statsUrlString = statsUrl.toString()
  const finalurl = statsFilters ? statsUrlString + `&${statsFilters}` : statsUrl.toString()
  controllerCache[url] = new AbortController()
  return fetch(finalurl, {
    signal: controllerCache[url].signal,
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
