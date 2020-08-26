import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import { stats, statsByZoom } from '../types'

type ExtendedPromise<T> = Promise<T> & {
  resolved?: boolean
  error?: boolean
}

type FetchStatsOptions = {
  token?: string
  singleFrame?: boolean
  serverSideFilters?: string
}
const controllerCache: { [key: string]: AbortController } = {}
export default function fetchStats(url: string, options: FetchStatsOptions) {
  const { serverSideFilters, singleFrame, token } = options
  const statsUrl = new URL(url)
  if (singleFrame) {
    statsUrl.searchParams.set('temporal-aggregation', 'true')
  }
  if (serverSideFilters) {
    statsUrl.searchParams.set('filters', serverSideFilters)
  }
  if (controllerCache[url]) {
    controllerCache[url].abort()
  }
  controllerCache[url] = new AbortController()
  const promise: ExtendedPromise<statsByZoom> = fetch(statsUrl.toString(), {
    signal: controllerCache[url].signal,
    ...(token && {
      header: {
        Authorization: `Bearer ${token}`,
      },
    }),
  })
    .then((r) => {
      if (r.ok) return r.json()
      throw r
    })
    .then((statsResponse) => {
      const stats = statsResponse.reduce((acc: statsByZoom, next: stats) => {
        acc[next.zoom] = next
        return acc
      }, {})
      promise.resolved = true
      return stats
    })
    .catch((e) => {
      console.warn(e)
      promise.resolved = true
      promise.error = true
      throw e
    })
  promise.resolved = false
  promise.error = false
  return promise
}
